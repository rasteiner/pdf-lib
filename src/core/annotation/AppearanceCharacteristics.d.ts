import PDFDict from '@/core/objects/PDFDict';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFArray from '@/core/objects/PDFArray';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFString from '@/core/objects/PDFString';
declare class AppearanceCharacteristics {
    readonly dict: PDFDict;
    static fromDict: (dict: PDFDict) => AppearanceCharacteristics;
    protected constructor(dict: PDFDict);
    R(): PDFNumber | undefined;
    BC(): PDFArray | undefined;
    BG(): PDFArray | undefined;
    CA(): PDFHexString | PDFString | undefined;
    RC(): PDFHexString | PDFString | undefined;
    AC(): PDFHexString | PDFString | undefined;
    getRotation(): number | undefined;
    getBorderColor(): number[] | undefined;
    getBackgroundColor(): number[] | undefined;
    getCaptions(): {
        normal?: string;
        rollover?: string;
        down?: string;
    };
    setRotation(rotation: number): void;
    setBorderColor(color: number[]): void;
    setBackgroundColor(color: number[]): void;
    setCaptions(captions: {
        normal: string;
        rollover?: string;
        down?: string;
    }): void;
}
export default AppearanceCharacteristics;
