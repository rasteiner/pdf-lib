import PDFContext from '@/core/PDFContext';
declare class PDFObject {
    clone(_context?: PDFContext): PDFObject;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(_buffer: Uint8Array, _offset: number): number;
}
export default PDFObject;
