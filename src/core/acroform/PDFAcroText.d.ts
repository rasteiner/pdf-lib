import PDFContext from '@/core/PDFContext';
import PDFDict from '@/core/objects/PDFDict';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
declare class PDFAcroText extends PDFAcroTerminal {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroText;
    static create: (context: PDFContext) => PDFAcroText;
    MaxLen(): PDFNumber | undefined;
    Q(): PDFNumber | undefined;
    setMaxLength(maxLength: number): void;
    removeMaxLength(): void;
    getMaxLength(): number | undefined;
    setQuadding(quadding: 0 | 1 | 2): void;
    getQuadding(): number | undefined;
    setValue(value: PDFHexString | PDFString): void;
    removeValue(): void;
    getValue(): PDFString | PDFHexString | undefined;
}
export default PDFAcroText;
