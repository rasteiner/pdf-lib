import { PDFOperator, PDFWidgetAnnotation } from '@/core';
import PDFFont from '@/api/PDFFont';
import PDFButton from '@/api/form/PDFButton';
import PDFCheckBox from '@/api/form/PDFCheckBox';
import PDFDropdown from '@/api/form/PDFDropdown';
import PDFField from '@/api/form/PDFField';
import PDFOptionList from '@/api/form/PDFOptionList';
import PDFRadioGroup from '@/api/form/PDFRadioGroup';
import PDFSignature from '@/api/form/PDFSignature';
import PDFTextField from '@/api/form/PDFTextField';
/*********************** Appearance Provider Types ****************************/
type CheckBoxAppearanceProvider = (checkBox: PDFCheckBox, widget: PDFWidgetAnnotation) => AppearanceOrMapping<{
    on: PDFOperator[];
    off: PDFOperator[];
}>;
type RadioGroupAppearanceProvider = (radioGroup: PDFRadioGroup, widget: PDFWidgetAnnotation) => AppearanceOrMapping<{
    on: PDFOperator[];
    off: PDFOperator[];
}>;
type ButtonAppearanceProvider = (button: PDFButton, widget: PDFWidgetAnnotation, font: PDFFont) => AppearanceOrMapping<PDFOperator[]>;
type DropdownAppearanceProvider = (dropdown: PDFDropdown, widget: PDFWidgetAnnotation, font: PDFFont) => AppearanceOrMapping<PDFOperator[]>;
type OptionListAppearanceProvider = (optionList: PDFOptionList, widget: PDFWidgetAnnotation, font: PDFFont) => AppearanceOrMapping<PDFOperator[]>;
type TextFieldAppearanceProvider = (textField: PDFTextField, widget: PDFWidgetAnnotation, font: PDFFont) => AppearanceOrMapping<PDFOperator[]>;
type SignatureAppearanceProvider = (signature: PDFSignature, widget: PDFWidgetAnnotation, font: PDFFont) => AppearanceOrMapping<PDFOperator[]>;
/******************* Appearance Provider Utility Types ************************/
export type AppearanceMapping<T> = {
    normal: T;
    rollover?: T;
    down?: T;
};
type AppearanceOrMapping<T> = T | AppearanceMapping<T>;
export type AppearanceProviderFor<T extends PDFField> = T extends PDFCheckBox ? CheckBoxAppearanceProvider : T extends PDFRadioGroup ? RadioGroupAppearanceProvider : T extends PDFButton ? ButtonAppearanceProvider : T extends PDFDropdown ? DropdownAppearanceProvider : T extends PDFOptionList ? OptionListAppearanceProvider : T extends PDFTextField ? TextFieldAppearanceProvider : T extends PDFSignature ? SignatureAppearanceProvider : never;
/********************* Appearance Provider Functions **************************/
export declare const normalizeAppearance: <T extends object>(appearance: T | AppearanceMapping<T>) => AppearanceMapping<T>;
export declare const defaultCheckBoxAppearanceProvider: AppearanceProviderFor<PDFCheckBox>;
export declare const defaultRadioGroupAppearanceProvider: AppearanceProviderFor<PDFRadioGroup>;
export declare const defaultButtonAppearanceProvider: AppearanceProviderFor<PDFButton>;
export declare const defaultTextFieldAppearanceProvider: AppearanceProviderFor<PDFTextField>;
export declare const defaultDropdownAppearanceProvider: AppearanceProviderFor<PDFDropdown>;
export declare const defaultOptionListAppearanceProvider: AppearanceProviderFor<PDFOptionList>;
export {};
