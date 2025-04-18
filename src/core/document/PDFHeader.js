import CharCodes from '@/core/syntax/CharCodes';
import { charFromCode, copyStringIntoBuffer } from '@/utils';
class PDFHeader {
    constructor(major, minor) {
        Object.defineProperty(this, "major", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.major = String(major);
        this.minor = String(minor);
    }
    toString() {
        const bc = charFromCode(129);
        return `%PDF-${this.major}.${this.minor}\n%${bc}${bc}${bc}${bc}`;
    }
    sizeInBytes() {
        return 12 + this.major.length + this.minor.length;
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = CharCodes.P;
        buffer[offset++] = CharCodes.D;
        buffer[offset++] = CharCodes.F;
        buffer[offset++] = CharCodes.Dash;
        offset += copyStringIntoBuffer(this.major, buffer, offset);
        buffer[offset++] = CharCodes.Period;
        offset += copyStringIntoBuffer(this.minor, buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        return offset - initialOffset;
    }
}
Object.defineProperty(PDFHeader, "forVersion", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (major, minor) => new PDFHeader(major, minor)
});
export default PDFHeader;
