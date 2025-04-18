import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
// TODO: Also handle the `/S` and `/D` entries
class BorderStyle {
    constructor(dict) {
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    W() {
        const W = this.dict.lookup(PDFName.of('W'));
        if (W instanceof PDFNumber)
            return W;
        return undefined;
    }
    getWidth() {
        return this.W()?.asNumber() ?? 1;
    }
    setWidth(width) {
        const W = this.dict.context.obj(width);
        this.dict.set(PDFName.of('W'), W);
    }
}
Object.defineProperty(BorderStyle, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new BorderStyle(dict)
});
export default BorderStyle;
