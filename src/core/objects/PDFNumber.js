import { copyStringIntoBuffer, numberToString } from '@/utils/index';
import PDFObject from '@/core/objects/PDFObject';
class PDFNumber extends PDFObject {
    constructor(value) {
        super();
        Object.defineProperty(this, "numberValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stringValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.numberValue = value;
        this.stringValue = numberToString(value);
    }
    asNumber() {
        return this.numberValue;
    }
    /** @deprecated in favor of [[PDFNumber.asNumber]] */
    value() {
        return this.numberValue;
    }
    clone() {
        return PDFNumber.of(this.numberValue);
    }
    toString() {
        return this.stringValue;
    }
    sizeInBytes() {
        return this.stringValue.length;
    }
    copyBytesInto(buffer, offset) {
        offset += copyStringIntoBuffer(this.stringValue, buffer, offset);
        return this.stringValue.length;
    }
}
Object.defineProperty(PDFNumber, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (value) => new PDFNumber(value)
});
export default PDFNumber;
