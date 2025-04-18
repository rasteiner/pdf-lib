import PDFDict from '@/core/objects/PDFDict';
import PDFString from '@/core/objects/PDFString';
import PDFHexString from '@/core/objects/PDFHexString';
import PDFName from '@/core/objects/PDFName';
import PDFNumber from '@/core/objects/PDFNumber';
import PDFArray from '@/core/objects/PDFArray';
import PDFRef from '@/core/objects/PDFRef';
import { findLastMatch } from '@/utils';
import { MissingDAEntryError, MissingTfOperatorError } from '@/core/errors';
// Examples:
//   `/Helv 12 Tf` -> ['Helv', '12']
//   `/HeBo 8.00 Tf` -> ['HeBo', '8.00']
//   `/HeBo Tf` -> ['HeBo', undefined]
const tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+Tf/;
class PDFAcroField {
    constructor(dict, ref) {
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ref", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
        this.ref = ref;
    }
    T() {
        return this.dict.lookupMaybe(PDFName.of('T'), PDFString, PDFHexString);
    }
    Ff() {
        const numberOrRef = this.getInheritableAttribute(PDFName.of('Ff'));
        return this.dict.context.lookupMaybe(numberOrRef, PDFNumber);
    }
    V() {
        const valueOrRef = this.getInheritableAttribute(PDFName.of('V'));
        return this.dict.context.lookup(valueOrRef);
    }
    Kids() {
        return this.dict.lookupMaybe(PDFName.of('Kids'), PDFArray);
    }
    // Parent(): PDFDict | undefined {
    //   return this.dict.lookupMaybe(PDFName.of('Parent'), PDFDict);
    // }
    DA() {
        const da = this.dict.lookup(PDFName.of('DA'));
        if (da instanceof PDFString || da instanceof PDFHexString)
            return da;
        return undefined;
    }
    setKids(kids) {
        this.dict.set(PDFName.of('Kids'), this.dict.context.obj(kids));
    }
    getParent() {
        // const parent = this.Parent();
        // if (!parent) return undefined;
        // return new PDFAcroField(parent);
        const parentRef = this.dict.get(PDFName.of('Parent'));
        if (parentRef instanceof PDFRef) {
            const parent = this.dict.lookup(PDFName.of('Parent'), PDFDict);
            return new PDFAcroField(parent, parentRef);
        }
        return undefined;
    }
    setParent(parent) {
        if (!parent)
            this.dict.delete(PDFName.of('Parent'));
        else
            this.dict.set(PDFName.of('Parent'), parent);
    }
    getFullyQualifiedName() {
        const parent = this.getParent();
        if (!parent)
            return this.getPartialName();
        return `${parent.getFullyQualifiedName()}.${this.getPartialName()}`;
    }
    getPartialName() {
        return this.T()?.decodeText();
    }
    setPartialName(partialName) {
        if (!partialName)
            this.dict.delete(PDFName.of('T'));
        else
            this.dict.set(PDFName.of('T'), PDFHexString.fromText(partialName));
    }
    setDefaultAppearance(appearance) {
        this.dict.set(PDFName.of('DA'), PDFString.of(appearance));
    }
    getDefaultAppearance() {
        const DA = this.DA();
        if (DA instanceof PDFHexString) {
            return DA.decodeText();
        }
        return DA?.asString();
    }
    setFontSize(fontSize) {
        const name = this.getFullyQualifiedName() ?? '';
        const da = this.getDefaultAppearance();
        if (!da)
            throw new MissingDAEntryError(name);
        const daMatch = findLastMatch(da, tfRegex);
        if (!daMatch.match)
            throw new MissingTfOperatorError(name);
        const daStart = da.slice(0, daMatch.pos - daMatch.match[0].length);
        const daEnd = daMatch.pos <= da.length ? da.slice(daMatch.pos) : '';
        const fontName = daMatch.match[1];
        const modifiedDa = `${daStart} /${fontName} ${fontSize} Tf ${daEnd}`;
        this.setDefaultAppearance(modifiedDa);
    }
    getFlags() {
        return this.Ff()?.asNumber() ?? 0;
    }
    setFlags(flags) {
        this.dict.set(PDFName.of('Ff'), PDFNumber.of(flags));
    }
    hasFlag(flag) {
        const flags = this.getFlags();
        return (flags & flag) !== 0;
    }
    setFlag(flag) {
        const flags = this.getFlags();
        this.setFlags(flags | flag);
    }
    clearFlag(flag) {
        const flags = this.getFlags();
        this.setFlags(flags & ~flag);
    }
    setFlagTo(flag, enable) {
        if (enable)
            this.setFlag(flag);
        else
            this.clearFlag(flag);
    }
    getInheritableAttribute(name) {
        let attribute;
        this.ascend((node) => {
            if (!attribute)
                attribute = node.dict.get(name);
        });
        return attribute;
    }
    ascend(visitor) {
        visitor(this);
        const parent = this.getParent();
        if (parent)
            parent.ascend(visitor);
    }
}
export default PDFAcroField;
