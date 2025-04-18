import PDFArray from '@/core/objects/PDFArray';
import PDFBool from '@/core/objects/PDFBool';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import { assertEachIs, assertInteger, assertIsOneOf, assertRange, } from '@/utils';
const asEnum = (rawValue, enumType) => {
    if (rawValue === undefined)
        return undefined;
    return enumType[rawValue];
};
export var NonFullScreenPageMode;
(function (NonFullScreenPageMode) {
    /**
     * After exiting FullScreen mode, neither the document outline nor thumbnail
     * images should be visible.
     */
    NonFullScreenPageMode["UseNone"] = "UseNone";
    /** After exiting FullScreen mode, the document outline should be visible. */
    NonFullScreenPageMode["UseOutlines"] = "UseOutlines";
    /** After exiting FullScreen mode, thumbnail images should be visible. */
    NonFullScreenPageMode["UseThumbs"] = "UseThumbs";
    /**
     * After exiting FullScreen mode, the optional content group panel should be
     * visible.
     */
    NonFullScreenPageMode["UseOC"] = "UseOC";
})(NonFullScreenPageMode || (NonFullScreenPageMode = {}));
export var ReadingDirection;
(function (ReadingDirection) {
    /** The predominant reading order is Left to Right. */
    ReadingDirection["L2R"] = "L2R";
    /**
     * The predominant reading order is Right to left (including vertical writing
     * systems, such as Chinese, Japanese and Korean).
     */
    ReadingDirection["R2L"] = "R2L";
})(ReadingDirection || (ReadingDirection = {}));
export var PrintScaling;
(function (PrintScaling) {
    /** No page scaling. */
    PrintScaling["None"] = "None";
    /* Use the PDF reader's default print scaling. */
    PrintScaling["AppDefault"] = "AppDefault";
})(PrintScaling || (PrintScaling = {}));
export var Duplex;
(function (Duplex) {
    /** The PDF reader should print single-sided. */
    Duplex["Simplex"] = "Simplex";
    /**
     * The PDF reader should print double sided and flip on the short edge of the
     * sheet.
     */
    Duplex["DuplexFlipShortEdge"] = "DuplexFlipShortEdge";
    /**
     * The PDF reader should print double sided and flip on the long edge of the
     * sheet.
     */
    Duplex["DuplexFlipLongEdge"] = "DuplexFlipLongEdge";
})(Duplex || (Duplex = {}));
class ViewerPreferences {
    /** @ignore */
    constructor(dict) {
        /** @ignore */
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    lookupBool(key) {
        const returnObj = this.dict.lookup(PDFName.of(key));
        if (returnObj instanceof PDFBool)
            return returnObj;
        return undefined;
    }
    lookupName(key) {
        const returnObj = this.dict.lookup(PDFName.of(key));
        if (returnObj instanceof PDFName)
            return returnObj;
        return undefined;
    }
    /** @ignore */
    HideToolbar() {
        return this.lookupBool('HideToolbar');
    }
    /** @ignore */
    HideMenubar() {
        return this.lookupBool('HideMenubar');
    }
    /** @ignore */
    HideWindowUI() {
        return this.lookupBool('HideWindowUI');
    }
    /** @ignore */
    FitWindow() {
        return this.lookupBool('FitWindow');
    }
    /** @ignore */
    CenterWindow() {
        return this.lookupBool('CenterWindow');
    }
    /** @ignore */
    DisplayDocTitle() {
        return this.lookupBool('DisplayDocTitle');
    }
    /** @ignore */
    NonFullScreenPageMode() {
        return this.lookupName('NonFullScreenPageMode');
    }
    /** @ignore */
    Direction() {
        return this.lookupName('Direction');
    }
    /** @ignore */
    PrintScaling() {
        return this.lookupName('PrintScaling');
    }
    /** @ignore */
    Duplex() {
        return this.lookupName('Duplex');
    }
    /** @ignore */
    PickTrayByPDFSize() {
        return this.lookupBool('PickTrayByPDFSize');
    }
    /** @ignore */
    PrintPageRange() {
        const PrintPageRange = this.dict.lookup(PDFName.of('PrintPageRange'));
        if (PrintPageRange instanceof PDFArray)
            return PrintPageRange;
        return undefined;
    }
    /** @ignore */
    NumCopies() {
        const NumCopies = this.dict.lookup(PDFName.of('NumCopies'));
        if (NumCopies instanceof PDFNumber)
            return NumCopies;
        return undefined;
    }
    /**
     * Returns `true` if PDF readers should hide the toolbar menus when displaying
     * this document.
     * @returns Whether or not toolbars should be hidden.
     */
    getHideToolbar() {
        return this.HideToolbar()?.asBoolean() ?? false;
    }
    /**
     * Returns `true` if PDF readers should hide the menu bar when displaying this
     * document.
     * @returns Whether or not the menu bar should be hidden.
     */
    getHideMenubar() {
        return this.HideMenubar()?.asBoolean() ?? false;
    }
    /**
     * Returns `true` if PDF readers should hide the user interface elements in
     * the document's window (such as scroll bars and navigation controls),
     * leaving only the document's contents displayed.
     * @returns Whether or not user interface elements should be hidden.
     */
    getHideWindowUI() {
        return this.HideWindowUI()?.asBoolean() ?? false;
    }
    /**
     * Returns `true` if PDF readers should resize the document's window to fit
     * the size of the first displayed page.
     * @returns Whether or not the window should be resized to fit.
     */
    getFitWindow() {
        return this.FitWindow()?.asBoolean() ?? false;
    }
    /**
     * Returns `true` if PDF readers should position the document's window in the
     * center of the screen.
     * @returns Whether or not to center the document window.
     */
    getCenterWindow() {
        return this.CenterWindow()?.asBoolean() ?? false;
    }
    /**
     * Returns `true` if the window's title bar should display the document
     * `Title`, taken from the document metadata (see [[PDFDocument.getTitle]]).
     * Returns `false` if the title bar should instead display the filename of the
     * PDF file.
     * @returns Whether to display the document title.
     */
    getDisplayDocTitle() {
        return this.DisplayDocTitle()?.asBoolean() ?? false;
    }
    /**
     * Returns the page mode, which tells the PDF reader how to display the
     * document after exiting full-screen mode.
     * @returns The page mode after exiting full-screen mode.
     */
    getNonFullScreenPageMode() {
        const mode = this.NonFullScreenPageMode()?.decodeText();
        return asEnum(mode, NonFullScreenPageMode) ?? NonFullScreenPageMode.UseNone;
    }
    /**
     * Returns the predominant reading order for text.
     * @returns The text reading order.
     */
    getReadingDirection() {
        const direction = this.Direction()?.decodeText();
        return asEnum(direction, ReadingDirection) ?? ReadingDirection.L2R;
    }
    /**
     * Returns the page scaling option that the PDF reader should select when the
     * print dialog is displayed.
     * @returns The page scaling option.
     */
    getPrintScaling() {
        const scaling = this.PrintScaling()?.decodeText();
        return asEnum(scaling, PrintScaling) ?? PrintScaling.AppDefault;
    }
    /**
     * Returns the paper handling option that should be used when printing the
     * file from the print dialog.
     * @returns The paper handling option.
     */
    getDuplex() {
        const duplex = this.Duplex()?.decodeText();
        return asEnum(duplex, Duplex);
    }
    /**
     * Returns `true` if the PDF page size should be used to select the input
     * paper tray.
     * @returns Whether or not the PDF page size should be used to select the
     *          input paper tray.
     */
    getPickTrayByPDFSize() {
        return this.PickTrayByPDFSize()?.asBoolean();
    }
    /**
     * Returns an array of page number ranges, which are the values used to
     * initialize the print dialog box when the file is printed. Each range
     * specifies the first (`start`) and last (`end`) pages in a sub-range of
     * pages to be printed. The first page of the PDF file is denoted by 0.
     * For example:
     * ```js
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * const includesPage3 = viewerPrefs
     *   .getPrintRanges()
     *   .some(pr => pr.start =< 2 && pr.end >= 2)
     * if (includesPage3) console.log('printRange includes page 3')
     * ```
     * @returns An array of objects, each with the properties `start` and `end`,
     *          denoting page indices. If not, specified an empty array is
     *          returned.
     */
    getPrintPageRange() {
        const rng = this.PrintPageRange();
        if (!rng)
            return [];
        const pageRanges = [];
        for (let i = 0; i < rng.size(); i += 2) {
            // Despite the spec clearly stating that "The first page of the PDF file
            // shall be donoted by 1", several test PDFs (spec 1.7) created in
            // Acrobat XI 11.0 and also read with Reader DC 2020.013 indicate this is
            // actually a 0 based index.
            const start = rng.lookup(i, PDFNumber).asNumber();
            const end = rng.lookup(i + 1, PDFNumber).asNumber();
            pageRanges.push({ start, end });
        }
        return pageRanges;
    }
    /**
     * Returns the number of copies to be printed when the print dialog is opened
     * for this document.
     * @returns The default number of copies to be printed.
     */
    getNumCopies() {
        return this.NumCopies()?.asNumber() ?? 1;
    }
    /**
     * Choose whether the PDF reader's toolbars should be hidden while the
     * document is active.
     * @param hideToolbar `true` if the toolbar should be hidden.
     */
    setHideToolbar(hideToolbar) {
        const HideToolbar = this.dict.context.obj(hideToolbar);
        this.dict.set(PDFName.of('HideToolbar'), HideToolbar);
    }
    /**
     * Choose whether the PDF reader's menu bar should be hidden while the
     * document is active.
     * @param hideMenubar `true` if the menu bar should be hidden.
     */
    setHideMenubar(hideMenubar) {
        const HideMenubar = this.dict.context.obj(hideMenubar);
        this.dict.set(PDFName.of('HideMenubar'), HideMenubar);
    }
    /**
     * Choose whether the PDF reader should hide user interface elements in the
     * document's window (such as scroll bars and navigation controls), leaving
     * only the document's contents displayed.
     * @param hideWindowUI `true` if the user interface elements should be hidden.
     */
    setHideWindowUI(hideWindowUI) {
        const HideWindowUI = this.dict.context.obj(hideWindowUI);
        this.dict.set(PDFName.of('HideWindowUI'), HideWindowUI);
    }
    /**
     * Choose whether the PDF reader should resize the document's window to fit
     * the size of the first displayed page.
     * @param fitWindow `true` if the window should be resized.
     */
    setFitWindow(fitWindow) {
        const FitWindow = this.dict.context.obj(fitWindow);
        this.dict.set(PDFName.of('FitWindow'), FitWindow);
    }
    /**
     * Choose whether the PDF reader should position the document's window in the
     * center of the screen.
     * @param centerWindow `true` if the window should be centered.
     */
    setCenterWindow(centerWindow) {
        const CenterWindow = this.dict.context.obj(centerWindow);
        this.dict.set(PDFName.of('CenterWindow'), CenterWindow);
    }
    /**
     * Choose whether the window's title bar should display the document `Title`
     * taken from the document metadata (see [[PDFDocument.setTitle]]). If
     * `false`, the title bar should instead display the PDF filename.
     * @param displayTitle `true` if the document title should be displayed.
     */
    setDisplayDocTitle(displayTitle) {
        const DisplayDocTitle = this.dict.context.obj(displayTitle);
        this.dict.set(PDFName.of('DisplayDocTitle'), DisplayDocTitle);
    }
    /**
     * Choose how the PDF reader should display the document upon exiting
     * full-screen mode. This entry is meaningful only if the value of the
     * `PageMode` entry in the document's [[PDFCatalog]] is `FullScreen`.
     *
     * For example:
     * ```js
     * import { PDFDocument, NonFullScreenPageMode, PDFName } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     *
     * // Set the PageMode
     * pdfDoc.catalog.set(PDFName.of('PageMode'),PDFName.of('FullScreen'))
     *
     * // Set what happens when full-screen is closed
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setNonFullScreenPageMode(NonFullScreenPageMode.UseOutlines)
     * ```
     *
     * @param nonFullScreenPageMode How the document should be displayed upon
     *                              exiting full screen mode.
     */
    setNonFullScreenPageMode(nonFullScreenPageMode) {
        assertIsOneOf(nonFullScreenPageMode, 'nonFullScreenPageMode', NonFullScreenPageMode);
        const mode = PDFName.of(nonFullScreenPageMode);
        this.dict.set(PDFName.of('NonFullScreenPageMode'), mode);
    }
    /**
     * Choose the predominant reading order for text.
     *
     * This entry has no direct effect on the document's contents or page
     * numbering, but may be used to determine the relative positioning of pages
     * when displayed side by side or printed n-up.
     *
     * For example:
     * ```js
     * import { PDFDocument, ReadingDirection } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setReadingDirection(ReadingDirection.R2L)
     * ```
     *
     * @param readingDirection The reading order for text.
     */
    setReadingDirection(readingDirection) {
        assertIsOneOf(readingDirection, 'readingDirection', ReadingDirection);
        const direction = PDFName.of(readingDirection);
        this.dict.set(PDFName.of('Direction'), direction);
    }
    /**
     * Choose the page scaling option that should be selected when a print dialog
     * is displayed for this document.
     *
     * For example:
     * ```js
     * import { PDFDocument, PrintScaling } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setPrintScaling(PrintScaling.None)
     * ```
     *
     * @param printScaling The print scaling option.
     */
    setPrintScaling(printScaling) {
        assertIsOneOf(printScaling, 'printScaling', PrintScaling);
        const scaling = PDFName.of(printScaling);
        this.dict.set(PDFName.of('PrintScaling'), scaling);
    }
    /**
     * Choose the paper handling option that should be selected by default in the
     * print dialog.
     *
     * For example:
     * ```js
     * import { PDFDocument, Duplex } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     * viewerPrefs.setDuplex(Duplex.DuplexFlipShortEdge)
     * ```
     *
     * @param duplex The double or single sided printing option.
     */
    setDuplex(duplex) {
        assertIsOneOf(duplex, 'duplex', Duplex);
        const dup = PDFName.of(duplex);
        this.dict.set(PDFName.of('Duplex'), dup);
    }
    /**
     * Choose whether the PDF document's page size should be used to select the
     * input paper tray when printing. This setting influences only the preset
     * values used to populate the print dialog presented by a PDF reader.
     *
     * If PickTrayByPDFSize is true, the check box in the print dialog associated
     * with input paper tray should be checked. This setting has no effect on
     * operating systems that do not provide the ability to pick the input tray
     * by size.
     *
     * @param pickTrayByPDFSize `true` if the document's page size should be used
     *                          to select the input paper tray.
     */
    setPickTrayByPDFSize(pickTrayByPDFSize) {
        const PickTrayByPDFSize = this.dict.context.obj(pickTrayByPDFSize);
        this.dict.set(PDFName.of('PickTrayByPDFSize'), PickTrayByPDFSize);
    }
    /**
     * Choose the page numbers used to initialize the print dialog box when the
     * file is printed. The first page of the PDF file is denoted by 0.
     *
     * For example:
     * ```js
     * import { PDFDocument } from 'pdf-lib'
     *
     * const pdfDoc = await PDFDocument.create()
     * const viewerPrefs = pdfDoc.catalog.getOrCreateViewerPreferences()
     *
     * // We can set the default print range to only the first page
     * viewerPrefs.setPrintPageRange({ start: 0, end: 0 })
     *
     * // Or we can supply noncontiguous ranges (e.g. pages 1, 3, and 5-7)
     * viewerPrefs.setPrintPageRange([
     *   { start: 0, end: 0 },
     *   { start: 2, end: 2 },
     *   { start: 4, end: 6 },
     * ])
     * ```
     *
     * @param printPageRange An object or array of objects, each with the
     *                       properties `start` and `end`, denoting a range of
     *                       page indices.
     */
    setPrintPageRange(printPageRange) {
        if (!Array.isArray(printPageRange))
            printPageRange = [printPageRange];
        const flatRange = [];
        for (let idx = 0, len = printPageRange.length; idx < len; idx++) {
            flatRange.push(printPageRange[idx].start);
            flatRange.push(printPageRange[idx].end);
        }
        assertEachIs(flatRange, 'printPageRange', ['number']);
        const pageRanges = this.dict.context.obj(flatRange);
        this.dict.set(PDFName.of('PrintPageRange'), pageRanges);
    }
    /**
     * Choose the default number of copies to be printed when the print dialog is
     * opened for this file.
     * @param numCopies The default number of copies.
     */
    setNumCopies(numCopies) {
        assertRange(numCopies, 'numCopies', 1, Number.MAX_VALUE);
        assertInteger(numCopies, 'numCopies');
        const NumCopies = this.dict.context.obj(numCopies);
        this.dict.set(PDFName.of('NumCopies'), NumCopies);
    }
}
/** @ignore */
Object.defineProperty(ViewerPreferences, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new ViewerPreferences(dict)
});
/** @ignore */
Object.defineProperty(ViewerPreferences, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({});
        return new ViewerPreferences(dict);
    }
});
export default ViewerPreferences;
