import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFFlateStream from '@/core/structures/PDFFlateStream';
import CharCodes from '@/core/syntax/CharCodes';
import { copyStringIntoBuffer, last } from '@/utils';
class PDFObjectStream extends PDFFlateStream {
    constructor(context, objects, encode = true) {
        super(context.obj({}), encode);
        Object.defineProperty(this, "objects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "offsets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "offsetsString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.objects = objects;
        this.offsets = this.computeObjectOffsets();
        this.offsetsString = this.computeOffsetsString();
        this.dict.set(PDFName.of('Type'), PDFName.of('ObjStm'));
        this.dict.set(PDFName.of('N'), PDFNumber.of(this.objects.length));
        this.dict.set(PDFName.of('First'), PDFNumber.of(this.offsetsString.length));
    }
    getObjectsCount() {
        return this.objects.length;
    }
    clone(context) {
        return PDFObjectStream.withContextAndObjects(context || this.dict.context, this.objects.slice(), this.encode);
    }
    getContentsString() {
        let value = this.offsetsString;
        for (let idx = 0, len = this.objects.length; idx < len; idx++) {
            const [, object] = this.objects[idx];
            value += `${object}\n`;
        }
        return value;
    }
    getUnencodedContents() {
        const buffer = new Uint8Array(this.getUnencodedContentsSize());
        let offset = copyStringIntoBuffer(this.offsetsString, buffer, 0);
        for (let idx = 0, len = this.objects.length; idx < len; idx++) {
            const [, object] = this.objects[idx];
            offset += object.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
        }
        return buffer;
    }
    getUnencodedContentsSize() {
        return (this.offsetsString.length +
            last(this.offsets)[1] +
            last(this.objects)[1].sizeInBytes() +
            1);
    }
    computeOffsetsString() {
        let offsetsString = '';
        for (let idx = 0, len = this.offsets.length; idx < len; idx++) {
            const [objectNumber, offset] = this.offsets[idx];
            offsetsString += `${objectNumber} ${offset} `;
        }
        return offsetsString;
    }
    computeObjectOffsets() {
        let offset = 0;
        const offsets = new Array(this.objects.length);
        for (let idx = 0, len = this.objects.length; idx < len; idx++) {
            const [ref, object] = this.objects[idx];
            offsets[idx] = [ref.objectNumber, offset];
            offset += object.sizeInBytes() + 1; // '\n'
        }
        return offsets;
    }
}
Object.defineProperty(PDFObjectStream, "withContextAndObjects", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context, objects, encode = true) => new PDFObjectStream(context, objects, encode)
});
export default PDFObjectStream;
