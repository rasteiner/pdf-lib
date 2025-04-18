import PDFObject from '@/core/objects/PDFObject';
declare class PDFInvalidObject extends PDFObject {
    static of: (data: Uint8Array) => PDFInvalidObject;
    private readonly data;
    private constructor();
    clone(): PDFInvalidObject;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(buffer: Uint8Array, offset: number): number;
}
export default PDFInvalidObject;
