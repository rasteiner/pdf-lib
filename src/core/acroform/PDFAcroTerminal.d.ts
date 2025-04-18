import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroField from '@/core/acroform/PDFAcroField';
import PDFWidgetAnnotation from '@/core/annotation/PDFWidgetAnnotation';
declare class PDFAcroTerminal extends PDFAcroField {
    static fromDict: (dict: PDFDict, ref: PDFRef) => PDFAcroTerminal;
    FT(): PDFName;
    getWidgets(): PDFWidgetAnnotation[];
    addWidget(ref: PDFRef): void;
    removeWidget(idx: number): void;
    normalizedEntries(): {
        Kids: import("..").PDFArray;
    };
}
export default PDFAcroTerminal;
