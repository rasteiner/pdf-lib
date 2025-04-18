import { createCmap } from '@/core/embedders/CMap';
import { deriveFontFlags } from '@/core/embedders/FontFlags';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFString from '@/core/objects/PDFString';
import { byAscendingId, Cache, sortedUniq, toHexStringOfMinLength, } from '@/utils';
/**
 * A note of thanks to the developers of https://github.com/foliojs/pdfkit, as
 * this class borrows from:
 *   https://github.com/devongovett/pdfkit/blob/e71edab0dd4657b5a767804ba86c94c58d01fbca/lib/image/jpeg.coffee
 */
class CustomFontEmbedder {
    static async for(fontkit, fontData, customName, fontFeatures) {
        const font = await fontkit.create(fontData);
        return new CustomFontEmbedder(font, fontData, customName, fontFeatures);
    }
    constructor(font, fontData, customName, fontFeatures) {
        Object.defineProperty(this, "font", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontData", {
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
        Object.defineProperty(this, "fontFeatures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "baseFontName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "glyphCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "allGlyphsInFontSortedById", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const glyphs = new Array(this.font.characterSet.length);
                for (let idx = 0, len = glyphs.length; idx < len; idx++) {
                    const codePoint = this.font.characterSet[idx];
                    glyphs[idx] = this.font.glyphForCodePoint(codePoint);
                }
                return sortedUniq(glyphs.sort(byAscendingId), (g) => g.id);
            }
        });
        this.font = font;
        this.scale = 1000 / this.font.unitsPerEm;
        this.fontData = fontData;
        this.fontName = this.font.postscriptName || 'Font';
        this.customName = customName;
        this.fontFeatures = fontFeatures;
        this.baseFontName = '';
        this.glyphCache = Cache.populatedBy(this.allGlyphsInFontSortedById);
    }
    /**
     * Encode the JavaScript string into this font. (JavaScript encodes strings in
     * Unicode, but embedded fonts use their own custom encodings)
     */
    encodeText(text) {
        const { glyphs } = this.font.layout(text, this.fontFeatures);
        const hexCodes = new Array(glyphs.length);
        for (let idx = 0, len = glyphs.length; idx < len; idx++) {
            hexCodes[idx] = toHexStringOfMinLength(glyphs[idx].id, 4);
        }
        return PDFHexString.of(hexCodes.join(''));
    }
    // The advanceWidth takes into account kerning automatically, so we don't
    // have to do that manually like we do for the standard fonts.
    widthOfTextAtSize(text, size) {
        const { glyphs } = this.font.layout(text, this.fontFeatures);
        let totalWidth = 0;
        for (let idx = 0, len = glyphs.length; idx < len; idx++) {
            totalWidth += glyphs[idx].advanceWidth * this.scale;
        }
        const scale = size / 1000;
        return totalWidth * scale;
    }
    heightOfFontAtSize(size, options = {}) {
        const { descender = true } = options;
        const { ascent, descent, bbox } = this.font;
        const yTop = (ascent || bbox.maxY) * this.scale;
        const yBottom = (descent || bbox.minY) * this.scale;
        let height = yTop - yBottom;
        if (!descender)
            height -= Math.abs(descent) || 0;
        return (height / 1000) * size;
    }
    sizeOfFontAtHeight(height) {
        const { ascent, descent, bbox } = this.font;
        const yTop = (ascent || bbox.maxY) * this.scale;
        const yBottom = (descent || bbox.minY) * this.scale;
        return (1000 * height) / (yTop - yBottom);
    }
    embedIntoContext(context, ref) {
        this.baseFontName =
            this.customName || context.addRandomSuffix(this.fontName);
        return this.embedFontDict(context, ref);
    }
    async embedFontDict(context, ref) {
        const cidFontDictRef = await this.embedCIDFontDict(context);
        const unicodeCMapRef = this.embedUnicodeCmap(context);
        const fontDict = context.obj({
            Type: 'Font',
            Subtype: 'Type0',
            BaseFont: this.baseFontName,
            Encoding: 'Identity-H',
            DescendantFonts: [cidFontDictRef],
            ToUnicode: unicodeCMapRef,
        });
        if (ref) {
            context.assign(ref, fontDict);
            return ref;
        }
        else {
            return context.register(fontDict);
        }
    }
    isCFF() {
        return this.font.cff;
    }
    async embedCIDFontDict(context) {
        const fontDescriptorRef = await this.embedFontDescriptor(context);
        const cidFontDict = context.obj({
            Type: 'Font',
            Subtype: this.isCFF() ? 'CIDFontType0' : 'CIDFontType2',
            CIDToGIDMap: 'Identity',
            BaseFont: this.baseFontName,
            CIDSystemInfo: {
                Registry: PDFString.of('Adobe'),
                Ordering: PDFString.of('Identity'),
                Supplement: 0,
            },
            FontDescriptor: fontDescriptorRef,
            W: this.computeWidths(),
        });
        return context.register(cidFontDict);
    }
    async embedFontDescriptor(context) {
        const fontStreamRef = await this.embedFontStream(context);
        const { scale } = this;
        const { italicAngle, ascent, descent, capHeight, xHeight } = this.font;
        const { minX, minY, maxX, maxY } = this.font.bbox;
        const fontDescriptor = context.obj({
            Type: 'FontDescriptor',
            FontName: this.baseFontName,
            Flags: deriveFontFlags(this.font),
            FontBBox: [minX * scale, minY * scale, maxX * scale, maxY * scale],
            ItalicAngle: italicAngle,
            Ascent: ascent * scale,
            Descent: descent * scale,
            CapHeight: (capHeight || ascent) * scale,
            XHeight: (xHeight || 0) * scale,
            // Not sure how to compute/find this, nor is anybody else really:
            // https://stackoverflow.com/questions/35485179/stemv-value-of-the-truetype-font
            StemV: 0,
            [this.isCFF() ? 'FontFile3' : 'FontFile2']: fontStreamRef,
        });
        return context.register(fontDescriptor);
    }
    async serializeFont() {
        return this.fontData;
    }
    async embedFontStream(context) {
        const fontStream = context.flateStream(await this.serializeFont(), {
            Subtype: this.isCFF() ? 'CIDFontType0C' : undefined,
        });
        return context.register(fontStream);
    }
    embedUnicodeCmap(context) {
        const cmap = createCmap(this.glyphCache.access(), this.glyphId.bind(this));
        const cmapStream = context.flateStream(cmap);
        return context.register(cmapStream);
    }
    glyphId(glyph) {
        return glyph ? glyph.id : -1;
    }
    computeWidths() {
        const glyphs = this.glyphCache.access();
        const widths = [];
        let currSection = [];
        for (let idx = 0, len = glyphs.length; idx < len; idx++) {
            const currGlyph = glyphs[idx];
            const prevGlyph = glyphs[idx - 1];
            const currGlyphId = this.glyphId(currGlyph);
            const prevGlyphId = this.glyphId(prevGlyph);
            if (idx === 0) {
                widths.push(currGlyphId);
            }
            else if (currGlyphId - prevGlyphId !== 1) {
                widths.push(currSection);
                widths.push(currGlyphId);
                currSection = [];
            }
            currSection.push(currGlyph.advanceWidth * this.scale);
        }
        widths.push(currSection);
        return widths;
    }
}
export default CustomFontEmbedder;
