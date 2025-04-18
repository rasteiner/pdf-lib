import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
import { copyStringIntoBuffer } from '@/utils';
class PDFOperator {
    constructor(name, args) {
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "args", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.args = args || [];
    }
    clone(context) {
        const args = new Array(this.args.length);
        for (let idx = 0, len = args.length; idx < len; idx++) {
            const arg = this.args[idx];
            args[idx] = arg instanceof PDFObject ? arg.clone(context) : arg;
        }
        return PDFOperator.of(this.name, args);
    }
    toString() {
        let value = '';
        for (let idx = 0, len = this.args.length; idx < len; idx++) {
            value += String(this.args[idx]) + ' ';
        }
        value += this.name;
        return value;
    }
    sizeInBytes() {
        let size = 0;
        for (let idx = 0, len = this.args.length; idx < len; idx++) {
            const arg = this.args[idx];
            size += (arg instanceof PDFObject ? arg.sizeInBytes() : arg.length) + 1;
        }
        size += this.name.length;
        return size;
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        for (let idx = 0, len = this.args.length; idx < len; idx++) {
            const arg = this.args[idx];
            if (arg instanceof PDFObject) {
                offset += arg.copyBytesInto(buffer, offset);
            }
            else {
                offset += copyStringIntoBuffer(arg, buffer, offset);
            }
            buffer[offset++] = CharCodes.Space;
        }
        offset += copyStringIntoBuffer(this.name, buffer, offset);
        return offset - initialOffset;
    }
}
Object.defineProperty(PDFOperator, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (name, args) => new PDFOperator(name, args)
});
export default PDFOperator;
