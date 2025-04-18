import { PrivateConstructorError } from '@/core/errors';
import PDFObject from '@/core/objects/PDFObject';
import CharCodes from '@/core/syntax/CharCodes';
import { IsIrregular } from '@/core/syntax/Irregular';
import { charFromHexCode, copyStringIntoBuffer, toCharCode, toHexString, } from '@/utils';
const decodeName = (name) => name.replace(/#([\dABCDEF]{2})/g, (_, hex) => charFromHexCode(hex));
const isRegularChar = (charCode) => charCode >= CharCodes.ExclamationPoint &&
    charCode <= CharCodes.Tilde &&
    !IsIrregular[charCode];
const ENFORCER = {};
const pool = new Map();
class PDFName extends PDFObject {
    constructor(enforcer, name) {
        if (enforcer !== ENFORCER)
            throw new PrivateConstructorError('PDFName');
        super();
        /* tslint:enable member-ordering */
        Object.defineProperty(this, "encodedName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        let encodedName = '/';
        for (let idx = 0, len = name.length; idx < len; idx++) {
            const character = name[idx];
            const code = toCharCode(character);
            encodedName += isRegularChar(code) ? character : `#${toHexString(code)}`;
        }
        this.encodedName = encodedName;
    }
    asBytes() {
        const bytes = [];
        let hex = '';
        let escaped = false;
        const pushByte = (byte) => {
            if (byte !== undefined)
                bytes.push(byte);
            escaped = false;
        };
        for (let idx = 1, len = this.encodedName.length; idx < len; idx++) {
            const char = this.encodedName[idx];
            const byte = toCharCode(char);
            const nextChar = this.encodedName[idx + 1];
            if (!escaped) {
                if (byte === CharCodes.Hash)
                    escaped = true;
                else
                    pushByte(byte);
            }
            else {
                if ((byte >= CharCodes.Zero && byte <= CharCodes.Nine) ||
                    (byte >= CharCodes.a && byte <= CharCodes.f) ||
                    (byte >= CharCodes.A && byte <= CharCodes.F)) {
                    hex += char;
                    if (hex.length === 2 ||
                        !((nextChar >= '0' && nextChar <= '9') ||
                            (nextChar >= 'a' && nextChar <= 'f') ||
                            (nextChar >= 'A' && nextChar <= 'F'))) {
                        pushByte(parseInt(hex, 16));
                        hex = '';
                    }
                }
                else {
                    pushByte(byte);
                }
            }
        }
        return new Uint8Array(bytes);
    }
    // TODO: This should probably use `utf8Decode()`
    // TODO: Polyfill Array.from?
    decodeText() {
        const bytes = this.asBytes();
        return String.fromCharCode(...Array.from(bytes));
    }
    asString() {
        return this.encodedName;
    }
    /** @deprecated in favor of [[PDFName.asString]] */
    value() {
        return this.encodedName;
    }
    clone() {
        return this;
    }
    toString() {
        return this.encodedName;
    }
    sizeInBytes() {
        return this.encodedName.length;
    }
    copyBytesInto(buffer, offset) {
        offset += copyStringIntoBuffer(this.encodedName, buffer, offset);
        return this.encodedName.length;
    }
}
Object.defineProperty(PDFName, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (name) => {
        const decodedValue = decodeName(name);
        let instance = pool.get(decodedValue);
        if (!instance) {
            instance = new PDFName(ENFORCER, decodedValue);
            pool.set(decodedValue, instance);
        }
        return instance;
    }
});
/* tslint:disable member-ordering */
Object.defineProperty(PDFName, "Length", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Length')
});
Object.defineProperty(PDFName, "FlateDecode", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('FlateDecode')
});
Object.defineProperty(PDFName, "Resources", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Resources')
});
Object.defineProperty(PDFName, "Font", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Font')
});
Object.defineProperty(PDFName, "XObject", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('XObject')
});
Object.defineProperty(PDFName, "ExtGState", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('ExtGState')
});
Object.defineProperty(PDFName, "Contents", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Contents')
});
Object.defineProperty(PDFName, "Type", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Type')
});
Object.defineProperty(PDFName, "Parent", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Parent')
});
Object.defineProperty(PDFName, "MediaBox", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('MediaBox')
});
Object.defineProperty(PDFName, "Page", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Page')
});
Object.defineProperty(PDFName, "Annots", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Annots')
});
Object.defineProperty(PDFName, "TrimBox", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('TrimBox')
});
Object.defineProperty(PDFName, "ArtBox", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('ArtBox')
});
Object.defineProperty(PDFName, "BleedBox", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('BleedBox')
});
Object.defineProperty(PDFName, "CropBox", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('CropBox')
});
Object.defineProperty(PDFName, "Rotate", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Rotate')
});
Object.defineProperty(PDFName, "Title", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Title')
});
Object.defineProperty(PDFName, "Author", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Author')
});
Object.defineProperty(PDFName, "Subject", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Subject')
});
Object.defineProperty(PDFName, "Creator", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Creator')
});
Object.defineProperty(PDFName, "Keywords", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Keywords')
});
Object.defineProperty(PDFName, "Producer", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('Producer')
});
Object.defineProperty(PDFName, "CreationDate", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('CreationDate')
});
Object.defineProperty(PDFName, "ModDate", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: PDFName.of('ModDate')
});
export default PDFName;
