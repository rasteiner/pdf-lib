import { arrayAsString } from '@/utils';
export class MethodNotImplementedError extends Error {
    constructor(className, methodName) {
        const msg = `Method ${className}.${methodName}() not implemented`;
        super(msg);
    }
}
export class PrivateConstructorError extends Error {
    constructor(className) {
        const msg = `Cannot construct ${className} - it has a private constructor`;
        super(msg);
    }
}
export class UnexpectedObjectTypeError extends Error {
    constructor(expected, actual) {
        const name = (t) => t?.name ?? t?.constructor?.name;
        const expectedTypes = Array.isArray(expected)
            ? expected.map(name)
            : [name(expected)];
        const msg = `Expected instance of ${expectedTypes.join(' or ')}, ` +
            `but got instance of ${actual ? name(actual) : actual}`;
        super(msg);
    }
}
export class UnsupportedEncodingError extends Error {
    constructor(encoding) {
        const msg = `${encoding} stream encoding not supported`;
        super(msg);
    }
}
export class ReparseError extends Error {
    constructor(className, methodName) {
        const msg = `Cannot call ${className}.${methodName}() more than once`;
        super(msg);
    }
}
export class MissingCatalogError extends Error {
    constructor(ref) {
        const msg = `Missing catalog (ref=${ref})`;
        super(msg);
    }
}
export class MissingPageContentsEmbeddingError extends Error {
    constructor() {
        const msg = `Can't embed page with missing Contents`;
        super(msg);
    }
}
export class UnrecognizedStreamTypeError extends Error {
    constructor(stream) {
        const streamType = stream?.contructor?.name ?? stream?.name ?? stream;
        const msg = `Unrecognized stream type: ${streamType}`;
        super(msg);
    }
}
export class PageEmbeddingMismatchedContextError extends Error {
    constructor() {
        const msg = `Found mismatched contexts while embedding pages. All pages in the array passed to \`PDFDocument.embedPages()\` must be from the same document.`;
        super(msg);
    }
}
export class PDFArrayIsNotRectangleError extends Error {
    constructor(size) {
        const msg = `Attempted to convert PDFArray with ${size} elements to rectangle, but must have exactly 4 elements.`;
        super(msg);
    }
}
export class InvalidPDFDateStringError extends Error {
    constructor(value) {
        const msg = `Attempted to convert "${value}" to a date, but it does not match the PDF date string format.`;
        super(msg);
    }
}
export class InvalidTargetIndexError extends Error {
    constructor(targetIndex, Count) {
        const msg = `Invalid targetIndex specified: targetIndex=${targetIndex} must be less than Count=${Count}`;
        super(msg);
    }
}
export class CorruptPageTreeError extends Error {
    constructor(targetIndex, operation) {
        const msg = `Failed to ${operation} at targetIndex=${targetIndex} due to corrupt page tree: It is likely that one or more 'Count' entries are invalid`;
        super(msg);
    }
}
export class IndexOutOfBoundsError extends Error {
    constructor(index, min, max) {
        const msg = `index should be at least ${min} and at most ${max}, but was actually ${index}`;
        super(msg);
    }
}
export class InvalidAcroFieldValueError extends Error {
    constructor() {
        const msg = `Attempted to set invalid field value`;
        super(msg);
    }
}
export class MultiSelectValueError extends Error {
    constructor() {
        const msg = `Attempted to select multiple values for single-select field`;
        super(msg);
    }
}
export class MissingDAEntryError extends Error {
    constructor(fieldName) {
        const msg = `No /DA (default appearance) entry found for field: ${fieldName}`;
        super(msg);
    }
}
export class MissingTfOperatorError extends Error {
    constructor(fieldName) {
        const msg = `No Tf operator found for DA of field: ${fieldName}`;
        super(msg);
    }
}
export class NumberParsingError extends Error {
    constructor(pos, value) {
        const msg = `Failed to parse number ` +
            `(line:${pos.line} col:${pos.column} offset=${pos.offset}): "${value}"`;
        super(msg);
    }
}
export class PDFParsingError extends Error {
    constructor(pos, details) {
        const msg = `Failed to parse PDF document ` +
            `(line:${pos.line} col:${pos.column} offset=${pos.offset}): ${details}`;
        super(msg);
    }
}
export class NextByteAssertionError extends PDFParsingError {
    constructor(pos, expectedByte, actualByte) {
        const msg = `Expected next byte to be ${expectedByte} but it was actually ${actualByte}`;
        super(pos, msg);
    }
}
export class PDFObjectParsingError extends PDFParsingError {
    constructor(pos, byte) {
        const msg = `Failed to parse PDF object starting with the following byte: ${byte}`;
        super(pos, msg);
    }
}
export class PDFInvalidObjectParsingError extends PDFParsingError {
    constructor(pos) {
        const msg = `Failed to parse invalid PDF object`;
        super(pos, msg);
    }
}
export class PDFStreamParsingError extends PDFParsingError {
    constructor(pos) {
        const msg = `Failed to parse PDF stream`;
        super(pos, msg);
    }
}
export class UnbalancedParenthesisError extends PDFParsingError {
    constructor(pos) {
        const msg = `Failed to parse PDF literal string due to unbalanced parenthesis`;
        super(pos, msg);
    }
}
export class StalledParserError extends PDFParsingError {
    constructor(pos) {
        const msg = `Parser stalled`;
        super(pos, msg);
    }
}
export class MissingPDFHeaderError extends PDFParsingError {
    constructor(pos) {
        const msg = `No PDF header found`;
        super(pos, msg);
    }
}
export class MissingKeywordError extends PDFParsingError {
    constructor(pos, keyword) {
        const msg = `Did not find expected keyword '${arrayAsString(keyword)}'`;
        super(pos, msg);
    }
}
