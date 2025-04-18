import PDFAcroButton from '@/core/acroform/PDFAcroButton';
import { AcroButtonFlags } from '@/core/acroform/flags';
class PDFAcroPushButton extends PDFAcroButton {
}
Object.defineProperty(PDFAcroPushButton, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroPushButton(dict, ref)
});
Object.defineProperty(PDFAcroPushButton, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({
            FT: 'Btn',
            Ff: AcroButtonFlags.PushButton,
            Kids: [],
        });
        const ref = context.register(dict);
        return new PDFAcroPushButton(dict, ref);
    }
});
export default PDFAcroPushButton;
