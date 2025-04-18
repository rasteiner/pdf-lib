import DecodeStream from '@/core/streams/DecodeStream';
import { StreamType } from '@/core/streams/Stream';
declare class LZWStream extends DecodeStream {
    private stream;
    private cachedData;
    private bitsCached;
    private lzwState?;
    constructor(stream: StreamType, maybeLength: number | undefined, earlyChange: 0 | 1);
    protected readBlock(): void;
    private readBits;
}
export default LZWStream;
