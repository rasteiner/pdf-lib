import PDFRawStream from '@/core/objects/PDFRawStream';
import PDFObjectParser from '@/core/parser/PDFObjectParser';
declare class PDFObjectStreamParser extends PDFObjectParser {
    static forStream: (rawStream: PDFRawStream, shouldWaitForTick?: () => boolean) => PDFObjectStreamParser;
    private alreadyParsed;
    private readonly shouldWaitForTick;
    private readonly firstOffset;
    private readonly objectCount;
    constructor(rawStream: PDFRawStream, shouldWaitForTick?: () => boolean);
    parseIntoContext(): Promise<void>;
    private parseOffsetsAndObjectNumbers;
}
export default PDFObjectStreamParser;
