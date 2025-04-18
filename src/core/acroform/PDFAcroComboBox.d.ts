import PDFDict from '@/core/objects/PDFDict';
import PDFAcroChoice from '@/core/acroform/PDFAcroChoice';
import PDFContext from '@/core/PDFContext';
import PDFRef from '@/core/objects/PDFRef';
declare class PDFAcroComboBox extends PDFAcroChoice {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroComboBox;
    static create: (context: PDFContext) => PDFAcroComboBox;
}
export default PDFAcroComboBox;
