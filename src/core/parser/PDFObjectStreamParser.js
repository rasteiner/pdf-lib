import { ReparseError } from '@/core/errors';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFRef from '@/core/objects/PDFRef';
import ByteStream from '@/core/parser/ByteStream';
import PDFObjectParser from '@/core/parser/PDFObjectParser';
import { waitForTick } from '@/utils';
class PDFObjectStreamParser extends PDFObjectParser {
    constructor(rawStream, shouldWaitForTick) {
        super(ByteStream.fromPDFRawStream(rawStream), rawStream.dict.context);
        Object.defineProperty(this, "alreadyParsed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shouldWaitForTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "firstOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "objectCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const { dict } = rawStream;
        this.alreadyParsed = false;
        this.shouldWaitForTick = shouldWaitForTick || (() => false);
        this.firstOffset = dict.lookup(PDFName.of('First'), PDFNumber).asNumber();
        this.objectCount = dict.lookup(PDFName.of('N'), PDFNumber).asNumber();
    }
    async parseIntoContext() {
        if (this.alreadyParsed) {
            throw new ReparseError('PDFObjectStreamParser', 'parseIntoContext');
        }
        this.alreadyParsed = true;
        const offsetsAndObjectNumbers = this.parseOffsetsAndObjectNumbers();
        for (let idx = 0, len = offsetsAndObjectNumbers.length; idx < len; idx++) {
            const { objectNumber, offset } = offsetsAndObjectNumbers[idx];
            this.bytes.moveTo(this.firstOffset + offset);
            const object = this.parseObject();
            const ref = PDFRef.of(objectNumber, 0);
            this.context.assign(ref, object);
            if (this.shouldWaitForTick())
                await waitForTick();
        }
    }
    parseOffsetsAndObjectNumbers() {
        const offsetsAndObjectNumbers = [];
        for (let idx = 0, len = this.objectCount; idx < len; idx++) {
            this.skipWhitespaceAndComments();
            const objectNumber = this.parseRawInt();
            this.skipWhitespaceAndComments();
            const offset = this.parseRawInt();
            offsetsAndObjectNumbers.push({ objectNumber, offset });
        }
        return offsetsAndObjectNumbers;
    }
}
Object.defineProperty(PDFObjectStreamParser, "forStream", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (rawStream, shouldWaitForTick) => new PDFObjectStreamParser(rawStream, shouldWaitForTick)
});
export default PDFObjectStreamParser;
