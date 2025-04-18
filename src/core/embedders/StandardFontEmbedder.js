import { Encodings, Font, FontNames, } from '@pdf-lib/standard-fonts';
import PDFHexString from '@/core/objects/PDFHexString';
import { toCodePoint, toHexString } from '@/utils';
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/foliojs/pdfkit/blob/f91bdd61c164a72ea06be1a43dc0a412afc3925f/lib/font/afm.coffee
 */
class StandardFontEmbedder {
    constructor(fontName, customName) {
        Object.defineProperty(this, "font", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "encoding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "customName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // prettier-ignore
        this.encoding = (fontName === FontNames.ZapfDingbats ? Encodings.ZapfDingbats
            : fontName === FontNames.Symbol ? Encodings.Symbol
                : Encodings.WinAnsi);
        this.font = Font.load(fontName);
        this.fontName = this.font.FontName;
        this.customName = customName;
    }
    /**
     * Encode the JavaScript string into this font. (JavaScript encodes strings in
     * Unicode, but standard fonts use either WinAnsi, ZapfDingbats, or Symbol
     * encodings)
     */
    encodeText(text) {
        const glyphs = this.encodeTextAsGlyphs(text);
        const hexCodes = new Array(glyphs.length);
        for (let idx = 0, len = glyphs.length; idx < len; idx++) {
            hexCodes[idx] = toHexString(glyphs[idx].code);
        }
        return PDFHexString.of(hexCodes.join(''));
    }
    widthOfTextAtSize(text, size) {
        const glyphs = this.encodeTextAsGlyphs(text);
        let totalWidth = 0;
        for (let idx = 0, len = glyphs.length; idx < len; idx++) {
            const left = glyphs[idx].name;
            const right = (glyphs[idx + 1] || {}).name;
            const kernAmount = this.font.getXAxisKerningForPair(left, right) || 0;
            totalWidth += this.widthOfGlyph(left) + kernAmount;
        }
        const scale = size / 1000;
        return totalWidth * scale;
    }
    heightOfFontAtSize(size, options = {}) {
        const { descender = true } = options;
        const { Ascender, Descender, FontBBox } = this.font;
        const yTop = Ascender || FontBBox[3];
        const yBottom = Descender || FontBBox[1];
        let height = yTop - yBottom;
        if (!descender)
            height += Descender || 0;
        return (height / 1000) * size;
    }
    sizeOfFontAtHeight(height) {
        const { Ascender, Descender, FontBBox } = this.font;
        const yTop = Ascender || FontBBox[3];
        const yBottom = Descender || FontBBox[1];
        return (1000 * height) / (yTop - yBottom);
    }
    embedIntoContext(context, ref) {
        const fontDict = context.obj({
            Type: 'Font',
            Subtype: 'Type1',
            BaseFont: this.customName || this.fontName,
            Encoding: this.encoding === Encodings.WinAnsi ? 'WinAnsiEncoding' : undefined,
        });
        if (ref) {
            context.assign(ref, fontDict);
            return ref;
        }
        else {
            return context.register(fontDict);
        }
    }
    widthOfGlyph(glyphName) {
        // Default to 250 if font doesn't specify a width
        return this.font.getWidthOfGlyph(glyphName) || 250;
    }
    encodeTextAsGlyphs(text) {
        const codePoints = Array.from(text);
        const glyphs = new Array(codePoints.length);
        for (let idx = 0, len = codePoints.length; idx < len; idx++) {
            const codePoint = toCodePoint(codePoints[idx]);
            glyphs[idx] = this.encoding.encodeUnicodeCodePoint(codePoint);
        }
        return glyphs;
    }
}
Object.defineProperty(StandardFontEmbedder, "for", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (fontName, customName) => new StandardFontEmbedder(fontName, customName)
});
export default StandardFontEmbedder;
