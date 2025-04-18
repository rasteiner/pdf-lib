import PDFRef from '@/core/objects/PDFRef';
import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFAcroButton from '@/core/acroform/PDFAcroButton';
import PDFContext from '@/core/PDFContext';
declare class PDFAcroRadioButton extends PDFAcroButton {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroRadioButton;
    static create: (context: PDFContext) => PDFAcroRadioButton;
    setValue(value: PDFName): void;
    getValue(): PDFName;
    getOnValues(): PDFName[];
}
export default PDFAcroRadioButton;
