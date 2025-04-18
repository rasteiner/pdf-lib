import { MissingPageContentsEmbeddingError, UnrecognizedStreamTypeError, } from '@/core/errors';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFRawStream from '@/core/objects/PDFRawStream';
import PDFStream from '@/core/objects/PDFStream';
import { decodePDFRawStream } from '@/core/streams/decode';
import PDFContentStream from '@/core/structures/PDFContentStream';
import CharCodes from '@/core/syntax/CharCodes';
import { mergeIntoTypedArray } from '@/utils';
const fullPageBoundingBox = (page) => {
    const mediaBox = page.MediaBox();
    const width = mediaBox.lookup(2, PDFNumber).asNumber() -
        mediaBox.lookup(0, PDFNumber).asNumber();
    const height = mediaBox.lookup(3, PDFNumber).asNumber() -
        mediaBox.lookup(1, PDFNumber).asNumber();
    return { left: 0, bottom: 0, right: width, top: height };
};
// Returns the identity matrix, modified to position the content of the given
// bounding box at (0, 0).
const boundingBoxAdjustedMatrix = (bb) => [1, 0, 0, 1, -bb.left, -bb.bottom];
class PDFPageEmbedder {
    static async for(page, boundingBox, transformationMatrix) {
        return new PDFPageEmbedder(page, boundingBox, transformationMatrix);
    }
    constructor(page, boundingBox, transformationMatrix) {
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "boundingBox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "transformationMatrix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "page", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.page = page;
        const bb = boundingBox ?? fullPageBoundingBox(page);
        this.width = bb.right - bb.left;
        this.height = bb.top - bb.bottom;
        this.boundingBox = bb;
        this.transformationMatrix =
            transformationMatrix ?? boundingBoxAdjustedMatrix(bb);
    }
    async embedIntoContext(context, ref) {
        const { Contents, Resources } = this.page.normalizedEntries();
        if (!Contents)
            throw new MissingPageContentsEmbeddingError();
        const decodedContents = this.decodeContents(Contents);
        const { left, bottom, right, top } = this.boundingBox;
        const xObject = context.flateStream(decodedContents, {
            Type: 'XObject',
            Subtype: 'Form',
            FormType: 1,
            BBox: [left, bottom, right, top],
            Matrix: this.transformationMatrix,
            Resources,
        });
        if (ref) {
            context.assign(ref, xObject);
            return ref;
        }
        else {
            return context.register(xObject);
        }
    }
    // `contents` is an array of streams which are merged to include them in the XObject.
    // This methods extracts each stream and joins them with a newline character.
    decodeContents(contents) {
        const newline = Uint8Array.of(CharCodes.Newline);
        const decodedContents = [];
        for (let idx = 0, len = contents.size(); idx < len; idx++) {
            const stream = contents.lookup(idx, PDFStream);
            let content;
            if (stream instanceof PDFRawStream) {
                content = decodePDFRawStream(stream).decode();
            }
            else if (stream instanceof PDFContentStream) {
                content = stream.getUnencodedContents();
            }
            else {
                throw new UnrecognizedStreamTypeError(stream);
            }
            decodedContents.push(content, newline);
        }
        return mergeIntoTypedArray(...decodedContents);
    }
}
export default PDFPageEmbedder;
