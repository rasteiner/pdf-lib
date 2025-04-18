import DecodeStream from '@/core/streams/DecodeStream';
import { StreamType } from '@/core/streams/Stream';
declare class AsciiHexStream extends DecodeStream {
    private stream;
    private firstDigit;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
}
export default AsciiHexStream;
