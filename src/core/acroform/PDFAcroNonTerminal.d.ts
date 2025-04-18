import PDFDict from '@/core/objects/PDFDict';
import PDFRef from '@/core/objects/PDFRef';
import PDFContext from '@/core/PDFContext';
import PDFAcroField from '@/core/acroform/PDFAcroField';
declare class PDFAcroNonTerminal extends PDFAcroField {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroNonTerminal;
    static create: (context: PDFContext) => PDFAcroNonTerminal;
    addField(field: PDFRef): void;
    normalizedEntries(): {
        Kids: import("..").PDFArray;
    };
}
export default PDFAcroNonTerminal;
