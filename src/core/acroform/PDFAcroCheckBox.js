import PDFName from '@/core/objects/PDFName';
import PDFAcroButton from '@/core/acroform/PDFAcroButton';
import { InvalidAcroFieldValueError } from '@/core/errors';
class PDFAcroCheckBox extends PDFAcroButton {
    setValue(value) {
        const onValue = this.getOnValue() ?? PDFName.of('Yes');
        if (value !== onValue && value !== PDFName.of('Off')) {
            throw new InvalidAcroFieldValueError();
        }
        this.dict.set(PDFName.of('V'), value);
        const widgets = this.getWidgets();
        for (let idx = 0, len = widgets.length; idx < len; idx++) {
            const widget = widgets[idx];
            const state = widget.getOnValue() === value ? value : PDFName.of('Off');
            widget.setAppearanceState(state);
        }
    }
    getValue() {
        const v = this.V();
        if (v instanceof PDFName)
            return v;
        return PDFName.of('Off');
    }
    getOnValue() {
        const [widget] = this.getWidgets();
        return widget?.getOnValue();
    }
}
Object.defineProperty(PDFAcroCheckBox, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroCheckBox(dict, ref)
});
Object.defineProperty(PDFAcroCheckBox, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({
            FT: 'Btn',
            Kids: [],
        });
        const ref = context.register(dict);
        return new PDFAcroCheckBox(dict, ref);
    }
});
export default PDFAcroCheckBox;
