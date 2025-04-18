import PDFObject from '@/core/objects/PDFObject';
import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFArray from '@/core/objects/PDFArray';
import PDFName from '@/core/objects/PDFName';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
declare class PDFAcroButton extends PDFAcroTerminal {
    Opt(): PDFString | PDFHexString | PDFArray | undefined;
    setOpt(opt: PDFObject[]): void;
    getExportValues(): (PDFString | PDFHexString)[] | undefined;
    removeExportValue(idx: number): void;
    normalizeExportValues(): void;
    /**
     * Reuses existing opt if one exists with the same value (assuming
     * `useExistingIdx` is `true`). Returns index of existing (or new) opt.
     */
    addOpt(opt: PDFHexString | PDFString, useExistingOptIdx: boolean): number;
    addWidgetWithOpt(widget: PDFRef, opt: PDFHexString | PDFString, useExistingOptIdx: boolean): PDFName;
}
export default PDFAcroButton;
