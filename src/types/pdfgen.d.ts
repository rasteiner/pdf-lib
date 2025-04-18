export type PDFGenMessage = {
    id: number;
    options: PDFGenOptions;
};
export type PDFGenOptions = {
    title: string;
    description: string;
    count: number;
    batchNr: string;
    extra1: string;
    extra2: string;
    extra3: string;
    extra4: string;
};
export type PDFGenResult = {
    id: number;
} & ({
    type: "complete";
    success: true;
    url: string;
} | {
    type: "complete";
    success: false;
    error: string;
} | {
    type: "progress";
    progress: number;
});
