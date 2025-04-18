import PDFArray from '@/core/objects/PDFArray';
import PDFBool from '@/core/objects/PDFBool';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFName from '@/core/objects/PDFName';
import PDFNull from '@/core/objects/PDFNull';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFObject from '@/core/objects/PDFObject';
import PDFRef from '@/core/objects/PDFRef';
import PDFStream from '@/core/objects/PDFStream';
import PDFString from '@/core/objects/PDFString';
import PDFContext from '@/core/PDFContext';
export type DictMap = Map<PDFName, PDFObject>;
declare class PDFDict extends PDFObject {
    static withContext: (context: PDFContext) => PDFDict;
    static fromMapWithContext: (map: DictMap, context: PDFContext) => PDFDict;
    readonly context: PDFContext;
    private readonly dict;
    protected constructor(map: DictMap, context: PDFContext);
    keys(): PDFName[];
    values(): PDFObject[];
    entries(): [PDFName, PDFObject][];
    set(key: PDFName, value: PDFObject): void;
    get(key: PDFName, preservePDFNull?: boolean): PDFObject | undefined;
    has(key: PDFName): boolean;
    lookupMaybe(key: PDFName, type: typeof PDFArray): PDFArray | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFBool): PDFBool | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFDict): PDFDict | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFHexString): PDFHexString | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFName): PDFName | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFNull): typeof PDFNull | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFNumber): PDFNumber | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFStream): PDFStream | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFRef): PDFRef | undefined;
    lookupMaybe(key: PDFName, type: typeof PDFString): PDFString | undefined;
    lookupMaybe(ref: PDFName, type1: typeof PDFString, type2: typeof PDFHexString): PDFString | PDFHexString | undefined;
    lookupMaybe(ref: PDFName, type1: typeof PDFDict, type2: typeof PDFStream): PDFDict | PDFStream | undefined;
    lookupMaybe(ref: PDFName, type1: typeof PDFString, type2: typeof PDFHexString, type3: typeof PDFArray): PDFString | PDFHexString | PDFArray | undefined;
    lookup(key: PDFName): PDFObject | undefined;
    lookup(key: PDFName, type: typeof PDFArray): PDFArray;
    lookup(key: PDFName, type: typeof PDFBool): PDFBool;
    lookup(key: PDFName, type: typeof PDFDict): PDFDict;
    lookup(key: PDFName, type: typeof PDFHexString): PDFHexString;
    lookup(key: PDFName, type: typeof PDFName): PDFName;
    lookup(key: PDFName, type: typeof PDFNull): typeof PDFNull;
    lookup(key: PDFName, type: typeof PDFNumber): PDFNumber;
    lookup(key: PDFName, type: typeof PDFStream): PDFStream;
    lookup(key: PDFName, type: typeof PDFRef): PDFRef;
    lookup(key: PDFName, type: typeof PDFString): PDFString;
    lookup(ref: PDFName, type1: typeof PDFString, type2: typeof PDFHexString): PDFString | PDFHexString;
    lookup(ref: PDFName, type1: typeof PDFDict, type2: typeof PDFStream): PDFDict | PDFStream;
    lookup(ref: PDFName, type1: typeof PDFString, type2: typeof PDFHexString, type3: typeof PDFArray): PDFString | PDFHexString | PDFArray;
    delete(key: PDFName): boolean;
    asMap(): Map<PDFName, PDFObject>;
    /** Generate a random key that doesn't exist in current key set */
    uniqueKey(tag?: string): PDFName;
    clone(context?: PDFContext): PDFDict;
    toString(): string;
    sizeInBytes(): number;
    copyBytesInto(buffer: Uint8Array, offset: number): number;
}
export default PDFDict;
