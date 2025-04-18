import PDFContext from '@/core/PDFContext';
import PDFRef from '@/core/objects/PDFRef';
declare class JavaScriptEmbedder {
    static for(script: string, scriptName: string): JavaScriptEmbedder;
    private readonly script;
    readonly scriptName: string;
    private constructor();
    embedIntoContext(context: PDFContext, ref?: PDFRef): Promise<PDFRef>;
}
export default JavaScriptEmbedder;
