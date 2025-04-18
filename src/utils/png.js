import UPNG from '@pdf-lib/upng';
const getImageType = (ctype) => {
    if (ctype === 0)
        return PngType.Greyscale;
    if (ctype === 2)
        return PngType.Truecolour;
    if (ctype === 3)
        return PngType.IndexedColour;
    if (ctype === 4)
        return PngType.GreyscaleWithAlpha;
    if (ctype === 6)
        return PngType.TruecolourWithAlpha;
    throw new Error(`Unknown color type: ${ctype}`);
};
const splitAlphaChannel = (rgbaChannel) => {
    const pixelCount = Math.floor(rgbaChannel.length / 4);
    const rgbChannel = new Uint8Array(pixelCount * 3);
    const alphaChannel = new Uint8Array(pixelCount * 1);
    let rgbaOffset = 0;
    let rgbOffset = 0;
    let alphaOffset = 0;
    while (rgbaOffset < rgbaChannel.length) {
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        alphaChannel[alphaOffset++] = rgbaChannel[rgbaOffset++];
    }
    return { rgbChannel, alphaChannel };
};
export var PngType;
(function (PngType) {
    PngType["Greyscale"] = "Greyscale";
    PngType["Truecolour"] = "Truecolour";
    PngType["IndexedColour"] = "IndexedColour";
    PngType["GreyscaleWithAlpha"] = "GreyscaleWithAlpha";
    PngType["TruecolourWithAlpha"] = "TruecolourWithAlpha";
})(PngType || (PngType = {}));
export class PNG {
    constructor(pngData) {
        Object.defineProperty(this, "rgbChannel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "alphaChannel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        Object.defineProperty(this, "bitsPerComponent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const upng = UPNG.decode(pngData.buffer);
        const frames = UPNG.toRGBA8(upng);
        if (frames.length > 1)
            throw new Error(`Animated PNGs are not supported`);
        const frame = new Uint8Array(frames[0]);
        const { rgbChannel, alphaChannel } = splitAlphaChannel(frame);
        this.rgbChannel = rgbChannel;
        const hasAlphaValues = alphaChannel.some((a) => a < 255);
        if (hasAlphaValues)
            this.alphaChannel = alphaChannel;
        this.type = getImageType(upng.ctype);
        this.width = upng.width;
        this.height = upng.height;
        this.bitsPerComponent = 8;
    }
}
Object.defineProperty(PNG, "load", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (pngData) => new PNG(pngData)
});
