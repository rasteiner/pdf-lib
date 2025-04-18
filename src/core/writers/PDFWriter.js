import PDFCrossRefSection from '@/core/document/PDFCrossRefSection';
import PDFHeader from '@/core/document/PDFHeader';
import PDFTrailer from '@/core/document/PDFTrailer';
import PDFTrailerDict from '@/core/document/PDFTrailerDict';
import PDFObjectStream from '@/core/structures/PDFObjectStream';
import CharCodes from '@/core/syntax/CharCodes';
import { copyStringIntoBuffer, waitForTick } from '@/utils';
class PDFWriter {
    constructor(context, objectsPerTick) {
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "objectsPerTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parsedObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "shouldWaitForTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (n) => {
                this.parsedObjects += n;
                return this.parsedObjects % this.objectsPerTick === 0;
            }
        });
        this.context = context;
        this.objectsPerTick = objectsPerTick;
    }
    async serializeToBuffer() {
        const { size, header, indirectObjects, xref, trailerDict, trailer, } = await this.computeBufferSize();
        let offset = 0;
        const buffer = new Uint8Array(size);
        offset += header.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.Newline;
        for (let idx = 0, len = indirectObjects.length; idx < len; idx++) {
            const [ref, object] = indirectObjects[idx];
            const objectNumber = String(ref.objectNumber);
            offset += copyStringIntoBuffer(objectNumber, buffer, offset);
            buffer[offset++] = CharCodes.Space;
            const generationNumber = String(ref.generationNumber);
            offset += copyStringIntoBuffer(generationNumber, buffer, offset);
            buffer[offset++] = CharCodes.Space;
            buffer[offset++] = CharCodes.o;
            buffer[offset++] = CharCodes.b;
            buffer[offset++] = CharCodes.j;
            buffer[offset++] = CharCodes.Newline;
            offset += object.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
            buffer[offset++] = CharCodes.e;
            buffer[offset++] = CharCodes.n;
            buffer[offset++] = CharCodes.d;
            buffer[offset++] = CharCodes.o;
            buffer[offset++] = CharCodes.b;
            buffer[offset++] = CharCodes.j;
            buffer[offset++] = CharCodes.Newline;
            buffer[offset++] = CharCodes.Newline;
            const n = object instanceof PDFObjectStream ? object.getObjectsCount() : 1;
            if (this.shouldWaitForTick(n))
                await waitForTick();
        }
        if (xref) {
            offset += xref.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
        }
        if (trailerDict) {
            offset += trailerDict.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
            buffer[offset++] = CharCodes.Newline;
        }
        offset += trailer.copyBytesInto(buffer, offset);
        return buffer;
    }
    computeIndirectObjectSize([ref, object]) {
        const refSize = ref.sizeInBytes() + 3; // 'R' -> 'obj\n'
        const objectSize = object.sizeInBytes() + 9; // '\nendobj\n\n'
        return refSize + objectSize;
    }
    createTrailerDict() {
        return this.context.obj({
            Size: this.context.largestObjectNumber + 1,
            Root: this.context.trailerInfo.Root,
            Encrypt: this.context.trailerInfo.Encrypt,
            Info: this.context.trailerInfo.Info,
            ID: this.context.trailerInfo.ID,
        });
    }
    async computeBufferSize() {
        const header = PDFHeader.forVersion(1, 7);
        let size = header.sizeInBytes() + 2;
        const xref = PDFCrossRefSection.create();
        const indirectObjects = this.context.enumerateIndirectObjects();
        for (let idx = 0, len = indirectObjects.length; idx < len; idx++) {
            const indirectObject = indirectObjects[idx];
            const [ref] = indirectObject;
            xref.addEntry(ref, size);
            size += this.computeIndirectObjectSize(indirectObject);
            if (this.shouldWaitForTick(1))
                await waitForTick();
        }
        const xrefOffset = size;
        size += xref.sizeInBytes() + 1; // '\n'
        const trailerDict = PDFTrailerDict.of(this.createTrailerDict());
        size += trailerDict.sizeInBytes() + 2; // '\n\n'
        const trailer = PDFTrailer.forLastCrossRefSectionOffset(xrefOffset);
        size += trailer.sizeInBytes();
        return { size, header, indirectObjects, xref, trailerDict, trailer };
    }
}
Object.defineProperty(PDFWriter, "forContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context, objectsPerTick) => new PDFWriter(context, objectsPerTick)
});
export default PDFWriter;
