import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFArray from '@/core/objects/PDFArray';
import PDFName from '@/core/objects/PDFName';
import PDFAcroTerminal from '@/core/acroform/PDFAcroTerminal';
import { IndexOutOfBoundsError } from '@/core/errors';
class PDFAcroButton extends PDFAcroTerminal {
    Opt() {
        return this.dict.lookupMaybe(PDFName.of('Opt'), PDFString, PDFHexString, PDFArray);
    }
    setOpt(opt) {
        this.dict.set(PDFName.of('Opt'), this.dict.context.obj(opt));
    }
    getExportValues() {
        const opt = this.Opt();
        if (!opt)
            return undefined;
        if (opt instanceof PDFString || opt instanceof PDFHexString) {
            return [opt];
        }
        const values = [];
        for (let idx = 0, len = opt.size(); idx < len; idx++) {
            const value = opt.lookup(idx);
            if (value instanceof PDFString || value instanceof PDFHexString) {
                values.push(value);
            }
        }
        return values;
    }
    removeExportValue(idx) {
        const opt = this.Opt();
        if (!opt)
            return;
        if (opt instanceof PDFString || opt instanceof PDFHexString) {
            if (idx !== 0)
                throw new IndexOutOfBoundsError(idx, 0, 0);
            this.setOpt([]);
        }
        else {
            if (idx < 0 || idx > opt.size()) {
                throw new IndexOutOfBoundsError(idx, 0, opt.size());
            }
            opt.remove(idx);
        }
    }
    // Enforce use use of /Opt even if it isn't strictly necessary
    normalizeExportValues() {
        const exportValues = this.getExportValues() ?? [];
        const Opt = [];
        const widgets = this.getWidgets();
        for (let idx = 0, len = widgets.length; idx < len; idx++) {
            const widget = widgets[idx];
            const exportVal = exportValues[idx] ??
                PDFHexString.fromText(widget.getOnValue()?.decodeText() ?? '');
            Opt.push(exportVal);
        }
        this.setOpt(Opt);
    }
    /**
     * Reuses existing opt if one exists with the same value (assuming
     * `useExistingIdx` is `true`). Returns index of existing (or new) opt.
     */
    addOpt(opt, useExistingOptIdx) {
        this.normalizeExportValues();
        const optText = opt.decodeText();
        let existingIdx;
        if (useExistingOptIdx) {
            const exportValues = this.getExportValues() ?? [];
            for (let idx = 0, len = exportValues.length; idx < len; idx++) {
                const exportVal = exportValues[idx];
                if (exportVal.decodeText() === optText)
                    existingIdx = idx;
            }
        }
        const Opt = this.Opt();
        Opt.push(opt);
        return existingIdx ?? Opt.size() - 1;
    }
    addWidgetWithOpt(widget, opt, useExistingOptIdx) {
        const optIdx = this.addOpt(opt, useExistingOptIdx);
        const apStateValue = PDFName.of(String(optIdx));
        this.addWidget(widget);
        return apStateValue;
    }
}
export default PDFAcroButton;
