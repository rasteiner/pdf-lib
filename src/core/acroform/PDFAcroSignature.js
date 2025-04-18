import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
class PDFAcroSignature extends PDFAcroTerminal {
}
Object.defineProperty(PDFAcroSignature, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict, ref) => new PDFAcroSignature(dict, ref)
});
export default PDFAcroSignature;
