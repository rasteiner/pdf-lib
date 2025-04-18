import { PDFName, PDFNumber } from '@/core';
export const asPDFName = (name) => name instanceof PDFName ? name : PDFName.of(name);
export const asPDFNumber = (num) => num instanceof PDFNumber ? num : PDFNumber.of(num);
export const asNumber = (num) => num instanceof PDFNumber ? num.asNumber() : num;
