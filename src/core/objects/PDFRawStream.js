import PDFStream from '@/core/objects/PDFStream';
import { arrayAsString } from '@/utils';
class PDFRawStream extends PDFStream {
    constructor(dict, contents) {
        super(dict);
        Object.defineProperty(this, "contents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.contents = contents;
    }
    asUint8Array() {
        return this.contents.slice();
    }
    clone(context) {
        return PDFRawStream.of(this.dict.clone(context), this.contents.slice());
    }
    getContentsString() {
        return arrayAsString(this.contents);
    }
    getContents() {
        return this.contents;
    }
    getContentsSize() {
        return this.contents.length;
    }
}
Object.defineProperty(PDFRawStream, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, contents) => new PDFRawStream(dict, contents)
});
export default PDFRawStream;
