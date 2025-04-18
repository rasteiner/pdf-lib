import PDFName from '@/core/objects/PDFName';
import PDFAcroField from '@/core/acroform/PDFAcroField';
class PDFAcroNonTerminal extends PDFAcroField {
    addField(field) {
        const { Kids } = this.normalizedEntries();
        Kids?.push(field);
    }
    normalizedEntries() {
        let Kids = this.Kids();
        if (!Kids) {
            Kids = this.dict.context.obj([]);
            this.dict.set(PDFName.of('Kids'), Kids);
        }
        return { Kids };
    }
}
Object.defineProperty(PDFAcroNonTerminal, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroNonTerminal(dict, ref)
});
Object.defineProperty(PDFAcroNonTerminal, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({});
        const ref = context.register(dict);
        return new PDFAcroNonTerminal(dict, ref);
    }
});
export default PDFAcroNonTerminal;
