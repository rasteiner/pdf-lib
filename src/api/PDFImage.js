import PDFDocument from '@/api/PDFDocument';
import { JpegEmbedder, PDFRef, PngEmbedder } from '@/core';
import { assertIs } from '@/utils';
/**
 * Represents an image that has been embedded in a [[PDFDocument]].
 */
class PDFImage {
    constructor(ref, doc, embedder) {
        /** The unique reference assigned to this image within the document. */
        Object.defineProperty(this, "ref", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** The document to which this image belongs. */
        Object.defineProperty(this, "doc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** The width of this image in pixels. */
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /** The height of this image in pixels. */
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embedder", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embedTask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        assertIs(ref, 'ref', [[PDFRef, 'PDFRef']]);
        assertIs(doc, 'doc', [[PDFDocument, 'PDFDocument']]);
        assertIs(embedder, 'embedder', [
            [JpegEmbedder, 'JpegEmbedder'],
            [PngEmbedder, 'PngEmbedder'],
        ]);
        this.ref = ref;
        this.doc = doc;
        this.width = embedder.width;
        this.height = embedder.height;
        this.embedder = embedder;
    }
    /**
     * Compute the width and height of this image after being scaled by the
     * given `factor`. For example:
     * ```js
     * image.width  // => 500
     * image.height // => 250
     *
     * const scaled = image.scale(0.5)
     * scaled.width  // => 250
     * scaled.height // => 125
     * ```
     * This operation is often useful before drawing an image with
     * [[PDFPage.drawImage]] to compute the `width` and `height` options.
     * @param factor The factor by which this image should be scaled.
     * @returns The width and height of the image after being scaled.
     */
    scale(factor) {
        assertIs(factor, 'factor', ['number']);
        return { width: this.width * factor, height: this.height * factor };
    }
    /**
     * Get the width and height of this image after scaling it as large as
     * possible while maintaining its aspect ratio and not exceeding the
     * specified `width` and `height`. For example:
     * ```
     * image.width  // => 500
     * image.height // => 250
     *
     * const scaled = image.scaleToFit(750, 1000)
     * scaled.width  // => 750
     * scaled.height // => 375
     * ```
     * The `width` and `height` parameters can also be thought of as the width
     * and height of a box that the scaled image must fit within.
     * @param width The bounding box's width.
     * @param height The bounding box's height.
     * @returns The width and height of the image after being scaled.
     */
    scaleToFit(width, height) {
        assertIs(width, 'width', ['number']);
        assertIs(height, 'height', ['number']);
        const imgWidthScale = width / this.width;
        const imgHeightScale = height / this.height;
        const scale = Math.min(imgWidthScale, imgHeightScale);
        return this.scale(scale);
    }
    /**
     * Get the width and height of this image. For example:
     * ```js
     * const { width, height } = image.size()
     * ```
     * @returns The width and height of the image.
     */
    size() {
        return this.scale(1);
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all images get embedded.
     *
     * Embed this image in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    async embed() {
        if (!this.embedder)
            return;
        // The image should only be embedded once. If there's a pending embed
        // operation then wait on it. Otherwise we need to start the embed.
        if (!this.embedTask) {
            const { doc, ref } = this;
            this.embedTask = this.embedder.embedIntoContext(doc.context, ref);
        }
        await this.embedTask;
        // We clear `this.embedder` so that the indirectly referenced image data
        // can be garbage collected, thus avoiding a memory leak.
        // See https://github.com/Hopding/pdf-lib/pull/1032/files.
        this.embedder = undefined;
    }
}
/**
 * > **NOTE:** You probably don't want to call this method directly. Instead,
 * > consider using the [[PDFDocument.embedPng]] and [[PDFDocument.embedJpg]]
 * > methods, which will create instances of [[PDFImage]] for you.
 *
 * Create an instance of [[PDFImage]] from an existing ref and embedder
 *
 * @param ref The unique reference for this image.
 * @param doc The document to which the image will belong.
 * @param embedder The embedder that will be used to embed the image.
 */
Object.defineProperty(PDFImage, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (ref, doc, embedder) => new PDFImage(ref, doc, embedder)
});
export default PDFImage;
