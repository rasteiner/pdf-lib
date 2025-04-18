import { decodeFromBase64DataUri } from '@/utils/base64';
import { charFromCode } from '@/utils/strings';
export const last = (array) => array[array.length - 1];
// export const dropLast = <T>(array: T[]): T[] =>
// array.slice(0, array.length - 1);
export const typedArrayFor = (value) => {
    if (value instanceof Uint8Array)
        return value;
    const length = value.length;
    const typedArray = new Uint8Array(length);
    for (let idx = 0; idx < length; idx++) {
        typedArray[idx] = value.charCodeAt(idx);
    }
    return typedArray;
};
export const mergeIntoTypedArray = (...arrays) => {
    const arrayCount = arrays.length;
    const typedArrays = [];
    for (let idx = 0; idx < arrayCount; idx++) {
        const element = arrays[idx];
        typedArrays[idx] =
            element instanceof Uint8Array ? element : typedArrayFor(element);
    }
    let totalSize = 0;
    for (let idx = 0; idx < arrayCount; idx++) {
        totalSize += arrays[idx].length;
    }
    const merged = new Uint8Array(totalSize);
    let offset = 0;
    for (let arrIdx = 0; arrIdx < arrayCount; arrIdx++) {
        const arr = typedArrays[arrIdx];
        for (let byteIdx = 0, arrLen = arr.length; byteIdx < arrLen; byteIdx++) {
            merged[offset++] = arr[byteIdx];
        }
    }
    return merged;
};
export const mergeUint8Arrays = (arrays) => {
    let totalSize = 0;
    for (let idx = 0, len = arrays.length; idx < len; idx++) {
        totalSize += arrays[idx].length;
    }
    const mergedBuffer = new Uint8Array(totalSize);
    let offset = 0;
    for (let idx = 0, len = arrays.length; idx < len; idx++) {
        const array = arrays[idx];
        mergedBuffer.set(array, offset);
        offset += array.length;
    }
    return mergedBuffer;
};
export const arrayAsString = (array) => {
    let str = '';
    for (let idx = 0, len = array.length; idx < len; idx++) {
        str += charFromCode(array[idx]);
    }
    return str;
};
export const byAscendingId = (a, b) => a.id - b.id;
export const sortedUniq = (array, indexer) => {
    const uniq = [];
    for (let idx = 0, len = array.length; idx < len; idx++) {
        const curr = array[idx];
        const prev = array[idx - 1];
        if (idx === 0 || indexer(curr) !== indexer(prev)) {
            uniq.push(curr);
        }
    }
    return uniq;
};
// Arrays and TypedArrays in JS both have .reverse() methods, which would seem
// to negate the need for this function. However, not all runtimes support this
// method (e.g. React Native). This function compensates for that fact.
export const reverseArray = (array) => {
    const arrayLen = array.length;
    for (let idx = 0, len = Math.floor(arrayLen / 2); idx < len; idx++) {
        const leftIdx = idx;
        const rightIdx = arrayLen - idx - 1;
        const temp = array[idx];
        array[leftIdx] = array[rightIdx];
        array[rightIdx] = temp;
    }
    return array;
};
export const sum = (array) => {
    let total = 0;
    for (let idx = 0, len = array.length; idx < len; idx++) {
        total += array[idx];
    }
    return total;
};
export const range = (start, end) => {
    const arr = new Array(end - start);
    for (let idx = 0, len = arr.length; idx < len; idx++) {
        arr[idx] = start + idx;
    }
    return arr;
};
export const pluckIndices = (arr, indices) => {
    const plucked = new Array(indices.length);
    for (let idx = 0, len = indices.length; idx < len; idx++) {
        plucked[idx] = arr[indices[idx]];
    }
    return plucked;
};
export const canBeConvertedToUint8Array = (input) => input instanceof Uint8Array ||
    input instanceof ArrayBuffer ||
    typeof input === 'string';
export const toUint8Array = (input) => {
    if (typeof input === 'string') {
        return decodeFromBase64DataUri(input);
    }
    else if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    }
    else if (input instanceof Uint8Array) {
        return input;
    }
    else {
        throw new TypeError('`input` must be one of `string | ArrayBuffer | Uint8Array`');
    }
};
