import pako from 'pako';
import { MethodNotImplementedError } from '@/core/errors';
import PDFName from '@/core/objects/PDFName';
import PDFStream from '@/core/objects/PDFStream';
import { Cache } from '@/utils';
class PDFFlateStream extends PDFStream {
    constructor(dict, encode) {
        super(dict);
        Object.defineProperty(this, "contentsCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "encode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "computeContents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const unencodedContents = this.getUnencodedContents();
                return this.encode ? pako.deflate(unencodedContents) : unencodedContents;
            }
        });
        this.encode = encode;
        if (encode)
            dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
        this.contentsCache = Cache.populatedBy(this.computeContents);
    }
    getContents() {
        return this.contentsCache.access();
    }
    getContentsSize() {
        return this.contentsCache.access().length;
    }
    getUnencodedContents() {
        throw new MethodNotImplementedError(this.constructor.name, 'getUnencodedContents');
    }
}
export default PDFFlateStream;
