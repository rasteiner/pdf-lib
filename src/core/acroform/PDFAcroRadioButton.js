import PDFName from '@/core/objects/PDFName';
import PDFAcroButton from '@/core/acroform/PDFAcroButton';
import { AcroButtonFlags } from '@/core/acroform/flags';
import { InvalidAcroFieldValueError } from '@/core/errors';
class PDFAcroRadioButton extends PDFAcroButton {
    setValue(value) {
        const onValues = this.getOnValues();
        if (!onValues.includes(value) && value !== PDFName.of('Off')) {
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
    getOnValues() {
        const widgets = this.getWidgets();
        const onValues = [];
        for (let idx = 0, len = widgets.length; idx < len; idx++) {
            const onValue = widgets[idx].getOnValue();
            if (onValue)
                onValues.push(onValue);
        }
        return onValues;
    }
}
Object.defineProperty(PDFAcroRadioButton, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroRadioButton(dict, ref)
});
Object.defineProperty(PDFAcroRadioButton, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({
            FT: 'Btn',
            Ff: AcroButtonFlags.Radio,
            Kids: [],
        });
        const ref = context.register(dict);
        return new PDFAcroRadioButton(dict, ref);
    }
});
export default PDFAcroRadioButton;
