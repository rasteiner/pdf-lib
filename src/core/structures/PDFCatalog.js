import PDFDict from '@/core/objects/PDFDict';
import PDFName from '@/core/objects/PDFName';
import { PDFAcroForm } from '@/core/acroform';
import ViewerPreferences from '../interactive/ViewerPreferences';
class PDFCatalog extends PDFDict {
    Pages() {
        return this.lookup(PDFName.of('Pages'), PDFDict);
    }
    AcroForm() {
        return this.lookupMaybe(PDFName.of('AcroForm'), PDFDict);
    }
    getAcroForm() {
        const dict = this.AcroForm();
        if (!dict)
            return undefined;
        return PDFAcroForm.fromDict(dict);
    }
    getOrCreateAcroForm() {
        let acroForm = this.getAcroForm();
        if (!acroForm) {
            acroForm = PDFAcroForm.create(this.context);
            const acroFormRef = this.context.register(acroForm.dict);
            this.set(PDFName.of('AcroForm'), acroFormRef);
        }
        return acroForm;
    }
    ViewerPreferences() {
        return this.lookupMaybe(PDFName.of('ViewerPreferences'), PDFDict);
    }
    getViewerPreferences() {
        const dict = this.ViewerPreferences();
        if (!dict)
            return undefined;
        return ViewerPreferences.fromDict(dict);
    }
    getOrCreateViewerPreferences() {
        let viewerPrefs = this.getViewerPreferences();
        if (!viewerPrefs) {
            viewerPrefs = ViewerPreferences.create(this.context);
            const viewerPrefsRef = this.context.register(viewerPrefs.dict);
            this.set(PDFName.of('ViewerPreferences'), viewerPrefsRef);
        }
        return viewerPrefs;
    }
    /**
     * Inserts the given ref as a leaf node of this catalog's page tree at the
     * specified index (zero-based). Also increments the `Count` of each node in
     * the page tree hierarchy to accomodate the new page.
     *
     * Returns the ref of the PDFPageTree node into which `leafRef` was inserted.
     */
    insertLeafNode(leafRef, index) {
        const pagesRef = this.get(PDFName.of('Pages'));
        const maybeParentRef = this.Pages().insertLeafNode(leafRef, index);
        return maybeParentRef || pagesRef;
    }
    removeLeafNode(index) {
        this.Pages().removeLeafNode(index);
    }
}
Object.defineProperty(PDFCatalog, "withContextAndPages", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context, pages) => {
        const dict = new Map();
        dict.set(PDFName.of('Type'), PDFName.of('Catalog'));
        dict.set(PDFName.of('Pages'), pages);
        return new PDFCatalog(dict, context);
    }
});
Object.defineProperty(PDFCatalog, "fromMapWithContext", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (map, context) => new PDFCatalog(map, context)
});
export default PDFCatalog;
