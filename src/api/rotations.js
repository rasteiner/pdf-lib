import { assertIs, error } from '@/utils';
export var RotationTypes;
(function (RotationTypes) {
    RotationTypes["Degrees"] = "degrees";
    RotationTypes["Radians"] = "radians";
})(RotationTypes || (RotationTypes = {}));
export const radians = (radianAngle) => {
    assertIs(radianAngle, 'radianAngle', ['number']);
    return { type: RotationTypes.Radians, angle: radianAngle };
};
export const degrees = (degreeAngle) => {
    assertIs(degreeAngle, 'degreeAngle', ['number']);
    return { type: RotationTypes.Degrees, angle: degreeAngle };
};
const { Radians, Degrees } = RotationTypes;
export const degreesToRadians = (degree) => (degree * Math.PI) / 180;
export const radiansToDegrees = (radian) => (radian * 180) / Math.PI;
// prettier-ignore
export const toRadians = (rotation) => rotation.type === Radians ? rotation.angle
    : rotation.type === Degrees ? degreesToRadians(rotation.angle)
        : error(`Invalid rotation: ${JSON.stringify(rotation)}`);
// prettier-ignore
export const toDegrees = (rotation) => rotation.type === Radians ? radiansToDegrees(rotation.angle)
    : rotation.type === Degrees ? rotation.angle
        : error(`Invalid rotation: ${JSON.stringify(rotation)}`);
export const reduceRotation = (degreeAngle = 0) => {
    const quadrants = (degreeAngle / 90) % 4;
    if (quadrants === 0)
        return 0;
    if (quadrants === 1)
        return 90;
    if (quadrants === 2)
        return 180;
    if (quadrants === 3)
        return 270;
    return 0; // `degreeAngle` is not a multiple of 90
};
export const adjustDimsForRotation = (dims, degreeAngle = 0) => {
    const rotation = reduceRotation(degreeAngle);
    return rotation === 90 || rotation === 270
        ? { width: dims.height, height: dims.width }
        : { width: dims.width, height: dims.height };
};
export const rotateRectangle = (rectangle, borderWidth = 0, degreeAngle = 0) => {
    const { x, y, width: w, height: h } = rectangle;
    const r = reduceRotation(degreeAngle);
    const b = borderWidth / 2;
    // prettier-ignore
    if (r === 0)
        return { x: x - b, y: y - b, width: w, height: h };
    else if (r === 90)
        return { x: x - h + b, y: y - b, width: h, height: w };
    else if (r === 180)
        return { x: x - w + b, y: y - h + b, width: w, height: h };
    else if (r === 270)
        return { x: x - b, y: y - w + b, width: h, height: w };
    else
        return { x: x - b, y: y - b, width: w, height: h };
};
