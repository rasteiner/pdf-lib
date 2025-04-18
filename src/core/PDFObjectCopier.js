import PDFArray from '@/core/objects/PDFArray';
import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFRef from '@/core/objects/PDFRef';
import PDFStream from '@/core/objects/PDFStream';
import PDFPageLeaf from '@/core/structures/PDFPageLeaf';
/**
 * PDFObjectCopier copies PDFObjects from a src context to a dest context.
 * The primary use case for this is to copy pages between PDFs.
 *
 * _Copying_ an object with a PDFObjectCopier is different from _cloning_ an
 * object with its [[PDFObject.clone]] method:
 *
 * ```
 *   const src: PDFContext = ...
 *   const dest: PDFContext = ...
 *   const originalObject: PDFObject = ...
 *   const copiedObject = PDFObjectCopier.for(src, dest).copy(originalObject);
 *   const clonedObject = originalObject.clone();
 * ```
 *
 * Copying an object is equivalent to cloning it and then copying over any other
 * objects that it references. Note that only dictionaries, arrays, and streams
 * (or structures build from them) can contain indirect references to other
 * objects. Copying a PDFObject that is not a dictionary, array, or stream is
 * supported, but is equivalent to cloning it.
 */
class PDFObjectCopier {
    constructor(src, dest) {
        Object.defineProperty(this, "src", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dest", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "traversedObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // prettier-ignore
        Object.defineProperty(this, "copy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (object) => (object instanceof PDFPageLeaf ? this.copyPDFPage(object)
                : object instanceof PDFDict ? this.copyPDFDict(object)
                    : object instanceof PDFArray ? this.copyPDFArray(object)
                        : object instanceof PDFStream ? this.copyPDFStream(object)
                            : object instanceof PDFRef ? this.copyPDFIndirectObject(object)
                                : object.clone())
        });
        Object.defineProperty(this, "copyPDFPage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (originalPage) => {
                const clonedPage = originalPage.clone();
                // Move any entries that the originalPage is inheriting from its parent
                // tree nodes directly into originalPage so they are preserved during
                // the copy.
                const { InheritableEntries } = PDFPageLeaf;
                for (let idx = 0, len = InheritableEntries.length; idx < len; idx++) {
                    const key = PDFName.of(InheritableEntries[idx]);
                    const value = clonedPage.getInheritableAttribute(key);
                    if (!clonedPage.get(key) && value)
                        clonedPage.set(key, value);
                }
                // Remove the parent reference to prevent the whole donor document's page
                // tree from being copied when we only need a single page.
                clonedPage.delete(PDFName.of('Parent'));
                return this.copyPDFDict(clonedPage);
            }
        });
        Object.defineProperty(this, "copyPDFDict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (originalDict) => {
                if (this.traversedObjects.has(originalDict)) {
                    return this.traversedObjects.get(originalDict);
                }
                const clonedDict = originalDict.clone(this.dest);
                this.traversedObjects.set(originalDict, clonedDict);
                const entries = originalDict.entries();
                for (let idx = 0, len = entries.length; idx < len; idx++) {
                    const [key, value] = entries[idx];
                    clonedDict.set(key, this.copy(value));
                }
                return clonedDict;
            }
        });
        Object.defineProperty(this, "copyPDFArray", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (originalArray) => {
                if (this.traversedObjects.has(originalArray)) {
                    return this.traversedObjects.get(originalArray);
                }
                const clonedArray = originalArray.clone(this.dest);
                this.traversedObjects.set(originalArray, clonedArray);
                for (let idx = 0, len = originalArray.size(); idx < len; idx++) {
                    const value = originalArray.get(idx);
                    clonedArray.set(idx, this.copy(value));
                }
                return clonedArray;
            }
        });
        Object.defineProperty(this, "copyPDFStream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (originalStream) => {
                if (this.traversedObjects.has(originalStream)) {
                    return this.traversedObjects.get(originalStream);
                }
                const clonedStream = originalStream.clone(this.dest);
                this.traversedObjects.set(originalStream, clonedStream);
                const entries = originalStream.dict.entries();
                for (let idx = 0, len = entries.length; idx < len; idx++) {
                    const [key, value] = entries[idx];
                    clonedStream.dict.set(key, this.copy(value));
                }
                return clonedStream;
            }
        });
        Object.defineProperty(this, "copyPDFIndirectObject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (ref) => {
                const alreadyMapped = this.traversedObjects.has(ref);
                if (!alreadyMapped) {
                    const newRef = this.dest.nextRef();
                    this.traversedObjects.set(ref, newRef);
                    const dereferencedValue = this.src.lookup(ref);
                    if (dereferencedValue) {
                        const cloned = this.copy(dereferencedValue);
                        this.dest.assign(newRef, cloned);
                    }
                }
                return this.traversedObjects.get(ref);
            }
        });
        this.src = src;
        this.dest = dest;
    }
}
Object.defineProperty(PDFObjectCopier, "for", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (src, dest) => new PDFObjectCopier(src, dest)
});
export default PDFObjectCopier;
