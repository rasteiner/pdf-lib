import CharCodes from '@/core/syntax/CharCodes';
class PDFTrailerDict {
    constructor(dict) {
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    toString() {
        return `trailer\n${this.dict.toString()}`;
    }
    sizeInBytes() {
        return 8 + this.dict.sizeInBytes();
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.i;
        buffer[offset++] = CharCodes.l;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.Newline;
        offset += this.dict.copyBytesInto(buffer, offset);
        return offset - initialOffset;
    }
}
Object.defineProperty(PDFTrailerDict, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new PDFTrailerDict(dict)
});
export default PDFTrailerDict;
