import PDFAcroChoice from '@/core/acroform/PDFAcroChoice';
class PDFAcroListBox extends PDFAcroChoice {
}
Object.defineProperty(PDFAcroListBox, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroListBox(dict, ref)
});
Object.defineProperty(PDFAcroListBox, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({
            FT: 'Ch',
            Kids: [],
        });
        const ref = context.register(dict);
        return new PDFAcroListBox(dict, ref);
    }
});
export default PDFAcroListBox;
