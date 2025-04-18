import { MethodNotImplementedError } from '@/core/errors';
class PDFObject {
    clone(_context) {
        throw new MethodNotImplementedError(this.constructor.name, 'clone');
    }
    toString() {
        throw new MethodNotImplementedError(this.constructor.name, 'toString');
    }
    sizeInBytes() {
        throw new MethodNotImplementedError(this.constructor.name, 'sizeInBytes');
    }
    copyBytesInto(_buffer, _offset) {
        throw new MethodNotImplementedError(this.constructor.name, 'copyBytesInto');
    }
}
export default PDFObject;
