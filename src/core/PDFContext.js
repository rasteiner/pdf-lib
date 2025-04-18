import pako from 'pako';
import PDFHeader from '@/core/document/PDFHeader';
import { UnexpectedObjectTypeError } from '@/core/errors';
import PDFArray from '@/core/objects/PDFArray';
import PDFBool from '@/core/objects/PDFBool';
import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFNull from '@/core/objects/PDFNull';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFObject from '@/core/objects/PDFObject';
import PDFRawStream from '@/core/objects/PDFRawStream';
import PDFRef from '@/core/objects/PDFRef';
import PDFOperator from '@/core/operators/PDFOperator';
import Ops from '@/core/operators/PDFOperatorNames';
import PDFContentStream from '@/core/structures/PDFContentStream';
import { typedArrayFor } from '@/utils';
import { SimpleRNG } from '@/utils/rng';
const byAscendingObjectNumber = ([a], [b]) => a.objectNumber - b.objectNumber;
class PDFContext {
    constructor() {
        Object.defineProperty(this, "largestObjectNumber", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "header", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "trailerInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rng", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "indirectObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pushGraphicsStateContentStreamRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "popGraphicsStateContentStreamRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.largestObjectNumber = 0;
        this.header = PDFHeader.forVersion(1, 7);
        this.trailerInfo = {};
        this.indirectObjects = new Map();
        this.rng = SimpleRNG.withSeed(1);
    }
    assign(ref, object) {
        this.indirectObjects.set(ref, object);
        if (ref.objectNumber > this.largestObjectNumber) {
            this.largestObjectNumber = ref.objectNumber;
        }
    }
    nextRef() {
        this.largestObjectNumber += 1;
        return PDFRef.of(this.largestObjectNumber);
    }
    register(object) {
        const ref = this.nextRef();
        this.assign(ref, object);
        return ref;
    }
    delete(ref) {
        return this.indirectObjects.delete(ref);
    }
    lookupMaybe(ref, ...types) {
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        const preservePDFNull = types.includes(PDFNull);
        const result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
        if (!result || (result === PDFNull && !preservePDFNull))
            return undefined;
        for (let idx = 0, len = types.length; idx < len; idx++) {
            const type = types[idx];
            if (type === PDFNull) {
                if (result === PDFNull)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new UnexpectedObjectTypeError(types, result);
    }
    lookup(ref, ...types) {
        const result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
        if (types.length === 0)
            return result;
        for (let idx = 0, len = types.length; idx < len; idx++) {
            const type = types[idx];
            if (type === PDFNull) {
                if (result === PDFNull)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new UnexpectedObjectTypeError(types, result);
    }
    getObjectRef(pdfObject) {
        const entries = Array.from(this.indirectObjects.entries());
        for (let idx = 0, len = entries.length; idx < len; idx++) {
            const [ref, object] = entries[idx];
            if (object === pdfObject) {
                return ref;
            }
        }
        return undefined;
    }
    enumerateIndirectObjects() {
        return Array.from(this.indirectObjects.entries()).sort(byAscendingObjectNumber);
    }
    obj(literal) {
        if (literal instanceof PDFObject) {
            return literal;
        }
        else if (literal === null || literal === undefined) {
            return PDFNull;
        }
        else if (typeof literal === 'string') {
            return PDFName.of(literal);
        }
        else if (typeof literal === 'number') {
            return PDFNumber.of(literal);
        }
        else if (typeof literal === 'boolean') {
            return literal ? PDFBool.True : PDFBool.False;
        }
        else if (Array.isArray(literal)) {
            const array = PDFArray.withContext(this);
            for (let idx = 0, len = literal.length; idx < len; idx++) {
                array.push(this.obj(literal[idx]));
            }
            return array;
        }
        else {
            const dict = PDFDict.withContext(this);
            const keys = Object.keys(literal);
            for (let idx = 0, len = keys.length; idx < len; idx++) {
                const key = keys[idx];
                const value = literal[key];
                if (value !== undefined)
                    dict.set(PDFName.of(key), this.obj(value));
            }
            return dict;
        }
    }
    stream(contents, dict = {}) {
        return PDFRawStream.of(this.obj(dict), typedArrayFor(contents));
    }
    flateStream(contents, dict = {}) {
        return this.stream(pako.deflate(typedArrayFor(contents)), {
            ...dict,
            Filter: 'FlateDecode',
        });
    }
    contentStream(operators, dict = {}) {
        return PDFContentStream.of(this.obj(dict), operators);
    }
    formXObject(operators, dict = {}) {
        return this.contentStream(operators, {
            BBox: this.obj([0, 0, 0, 0]),
            Matrix: this.obj([1, 0, 0, 1, 0, 0]),
            ...dict,
            Type: 'XObject',
            Subtype: 'Form',
        });
    }
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    getPushGraphicsStateContentStream() {
        if (this.pushGraphicsStateContentStreamRef) {
            return this.pushGraphicsStateContentStreamRef;
        }
        const dict = this.obj({});
        const op = PDFOperator.of(Ops.PushGraphicsState);
        const stream = PDFContentStream.of(dict, [op]);
        this.pushGraphicsStateContentStreamRef = this.register(stream);
        return this.pushGraphicsStateContentStreamRef;
    }
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `Q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    getPopGraphicsStateContentStream() {
        if (this.popGraphicsStateContentStreamRef) {
            return this.popGraphicsStateContentStreamRef;
        }
        const dict = this.obj({});
        const op = PDFOperator.of(Ops.PopGraphicsState);
        const stream = PDFContentStream.of(dict, [op]);
        this.popGraphicsStateContentStreamRef = this.register(stream);
        return this.popGraphicsStateContentStreamRef;
    }
    addRandomSuffix(prefix, suffixLength = 4) {
        return `${prefix}-${Math.floor(this.rng.nextInt() * 10 ** suffixLength)}`;
    }
}
Object.defineProperty(PDFContext, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => new PDFContext()
});
export default PDFContext;
