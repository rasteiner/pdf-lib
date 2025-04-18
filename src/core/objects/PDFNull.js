import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
class PDFNull extends PDFObject {
    asNull() {
        return null;
    }
    clone() {
        return this;
    }
    toString() {
        return 'null';
    }
    sizeInBytes() {
        return 4;
    }
    copyBytesInto(buffer, offset) {
        buffer[offset++] = CharCodes.n;
        buffer[offset++] = CharCodes.u;
        buffer[offset++] = CharCodes.l;
        buffer[offset++] = CharCodes.l;
        return 4;
    }
}
export default new PDFNull();
