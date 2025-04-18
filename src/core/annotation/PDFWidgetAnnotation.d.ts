import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import PDFRef from '@/core/objects/PDFRef';
import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFContext from '@/core/PDFContext';
import BorderStyle from '@/core/annotation/BorderStyle';
import PDFAnnotation from '@/core/annotation/PDFAnnotation';
import AppearanceCharacteristics from '@/core/annotation/AppearanceCharacteristics';
declare class PDFWidgetAnnotation extends PDFAnnotation {
    static fromDict: (dict: PDFDict) => PDFWidgetAnnotation;
    static create: (context: PDFContext, parent: PDFRef) => PDFWidgetAnnotation;
    MK(): PDFDict | undefined;
    BS(): PDFDict | undefined;
    DA(): PDFString | PDFHexString | undefined;
    P(): PDFRef | undefined;
    setP(page: PDFRef): void;
    setDefaultAppearance(appearance: string): void;
    getDefaultAppearance(): string | undefined;
    getAppearanceCharacteristics(): AppearanceCharacteristics | undefined;
    getOrCreateAppearanceCharacteristics(): AppearanceCharacteristics;
    getBorderStyle(): BorderStyle | undefined;
    getOrCreateBorderStyle(): BorderStyle;
    getOnValue(): PDFName | undefined;
}
export default PDFWidgetAnnotation;
