import PDFDict from '@/core/objects/PDFDict';
import PDFOperator from '@/core/operators/PDFOperator';
import PDFContext from '@/core/PDFContext';
import PDFFlateStream from '@/core/structures/PDFFlateStream';
declare class PDFContentStream extends PDFFlateStream {
    static of: (dict: PDFDict, operators: PDFOperator[], encode?: boolean) => PDFContentStream;
    private readonly operators;
    private constructor();
    push(...operators: PDFOperator[]): void;
    clone(context?: PDFContext): PDFContentStream;
    getContentsString(): string;
    getUnencodedContents(): Uint8Array;
    getUnencodedContentsSize(): number;
}
export default PDFContentStream;
