import PDFHexString from '@/core/objects/PDFHexString';
class JavaScriptEmbedder {
    static for(script, scriptName) {
        return new JavaScriptEmbedder(script, scriptName);
    }
    constructor(script, scriptName) {
        Object.defineProperty(this, "script", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scriptName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.script = script;
        this.scriptName = scriptName;
    }
    async embedIntoContext(context, ref) {
        const jsActionDict = context.obj({
            Type: 'Action',
            S: 'JavaScript',
            JS: PDFHexString.fromText(this.script),
        });
        if (ref) {
            context.assign(ref, jsActionDict);
            return ref;
        }
        else {
            return context.register(jsActionDict);
        }
    }
}
export default JavaScriptEmbedder;
