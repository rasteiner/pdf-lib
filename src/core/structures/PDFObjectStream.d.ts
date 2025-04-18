import PDFObject from '@/core/objects/PDFObject';
import PDFRef from '@/core/objects/PDFRef';
import PDFContext from '@/core/PDFContext';
import PDFFlateStream from '@/core/structures/PDFFlateStream';
export type IndirectObject = [PDFRef, PDFObject];
declare class PDFObjectStream extends PDFFlateStream {
    static withContextAndObjects: (context: PDFContext, objects: IndirectObject[], encode?: boolean) => PDFObjectStream;
    private readonly objects;
    private readonly offsets;
    private readonly offsetsString;
    private constructor();
    getObjectsCount(): number;
    clone(context?: PDFContext): PDFObjectStream;
    getContentsString(): string;
    getUnencodedContents(): Uint8Array;
    getUnencodedContentsSize(): number;
    private computeOffsetsString;
    private computeObjectOffsets;
}
export default PDFObjectStream;
