import PDFFlateStream from '@/core/structures/PDFFlateStream';
import CharCodes from '@/core/syntax/CharCodes';
class PDFContentStream extends PDFFlateStream {
    constructor(dict, operators, encode = true) {
        super(dict, encode);
        Object.defineProperty(this, "operators", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.operators = operators;
    }
    push(...operators) {
        this.operators.push(...operators);
    }
    clone(context) {
        const operators = new Array(this.operators.length);
        for (let idx = 0, len = this.operators.length; idx < len; idx++) {
            operators[idx] = this.operators[idx].clone(context);
        }
        const { dict, encode } = this;
        return PDFContentStream.of(dict.clone(context), operators, encode);
    }
    getContentsString() {
        let value = '';
        for (let idx = 0, len = this.operators.length; idx < len; idx++) {
            value += `${this.operators[idx]}\n`;
        }
        return value;
    }
    getUnencodedContents() {
        const buffer = new Uint8Array(this.getUnencodedContentsSize());
        let offset = 0;
        for (let idx = 0, len = this.operators.length; idx < len; idx++) {
            offset += this.operators[idx].copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
        }
        return buffer;
    }
    getUnencodedContentsSize() {
        let size = 0;
        for (let idx = 0, len = this.operators.length; idx < len; idx++) {
            size += this.operators[idx].sizeInBytes() + 1;
        }
        return size;
    }
}
Object.defineProperty(PDFContentStream, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, operators, encode = true) => new PDFContentStream(dict, operators, encode)
});
export default PDFContentStream;
