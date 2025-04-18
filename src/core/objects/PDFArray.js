import PDFNumber from '@/core/objects/PDFNumber';
import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
import { PDFArrayIsNotRectangleError } from '@/core/errors';
class PDFArray extends PDFObject {
    constructor(context) {
        super();
        Object.defineProperty(this, "array", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.array = [];
        this.context = context;
    }
    size() {
        return this.array.length;
    }
    push(object) {
        this.array.push(object);
    }
    insert(index, object) {
        this.array.splice(index, 0, object);
    }
    indexOf(object) {
        const index = this.array.indexOf(object);
        return index === -1 ? undefined : index;
    }
    remove(index) {
        this.array.splice(index, 1);
    }
    set(idx, object) {
        this.array[idx] = object;
    }
    get(index) {
        return this.array[index];
    }
    lookupMaybe(index, ...types) {
        return this.context.lookupMaybe(this.get(index), 
        // @ts-ignore
        ...types);
    }
    lookup(index, ...types) {
        return this.context.lookup(this.get(index), 
        // @ts-ignore
        ...types);
    }
    asRectangle() {
        if (this.size() !== 4)
            throw new PDFArrayIsNotRectangleError(this.size());
        const lowerLeftX = this.lookup(0, PDFNumber).asNumber();
        const lowerLeftY = this.lookup(1, PDFNumber).asNumber();
        const upperRightX = this.lookup(2, PDFNumber).asNumber();
        const upperRightY = this.lookup(3, PDFNumber).asNumber();
        const x = lowerLeftX;
        const y = lowerLeftY;
        const width = upperRightX - lowerLeftX;
        const height = upperRightY - lowerLeftY;
        return { x, y, width, height };
    }
    asArray() {
        return this.array.slice();
    }
    clone(context) {
        const clone = PDFArray.withContext(context || this.context);
        for (let idx = 0, len = this.size(); idx < len; idx++) {
            clone.push(this.array[idx]);
        }
        return clone;
    }
    toString() {
        let arrayString = '[ ';
        for (let idx = 0, len = this.size(); idx < len; idx++) {
            arrayString += this.get(idx).toString();
            arrayString += ' ';
        }
        arrayString += ']';
        return arrayString;
    }
    sizeInBytes() {
        let size = 3;
        for (let idx = 0, len = this.size(); idx < len; idx++) {
            size += this.get(idx).sizeInBytes() + 1;
        }
        return size;
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        buffer[offset++] = CharCodes.LeftSquareBracket;
        buffer[offset++] = CharCodes.Space;
        for (let idx = 0, len = this.size(); idx < len; idx++) {
            offset += this.get(idx).copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Space;
        }
        buffer[offset++] = CharCodes.RightSquareBracket;
        return offset - initialOffset;
    }
    scalePDFNumbers(x, y) {
        for (let idx = 0, len = this.size(); idx < len; idx++) {
            const el = this.lookup(idx);
            if (el instanceof PDFNumber) {
                const factor = idx % 2 === 0 ? x : y;
                this.set(idx, PDFNumber.of(el.asNumber() * factor));
            }
        }
    }
}
Object.defineProperty(PDFArray, "withContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => new PDFArray(context)
});
export default PDFArray;
