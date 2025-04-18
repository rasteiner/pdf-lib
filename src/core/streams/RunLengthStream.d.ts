import DecodeStream from '@/core/streams/DecodeStream';
import { StreamType } from '@/core/streams/Stream';
declare class RunLengthStream extends DecodeStream {
    private stream;
    constructor(stream: StreamType, maybeLength?: number);
    protected readBlock(): void;
}
export default RunLengthStream;
