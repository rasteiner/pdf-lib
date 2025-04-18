import PDFDict, { DictMap } from '@/core/objects/PDFDict';
import PDFRef from '@/core/objects/PDFRef';
import PDFContext from '@/core/PDFContext';
import PDFPageTree from '@/core/structures/PDFPageTree';
import { PDFAcroForm } from '@/core/acroform';
import ViewerPreferences from '../interactive/ViewerPreferences';
declare class PDFCatalog extends PDFDict {
    static withContextAndPages: (context: PDFContext, pages: PDFPageTree | PDFRef) => PDFCatalog;
    static fromMapWithContext: (map: DictMap, context: PDFContext) => PDFCatalog;
    Pages(): PDFPageTree;
    AcroForm(): PDFDict | undefined;
    getAcroForm(): PDFAcroForm | undefined;
    getOrCreateAcroForm(): PDFAcroForm;
    ViewerPreferences(): PDFDict | undefined;
    getViewerPreferences(): ViewerPreferences | undefined;
    getOrCreateViewerPreferences(): ViewerPreferences;
    /**
     * Inserts the given ref as a leaf node of this catalog's page tree at the
     * specified index (zero-based). Also increments the `Count` of each node in
     * the page tree hierarchy to accomodate the new page.
     *
     * Returns the ref of the PDFPageTree node into which `leafRef` was inserted.
     */
    insertLeafNode(leafRef: PDFRef, index: number): PDFRef;
    removeLeafNode(index: number): void;
}
export default PDFCatalog;
