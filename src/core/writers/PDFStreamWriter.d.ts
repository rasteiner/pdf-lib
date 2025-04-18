import PDFHeader from '@/core/document/PDFHeader';
import PDFTrailer from '@/core/document/PDFTrailer';
import PDFObject from '@/core/objects/PDFObject';
import PDFRef from '@/core/objects/PDFRef';
import PDFContext from '@/core/PDFContext';
import PDFWriter from '@/core/writers/PDFWriter';
declare class PDFStreamWriter extends PDFWriter {
    static forContext: (context: PDFContext, objectsPerTick: number, encodeStreams?: boolean, objectsPerStream?: number) => PDFStreamWriter;
    private readonly encodeStreams;
    private readonly objectsPerStream;
    private constructor();
    protected computeBufferSize(): Promise<{
        size: number;
        header: PDFHeader;
        indirectObjects: [PDFRef, PDFObject][];
        trailer: PDFTrailer;
    }>;
}
export default PDFStreamWriter;
