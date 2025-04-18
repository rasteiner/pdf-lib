import PDFDict from '@/core/objects/PDFDict';
import PDFStream from '@/core/objects/PDFStream';
import PDFContext from '@/core/PDFContext';
declare class PDFRawStream extends PDFStream {
    static of: (dict: PDFDict, contents: Uint8Array) => PDFRawStream;
    readonly contents: Uint8Array;
    private constructor();
    asUint8Array(): Uint8Array;
    clone(context?: PDFContext): PDFRawStream;
    getContentsString(): string;
    getContents(): Uint8Array;
    getContentsSize(): number;
}
export default PDFRawStream;
