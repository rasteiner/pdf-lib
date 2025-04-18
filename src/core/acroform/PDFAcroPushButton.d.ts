import PDFDict from '@/core/objects/PDFDict';
import PDFAcroButton from '@/core/acroform/PDFAcroButton';
import PDFContext from '@/core/PDFContext';
import PDFRef from '@/core/objects/PDFRef';
declare class PDFAcroPushButton extends PDFAcroButton {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroPushButton;
    static create: (context: PDFContext) => PDFAcroPushButton;
}
export default PDFAcroPushButton;
