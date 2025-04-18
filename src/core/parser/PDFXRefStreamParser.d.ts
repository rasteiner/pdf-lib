import PDFRawStream from '@/core/objects/PDFRawStream';
import PDFRef from '@/core/objects/PDFRef';
export interface Entry {
    ref: PDFRef;
    offset: number;
    deleted: boolean;
    inObjectStream: boolean;
}
declare class PDFXRefStreamParser {
    static forStream: (rawStream: PDFRawStream) => PDFXRefStreamParser;
    private alreadyParsed;
    private readonly dict;
    private readonly context;
    private readonly bytes;
    private readonly subsections;
    private readonly byteWidths;
    constructor(rawStream: PDFRawStream);
    parseIntoContext(): Entry[];
    private parseEntries;
}
export default PDFXRefStreamParser;
