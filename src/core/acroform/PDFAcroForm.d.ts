import PDFContext from '@/core/PDFContext';
import PDFDict from '@/core/objects/PDFDict';
import PDFArray from '@/core/objects/PDFArray';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroField from '@/core/acroform/PDFAcroField';
declare class PDFAcroForm {
    readonly dict: PDFDict;
    static fromDict: (dict: PDFDict) => PDFAcroForm;
    static create: (context: PDFContext) => PDFAcroForm;
    private constructor();
    Fields(): PDFArray | undefined;
    getFields(): [PDFAcroField, PDFRef][];
    getAllFields(): [PDFAcroField, PDFRef][];
    addField(field: PDFRef): void;
    removeField(field: PDFAcroField): void;
    normalizedEntries(): {
        Fields: PDFArray;
    };
}
export default PDFAcroForm;
