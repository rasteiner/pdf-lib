import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
import { copyStringIntoBuffer, toHexStringOfMinLength, utf16Decode, utf16Encode, pdfDocEncodingDecode, parseDate, hasUtf16BOM, } from '@/utils';
import { InvalidPDFDateStringError } from '@/core/errors';
class PDFHexString extends PDFObject {
    constructor(value) {
        super();
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.value = value;
    }
    asBytes() {
        // Append a zero if the number of digits is odd. See PDF spec 7.3.4.3
        const hex = this.value + (this.value.length % 2 === 1 ? '0' : '');
        const hexLength = hex.length;
        const bytes = new Uint8Array(hex.length / 2);
        let hexOffset = 0;
        let bytesOffset = 0;
        // Interpret each pair of hex digits as a single byte
        while (hexOffset < hexLength) {
            const byte = parseInt(hex.substring(hexOffset, hexOffset + 2), 16);
            bytes[bytesOffset] = byte;
            hexOffset += 2;
            bytesOffset += 1;
        }
        return bytes;
    }
    decodeText() {
        const bytes = this.asBytes();
        if (hasUtf16BOM(bytes))
            return utf16Decode(bytes);
        return pdfDocEncodingDecode(bytes);
    }
    decodeDate() {
        const text = this.decodeText();
        const date = parseDate(text);
        if (!date)
            throw new InvalidPDFDateStringError(text);
        return date;
    }
    asString() {
        return this.value;
    }
    clone() {
        return PDFHexString.of(this.value);
    }
    toString() {
        return `<${this.value}>`;
    }
    sizeInBytes() {
        return this.value.length + 2;
    }
    copyBytesInto(buffer, offset) {
        buffer[offset++] = CharCodes.LessThan;
        offset += copyStringIntoBuffer(this.value, buffer, offset);
        buffer[offset++] = CharCodes.GreaterThan;
        return this.value.length + 2;
    }
}
Object.defineProperty(PDFHexString, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (value) => new PDFHexString(value)
});
Object.defineProperty(PDFHexString, "fromText", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (value) => {
        const encoded = utf16Encode(value);
        let hex = '';
        for (let idx = 0, len = encoded.length; idx < len; idx++) {
            hex += toHexStringOfMinLength(encoded[idx], 4);
        }
        return new PDFHexString(hex);
    }
});
export default PDFHexString;
