import { Position } from '@/core/errors';
import PDFArray from '@/core/objects/PDFArray';
import PDFDict from '@/core/objects/PDFDict';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFObject from '@/core/objects/PDFObject';
import PDFRef from '@/core/objects/PDFRef';
import PDFStream from '@/core/objects/PDFStream';
import PDFString from '@/core/objects/PDFString';
import BaseParser from '@/core/parser/BaseParser';
import ByteStream from '@/core/parser/ByteStream';
import PDFContext from '@/core/PDFContext';
declare class PDFObjectParser extends BaseParser {
    static forBytes: (bytes: Uint8Array, context: PDFContext, capNumbers?: boolean) => PDFObjectParser;
    static forByteStream: (byteStream: ByteStream, context: PDFContext, capNumbers?: boolean) => PDFObjectParser;
    protected readonly context: PDFContext;
    constructor(byteStream: ByteStream, context: PDFContext, capNumbers?: boolean);
    parseObject(): PDFObject;
    protected parseNumberOrRef(): PDFNumber | PDFRef;
    protected parseHexString(): PDFHexString;
    protected parseString(): PDFString;
    protected parseName(): PDFName;
    protected parseArray(): PDFArray;
    protected parseDict(): PDFDict;
    protected parseDictOrStream(): PDFDict | PDFStream;
    protected findEndOfStreamFallback(startPos: Position): number;
}
export default PDFObjectParser;
