import { PrivateConstructorError } from '@/core/errors';
import PDFObject from '@/core/objects/PDFObject';
import { copyStringIntoBuffer } from '@/utils';
const ENFORCER = {};
const pool = new Map();
class PDFRef extends PDFObject {
    constructor(enforcer, objectNumber, generationNumber) {
        if (enforcer !== ENFORCER)
            throw new PrivateConstructorError('PDFRef');
        super();
        Object.defineProperty(this, "objectNumber", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "generationNumber", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.objectNumber = objectNumber;
        this.generationNumber = generationNumber;
        this.tag = `${objectNumber} ${generationNumber} R`;
    }
    clone() {
        return this;
    }
    toString() {
        return this.tag;
    }
    sizeInBytes() {
        return this.tag.length;
    }
    copyBytesInto(buffer, offset) {
        offset += copyStringIntoBuffer(this.tag, buffer, offset);
        return this.tag.length;
    }
}
Object.defineProperty(PDFRef, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (objectNumber, generationNumber = 0) => {
        const tag = `${objectNumber} ${generationNumber} R`;
        let instance = pool.get(tag);
        if (!instance) {
            instance = new PDFRef(ENFORCER, objectNumber, generationNumber);
            pool.set(tag, instance);
        }
        return instance;
    }
});
export default PDFRef;
