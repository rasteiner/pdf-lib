import PDFDict from '@/core/objects/PDFDict';
import PDFNumber from '@/core/objects/PDFNumber';
declare class BorderStyle {
    readonly dict: PDFDict;
    static fromDict: (dict: PDFDict) => BorderStyle;
    protected constructor(dict: PDFDict);
    W(): PDFNumber | undefined;
    getWidth(): number | undefined;
    setWidth(width: number): void;
}
export default BorderStyle;
