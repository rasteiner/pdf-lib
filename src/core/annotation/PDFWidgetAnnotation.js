import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFRef from '@/core/objects/PDFRef';
import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import BorderStyle from '@/core/annotation/BorderStyle';
import PDFAnnotation from '@/core/annotation/PDFAnnotation';
import AppearanceCharacteristics from '@/core/annotation/AppearanceCharacteristics';
class PDFWidgetAnnotation extends PDFAnnotation {
    MK() {
        const MK = this.dict.lookup(PDFName.of('MK'));
        if (MK instanceof PDFDict)
            return MK;
        return undefined;
    }
    BS() {
        const BS = this.dict.lookup(PDFName.of('BS'));
        if (BS instanceof PDFDict)
            return BS;
        return undefined;
    }
    DA() {
        const da = this.dict.lookup(PDFName.of('DA'));
        if (da instanceof PDFString || da instanceof PDFHexString)
            return da;
        return undefined;
    }
    P() {
        const P = this.dict.get(PDFName.of('P'));
        if (P instanceof PDFRef)
            return P;
        return undefined;
    }
    setP(page) {
        this.dict.set(PDFName.of('P'), page);
    }
    setDefaultAppearance(appearance) {
        this.dict.set(PDFName.of('DA'), PDFString.of(appearance));
    }
    getDefaultAppearance() {
        const DA = this.DA();
        if (DA instanceof PDFHexString) {
            return DA.decodeText();
        }
        return DA?.asString();
    }
    getAppearanceCharacteristics() {
        const MK = this.MK();
        if (MK)
            return AppearanceCharacteristics.fromDict(MK);
        return undefined;
    }
    getOrCreateAppearanceCharacteristics() {
        const MK = this.MK();
        if (MK)
            return AppearanceCharacteristics.fromDict(MK);
        const ac = AppearanceCharacteristics.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName.of('MK'), ac.dict);
        return ac;
    }
    getBorderStyle() {
        const BS = this.BS();
        if (BS)
            return BorderStyle.fromDict(BS);
        return undefined;
    }
    getOrCreateBorderStyle() {
        const BS = this.BS();
        if (BS)
            return BorderStyle.fromDict(BS);
        const bs = BorderStyle.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName.of('BS'), bs.dict);
        return bs;
    }
    getOnValue() {
        const normal = this.getAppearances()?.normal;
        if (normal instanceof PDFDict) {
            const keys = normal.keys();
            for (let idx = 0, len = keys.length; idx < len; idx++) {
                const key = keys[idx];
                if (key !== PDFName.of('Off'))
                    return key;
            }
        }
        return undefined;
    }
}
Object.defineProperty(PDFWidgetAnnotation, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new PDFWidgetAnnotation(dict)
});
Object.defineProperty(PDFWidgetAnnotation, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context, parent) => {
        const dict = context.obj({
            Type: 'Annot',
            Subtype: 'Widget',
            Rect: [0, 0, 0, 0],
            Parent: parent,
        });
        return new PDFWidgetAnnotation(dict);
    }
});
export default PDFWidgetAnnotation;
