import PDFContext from '@/core/PDFContext';
import PDFRef from '@/core/objects/PDFRef';
import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFAcroButton from '@/core/acroform/PDFAcroButton';
declare class PDFAcroCheckBox extends PDFAcroButton {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroCheckBox;
    static create: (context: PDFContext) => PDFAcroCheckBox;
    setValue(value: PDFName): void;
    getValue(): PDFName;
    getOnValue(): PDFName | undefined;
}
export default PDFAcroCheckBox;
