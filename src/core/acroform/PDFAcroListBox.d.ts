import PDFDict from '@/core/objects/PDFDict';
import PDFAcroChoice from '@/core/acroform/PDFAcroChoice';
import PDFContext from '@/core/PDFContext';
import PDFRef from '@/core/objects/PDFRef';
declare class PDFAcroListBox extends PDFAcroChoice {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroListBox;
    static create: (context: PDFContext) => PDFAcroListBox;
}
export default PDFAcroListBox;
