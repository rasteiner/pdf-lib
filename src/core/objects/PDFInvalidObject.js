import PDFObject from '@/core/objects/PDFObject';
class PDFInvalidObject extends PDFObject {
    constructor(data) {
        super();
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = data;
    }
    clone() {
        return PDFInvalidObject.of(this.data.slice());
    }
    toString() {
        return `PDFInvalidObject(${this.data.length} bytes)`;
    }
    sizeInBytes() {
        return this.data.length;
    }
    copyBytesInto(buffer, offset) {
        const length = this.data.length;
        for (let idx = 0; idx < length; idx++) {
            buffer[offset++] = this.data[idx];
        }
        return length;
    }
}
Object.defineProperty(PDFInvalidObject, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (data) => new PDFInvalidObject(data)
});
export default PDFInvalidObject;
