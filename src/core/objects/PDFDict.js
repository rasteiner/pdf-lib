import PDFName from '@/core/objects/PDFName';
import PDFNull from '@/core/objects/PDFNull';
import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
class PDFDict extends PDFObject {
    constructor(map, context) {
        super();
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = map;
        this.context = context;
    }
    keys() {
        return Array.from(this.dict.keys());
    }
    values() {
        return Array.from(this.dict.values());
    }
    entries() {
        return Array.from(this.dict.entries());
    }
    set(key, value) {
        this.dict.set(key, value);
    }
    get(key, 
    // TODO: `preservePDFNull` is for backwards compatibility. Should be
    // removed in next breaking API change.
    preservePDFNull = false) {
        const value = this.dict.get(key);
        if (value === PDFNull && !preservePDFNull)
            return undefined;
        return value;
    }
    has(key) {
        const value = this.dict.get(key);
        return value !== undefined && value !== PDFNull;
    }
    lookupMaybe(key, ...types) {
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        const preservePDFNull = types.includes(PDFNull);
        const value = this.context.lookupMaybe(this.get(key, preservePDFNull), 
        // @ts-ignore
        ...types);
        if (value === PDFNull && !preservePDFNull)
            return undefined;
        return value;
    }
    lookup(key, ...types) {
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        const preservePDFNull = types.includes(PDFNull);
        const value = this.context.lookup(this.get(key, preservePDFNull), 
        // @ts-ignore
        ...types);
        if (value === PDFNull && !preservePDFNull)
            return undefined;
        return value;
    }
    delete(key) {
        return this.dict.delete(key);
    }
    asMap() {
        return new Map(this.dict);
    }
    /** Generate a random key that doesn't exist in current key set */
    uniqueKey(tag = '') {
        const existingKeys = this.keys();
        let key = PDFName.of(this.context.addRandomSuffix(tag, 10));
        while (existingKeys.includes(key)) {
            key = PDFName.of(this.context.addRandomSuffix(tag, 10));
        }
        return key;
    }
    clone(context) {
        const clone = PDFDict.withContext(context || this.context);
        const entries = this.entries();
        for (let idx = 0, len = entries.length; idx < len; idx++) {
            const [key, value] = entries[idx];
            clone.set(key, value);
        }
        return clone;
    }
    toString() {
        let dictString = '<<\n';
        const entries = this.entries();
        for (let idx = 0, len = entries.length; idx < len; idx++) {
            const [key, value] = entries[idx];
            dictString += key.toString() + ' ' + value.toString() + '\n';
        }
        dictString += '>>';
        return dictString;
    }
    sizeInBytes() {
        let size = 5;
        const entries = this.entries();
        for (let idx = 0, len = entries.length; idx < len; idx++) {
            const [key, value] = entries[idx];
            size += key.sizeInBytes() + value.sizeInBytes() + 2;
        }
        return size;
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        buffer[offset++] = CharCodes.LessThan;
        buffer[offset++] = CharCodes.LessThan;
        buffer[offset++] = CharCodes.Newline;
        const entries = this.entries();
        for (let idx = 0, len = entries.length; idx < len; idx++) {
            const [key, value] = entries[idx];
            offset += key.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Space;
            offset += value.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
        }
        buffer[offset++] = CharCodes.GreaterThan;
        buffer[offset++] = CharCodes.GreaterThan;
        return offset - initialOffset;
    }
}
Object.defineProperty(PDFDict, "withContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => new PDFDict(new Map(), context)
});
Object.defineProperty(PDFDict, "fromMapWithContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (map, context) => new PDFDict(map, context)
});
export default PDFDict;
