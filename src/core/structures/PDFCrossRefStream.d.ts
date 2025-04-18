import PDFDict from '@/core/objects/PDFDict';
import PDFRef from '@/core/objects/PDFRef';
import PDFContext from '@/core/PDFContext';
import PDFFlateStream from '@/core/structures/PDFFlateStream';
export declare enum EntryType {
    Deleted = 0,
    Uncompressed = 1,
    Compressed = 2
}
export interface DeletedEntry {
    type: EntryType.Deleted;
    ref: PDFRef;
    nextFreeObjectNumber: number;
}
export interface UncompressedEntry {
    type: EntryType.Uncompressed;
    ref: PDFRef;
    offset: number;
}
export interface CompressedEntry {
    type: EntryType.Compressed;
    ref: PDFRef;
    objectStreamRef: PDFRef;
    index: number;
}
export type Entry = DeletedEntry | UncompressedEntry | CompressedEntry;
export type EntryTuple = [number, number, number];
/**
 * Entries should be added using the [[addDeletedEntry]],
 * [[addUncompressedEntry]], and [[addCompressedEntry]] methods
 * **in order of ascending object number**.
 */
declare class PDFCrossRefStream extends PDFFlateStream {
    static create: (dict: PDFDict, encode?: boolean) => PDFCrossRefStream;
    static of: (dict: PDFDict, entries: Entry[], encode?: boolean) => PDFCrossRefStream;
    private readonly entries;
    private readonly entryTuplesCache;
    private readonly maxByteWidthsCache;
    private readonly indexCache;
    private constructor();
    addDeletedEntry(ref: PDFRef, nextFreeObjectNumber: number): void;
    addUncompressedEntry(ref: PDFRef, offset: number): void;
    addCompressedEntry(ref: PDFRef, objectStreamRef: PDFRef, index: number): void;
    clone(context?: PDFContext): PDFCrossRefStream;
    getContentsString(): string;
    getUnencodedContents(): Uint8Array;
    getUnencodedContentsSize(): number;
    updateDict(): void;
    private computeIndex;
    private computeEntryTuples;
    private computeMaxEntryByteWidths;
}
export default PDFCrossRefStream;
