import { MethodNotImplementedError } from '@/core/errors';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
class PDFStream extends PDFObject {
    constructor(dict) {
        super();
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    clone(_context) {
        throw new MethodNotImplementedError(this.constructor.name, 'clone');
    }
    getContentsString() {
        throw new MethodNotImplementedError(this.constructor.name, 'getContentsString');
    }
    getContents() {
        throw new MethodNotImplementedError(this.constructor.name, 'getContents');
    }
    getContentsSize() {
        throw new MethodNotImplementedError(this.constructor.name, 'getContentsSize');
    }
    updateDict() {
        const contentsSize = this.getContentsSize();
        this.dict.set(PDFName.Length, PDFNumber.of(contentsSize));
    }
    sizeInBytes() {
        this.updateDict();
        return this.dict.sizeInBytes() + this.getContentsSize() + 18;
    }
    toString() {
        this.updateDict();
        let streamString = this.dict.toString();
        streamString += '\nstream\n';
        streamString += this.getContentsString();
        streamString += '\nendstream';
        return streamString;
    }
    copyBytesInto(buffer, offset) {
        this.updateDict();
        const initialOffset = offset;
        offset += this.dict.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.m;
        buffer[offset++] = CharCodes.Newline;
        const contents = this.getContents();
        for (let idx = 0, len = contents.length; idx < len; idx++) {
            buffer[offset++] = contents[idx];
        }
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.n;
        buffer[offset++] = CharCodes.d;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.m;
        return offset - initialOffset;
    }
}
export default PDFStream;
