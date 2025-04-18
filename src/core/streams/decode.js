import { UnexpectedObjectTypeError, UnsupportedEncodingError, } from '@/core/errors';
import PDFArray from '@/core/objects/PDFArray';
import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import Ascii85Stream from '@/core/streams/Ascii85Stream';
import AsciiHexStream from '@/core/streams/AsciiHexStream';
import FlateStream from '@/core/streams/FlateStream';
import LZWStream from '@/core/streams/LZWStream';
import RunLengthStream from '@/core/streams/RunLengthStream';
import Stream from '@/core/streams/Stream';
const decodeStream = (stream, encoding, params) => {
    if (encoding === PDFName.of('FlateDecode')) {
        return new FlateStream(stream);
    }
    if (encoding === PDFName.of('LZWDecode')) {
        let earlyChange = 1;
        if (params instanceof PDFDict) {
            const EarlyChange = params.lookup(PDFName.of('EarlyChange'));
            if (EarlyChange instanceof PDFNumber) {
                earlyChange = EarlyChange.asNumber();
            }
        }
        return new LZWStream(stream, undefined, earlyChange);
    }
    if (encoding === PDFName.of('ASCII85Decode')) {
        return new Ascii85Stream(stream);
    }
    if (encoding === PDFName.of('ASCIIHexDecode')) {
        return new AsciiHexStream(stream);
    }
    if (encoding === PDFName.of('RunLengthDecode')) {
        return new RunLengthStream(stream);
    }
    throw new UnsupportedEncodingError(encoding.asString());
};
export const decodePDFRawStream = ({ dict, contents }) => {
    let stream = new Stream(contents);
    const Filter = dict.lookup(PDFName.of('Filter'));
    const DecodeParms = dict.lookup(PDFName.of('DecodeParms'));
    if (Filter instanceof PDFName) {
        stream = decodeStream(stream, Filter, DecodeParms);
    }
    else if (Filter instanceof PDFArray) {
        for (let idx = 0, len = Filter.size(); idx < len; idx++) {
            stream = decodeStream(stream, Filter.lookup(idx, PDFName), DecodeParms && DecodeParms.lookupMaybe(idx, PDFDict));
        }
    }
    else if (!!Filter) {
        throw new UnexpectedObjectTypeError([PDFName, PDFArray], Filter);
    }
    return stream;
};
