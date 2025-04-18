import { setFillingCmykColor, setFillingGrayscaleColor, setFillingRgbColor, setStrokingCmykColor, setStrokingGrayscaleColor, setStrokingRgbColor, } from '@/api/operators';
import { assertRange, error } from '@/utils';
export var ColorTypes;
(function (ColorTypes) {
    ColorTypes["Grayscale"] = "Grayscale";
    ColorTypes["RGB"] = "RGB";
    ColorTypes["CMYK"] = "CMYK";
})(ColorTypes || (ColorTypes = {}));
export const grayscale = (gray) => {
    assertRange(gray, 'gray', 0.0, 1.0);
    return { type: ColorTypes.Grayscale, gray };
};
export const rgb = (red, green, blue) => {
    assertRange(red, 'red', 0, 1);
    assertRange(green, 'green', 0, 1);
    assertRange(blue, 'blue', 0, 1);
    return { type: ColorTypes.RGB, red, green, blue };
};
export const cmyk = (cyan, magenta, yellow, key) => {
    assertRange(cyan, 'cyan', 0, 1);
    assertRange(magenta, 'magenta', 0, 1);
    assertRange(yellow, 'yellow', 0, 1);
    assertRange(key, 'key', 0, 1);
    return { type: ColorTypes.CMYK, cyan, magenta, yellow, key };
};
const { Grayscale, RGB, CMYK } = ColorTypes;
// prettier-ignore
export const setFillingColor = (color) => color.type === Grayscale ? setFillingGrayscaleColor(color.gray)
    : color.type === RGB ? setFillingRgbColor(color.red, color.green, color.blue)
        : color.type === CMYK ? setFillingCmykColor(color.cyan, color.magenta, color.yellow, color.key)
            : error(`Invalid color: ${JSON.stringify(color)}`);
// prettier-ignore
export const setStrokingColor = (color) => color.type === Grayscale ? setStrokingGrayscaleColor(color.gray)
    : color.type === RGB ? setStrokingRgbColor(color.red, color.green, color.blue)
        : color.type === CMYK ? setStrokingCmykColor(color.cyan, color.magenta, color.yellow, color.key)
            : error(`Invalid color: ${JSON.stringify(color)}`);
// prettier-ignore
export const componentsToColor = (comps, scale = 1) => (comps?.length === 1 ? grayscale(comps[0] * scale)
    : comps?.length === 3 ? rgb(comps[0] * scale, comps[1] * scale, comps[2] * scale)
        : comps?.length === 4 ? cmyk(comps[0] * scale, comps[1] * scale, comps[2] * scale, comps[3] * scale)
            : undefined);
// prettier-ignore
export const colorToComponents = (color) => color.type === Grayscale ? [color.gray]
    : color.type === RGB ? [color.red, color.green, color.blue]
        : color.type === CMYK ? [color.cyan, color.magenta, color.yellow, color.key]
            : error(`Invalid color: ${JSON.stringify(color)}`);
