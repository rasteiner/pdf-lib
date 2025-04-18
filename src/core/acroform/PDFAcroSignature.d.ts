import PDFDict from '@/core/objects/PDFDict';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
declare class PDFAcroSignature extends PDFAcroTerminal {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroSignature;
}
export default PDFAcroSignature;
