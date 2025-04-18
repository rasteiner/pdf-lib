import { NextByteAssertionError } from '@/core/errors';
import { decodePDFRawStream } from '@/core/streams/decode';
import CharCodes from '@/core/syntax/CharCodes';
// TODO: See how line/col tracking affects performance
class ByteStream {
    constructor(bytes) {
        Object.defineProperty(this, "bytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "length", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "line", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "column", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.bytes = bytes;
        this.length = this.bytes.length;
    }
    moveTo(offset) {
        this.idx = offset;
    }
    next() {
        const byte = this.bytes[this.idx++];
        if (byte === CharCodes.Newline) {
            this.line += 1;
            this.column = 0;
        }
        else {
            this.column += 1;
        }
        return byte;
    }
    assertNext(expected) {
        if (this.peek() !== expected) {
            throw new NextByteAssertionError(this.position(), expected, this.peek());
        }
        return this.next();
    }
    peek() {
        return this.bytes[this.idx];
    }
    peekAhead(steps) {
        return this.bytes[this.idx + steps];
    }
    peekAt(offset) {
        return this.bytes[offset];
    }
    done() {
        return this.idx >= this.length;
    }
    offset() {
        return this.idx;
    }
    slice(start, end) {
        return this.bytes.slice(start, end);
    }
    position() {
        return { line: this.line, column: this.column, offset: this.idx };
    }
}
Object.defineProperty(ByteStream, "of", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (bytes) => new ByteStream(bytes)
});
Object.defineProperty(ByteStream, "fromPDFRawStream", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (rawStream) => ByteStream.of(decodePDFRawStream(rawStream).decode())
});
export default ByteStream;
