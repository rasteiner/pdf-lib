import PDFAcroChoice from '@/core/acroform/PDFAcroChoice';
import { AcroChoiceFlags } from '@/core/acroform/flags';
class PDFAcroComboBox extends PDFAcroChoice {
}
Object.defineProperty(PDFAcroComboBox, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroComboBox(dict, ref)
});
Object.defineProperty(PDFAcroComboBox, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({
            FT: 'Ch',
            Ff: AcroChoiceFlags.Combo,
            Kids: [],
        });
        const ref = context.register(dict);
        return new PDFAcroComboBox(dict, ref);
    }
});
export default PDFAcroComboBox;
