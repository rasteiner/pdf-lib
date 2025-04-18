import PDFDict from '@/core/objects/PDFDict';
import PDFArray from '@/core/objects/PDFArray';
import PDFName from '@/core/objects/PDFName';
import PDFAcroNonTerminal from '@/core/acroform/PDFAcroNonTerminal';
import { createPDFAcroField, createPDFAcroFields, } from '@/core/acroform/utils';
class PDFAcroForm {
    constructor(dict) {
        Object.defineProperty(this, "dict", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dict = dict;
    }
    Fields() {
        const fields = this.dict.lookup(PDFName.of('Fields'));
        if (fields instanceof PDFArray)
            return fields;
        return undefined;
    }
    getFields() {
        const { Fields } = this.normalizedEntries();
        const fields = new Array(Fields.size());
        for (let idx = 0, len = Fields.size(); idx < len; idx++) {
            const ref = Fields.get(idx);
            const dict = Fields.lookup(idx, PDFDict);
            fields[idx] = [createPDFAcroField(dict, ref), ref];
        }
        return fields;
    }
    getAllFields() {
        const allFields = [];
        const pushFields = (fields) => {
            if (!fields)
                return;
            for (let idx = 0, len = fields.length; idx < len; idx++) {
                const field = fields[idx];
                allFields.push(field);
                const [fieldModel] = field;
                if (fieldModel instanceof PDFAcroNonTerminal) {
                    pushFields(createPDFAcroFields(fieldModel.Kids()));
                }
            }
        };
        pushFields(this.getFields());
        return allFields;
    }
    addField(field) {
        const { Fields } = this.normalizedEntries();
        Fields?.push(field);
    }
    removeField(field) {
        const parent = field.getParent();
        const fields = parent === undefined ? this.normalizedEntries().Fields : parent.Kids();
        const index = fields?.indexOf(field.ref);
        if (fields === undefined || index === undefined) {
            throw new Error(`Tried to remove inexistent field ${field.getFullyQualifiedName()}`);
        }
        fields.remove(index);
        if (parent !== undefined && fields.size() === 0) {
            this.removeField(parent);
        }
    }
    normalizedEntries() {
        let Fields = this.Fields();
        if (!Fields) {
            Fields = this.dict.context.obj([]);
            this.dict.set(PDFName.of('Fields'), Fields);
        }
        return { Fields };
    }
}
Object.defineProperty(PDFAcroForm, "fromDict", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (dict) => new PDFAcroForm(dict)
});
Object.defineProperty(PDFAcroForm, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (context) => {
        const dict = context.obj({ Fields: [] });
        return new PDFAcroForm(dict);
    }
});
export default PDFAcroForm;
