import PDFArray from '@/core/objects/PDFArray';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFString from '@/core/objects/PDFString';
import PDFOperatorNames from '@/core/operators/PDFOperatorNames';
import PDFContext from '@/core/PDFContext';
export type PDFOperatorArg = string | PDFName | PDFArray | PDFNumber | PDFString | PDFHexString;
declare class PDFOperator {
    static of: (name: PDFOperatorNames, args?: PDFOperatorArg[]) => PDFOperator;
    private readonly name;
    private readonly args;
    private constructor();
    clone(context?: PDFContext): PDFOperator;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(buffer: Uint8Array, offset: number): number;
}
export default PDFOperator;
