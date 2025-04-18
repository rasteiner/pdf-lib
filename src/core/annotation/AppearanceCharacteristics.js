import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFArray from '@/core/objects/PDFArray';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFString from '@/core/objects/PDFString';
class AppearanceCharacteristics {
    constructor(dict) {
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    R() {
        const R = this.dict.lookup(PDFName.of('R'));
        if (R instanceof PDFNumber)
            return R;
        return undefined;
    }
    BC() {
        const BC = this.dict.lookup(PDFName.of('BC'));
        if (BC instanceof PDFArray)
            return BC;
        return undefined;
    }
    BG() {
        const BG = this.dict.lookup(PDFName.of('BG'));
        if (BG instanceof PDFArray)
            return BG;
        return undefined;
    }
    CA() {
        const CA = this.dict.lookup(PDFName.of('CA'));
        if (CA instanceof PDFHexString || CA instanceof PDFString)
            return CA;
        return undefined;
    }
    RC() {
        const RC = this.dict.lookup(PDFName.of('RC'));
        if (RC instanceof PDFHexString || RC instanceof PDFString)
            return RC;
        return undefined;
    }
    AC() {
        const AC = this.dict.lookup(PDFName.of('AC'));
        if (AC instanceof PDFHexString || AC instanceof PDFString)
            return AC;
        return undefined;
    }
    getRotation() {
        return this.R()?.asNumber();
    }
    getBorderColor() {
        const BC = this.BC();
        if (!BC)
            return undefined;
        const components = [];
        for (let idx = 0, len = BC?.size(); idx < len; idx++) {
            const component = BC.get(idx);
            if (component instanceof PDFNumber)
                components.push(component.asNumber());
        }
        return components;
    }
    getBackgroundColor() {
        const BG = this.BG();
        if (!BG)
            return undefined;
        const components = [];
        for (let idx = 0, len = BG?.size(); idx < len; idx++) {
            const component = BG.get(idx);
            if (component instanceof PDFNumber)
                components.push(component.asNumber());
        }
        return components;
    }
    getCaptions() {
        const CA = this.CA();
        const RC = this.RC();
        const AC = this.AC();
        return {
            normal: CA?.decodeText(),
            rollover: RC?.decodeText(),
            down: AC?.decodeText(),
        };
    }
    setRotation(rotation) {
        const R = this.dict.context.obj(rotation);
        this.dict.set(PDFName.of('R'), R);
    }
    setBorderColor(color) {
        const BC = this.dict.context.obj(color);
        this.dict.set(PDFName.of('BC'), BC);
    }
    setBackgroundColor(color) {
        const BG = this.dict.context.obj(color);
        this.dict.set(PDFName.of('BG'), BG);
    }
    setCaptions(captions) {
        const CA = PDFHexString.fromText(captions.normal);
        this.dict.set(PDFName.of('CA'), CA);
        if (captions.rollover) {
            const RC = PDFHexString.fromText(captions.rollover);
            this.dict.set(PDFName.of('RC'), RC);
        }
        else {
            this.dict.delete(PDFName.of('RC'));
        }
        if (captions.down) {
            const AC = PDFHexString.fromText(captions.down);
            this.dict.set(PDFName.of('AC'), AC);
        }
        else {
            this.dict.delete(PDFName.of('AC'));
        }
    }
}
Object.defineProperty(AppearanceCharacteristics, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new AppearanceCharacteristics(dict)
});
export default AppearanceCharacteristics;
