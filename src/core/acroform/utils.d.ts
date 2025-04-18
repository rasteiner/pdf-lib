import PDFDict from '@/core/objects/PDFDict';
import PDFArray from '@/core/objects/PDFArray';
import PDFRef from '@/core/objects/PDFRef';
import PDFAcroField from '@/core/acroform/PDFAcroField';
export declare const createPDFAcroFields: (kidDicts?: PDFArray) => [PDFAcroField, PDFRef][];
export declare const createPDFAcroField: (dict: PDFDict, ref: PDFRef) => PDFAcroField;
