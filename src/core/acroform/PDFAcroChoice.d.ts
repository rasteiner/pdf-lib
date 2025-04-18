import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFString from '@/core/objects/PDFString';
import PDFArray from '@/core/objects/PDFArray';
declare class PDFAcroChoice extends PDFAcroTerminal {
    setValues(values: (PDFString | PDFHexString)[]): void;
    valuesAreValid(values: (PDFString | PDFHexString)[]): boolean;
    updateSelectedIndices(values: (PDFString | PDFHexString)[]): void;
    getValues(): (PDFString | PDFHexString)[];
    Opt(): PDFArray | PDFString | PDFHexString | undefined;
    setOptions(options: {
        value: PDFString | PDFHexString;
        display?: PDFString | PDFHexString;
    }[]): void;
    getOptions(): {
        value: PDFString | PDFHexString;
        display: PDFString | PDFHexString;
    }[];
}
export default PDFAcroChoice;
