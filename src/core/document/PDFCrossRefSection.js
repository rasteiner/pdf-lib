import PDFRef from '@/core/objects/PDFRef';
import CharCodes from '@/core/syntax/CharCodes';
import { copyStringIntoBuffer, padStart } from '@/utils';
/**
 * Entries should be added using the [[addEntry]] and [[addDeletedEntry]]
 * methods **in order of ascending object number**.
 */
class PDFCrossRefSection {
    constructor(firstEntry) {
        Object.defineProperty(this, "subsections", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkIdx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.subsections = firstEntry ? [[firstEntry]] : [];
        this.chunkIdx = 0;
        this.chunkLength = firstEntry ? 1 : 0;
    }
    addEntry(ref, offset) {
        this.append({ ref, offset, deleted: false });
    }
    addDeletedEntry(ref, nextFreeObjectNumber) {
        this.append({ ref, offset: nextFreeObjectNumber, deleted: true });
    }
    toString() {
        let section = `xref\n`;
        for (let rangeIdx = 0, rangeLen = this.subsections.length; rangeIdx < rangeLen; rangeIdx++) {
            const range = this.subsections[rangeIdx];
            section += `${range[0].ref.objectNumber} ${range.length}\n`;
            for (let entryIdx = 0, entryLen = range.length; entryIdx < entryLen; entryIdx++) {
                const entry = range[entryIdx];
                section += padStart(String(entry.offset), 10, '0');
                section += ' ';
                section += padStart(String(entry.ref.generationNumber), 5, '0');
                section += ' ';
                section += entry.deleted ? 'f' : 'n';
                section += ' \n';
            }
        }
        return section;
    }
    sizeInBytes() {
        let size = 5;
        for (let idx = 0, len = this.subsections.length; idx < len; idx++) {
            const subsection = this.subsections[idx];
            const subsectionLength = subsection.length;
            const [firstEntry] = subsection;
            size += 2;
            size += String(firstEntry.ref.objectNumber).length;
            size += String(subsectionLength).length;
            size += 20 * subsectionLength;
        }
        return size;
    }
    copyBytesInto(buffer, offset) {
        const initialOffset = offset;
        buffer[offset++] = CharCodes.x;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.f;
        buffer[offset++] = CharCodes.Newline;
        offset += this.copySubsectionsIntoBuffer(this.subsections, buffer, offset);
        return offset - initialOffset;
    }
    copySubsectionsIntoBuffer(subsections, buffer, offset) {
        const initialOffset = offset;
        const length = subsections.length;
        for (let idx = 0; idx < length; idx++) {
            const subsection = this.subsections[idx];
            const firstObjectNumber = String(subsection[0].ref.objectNumber);
            offset += copyStringIntoBuffer(firstObjectNumber, buffer, offset);
            buffer[offset++] = CharCodes.Space;
            const rangeLength = String(subsection.length);
            offset += copyStringIntoBuffer(rangeLength, buffer, offset);
            buffer[offset++] = CharCodes.Newline;
            offset += this.copyEntriesIntoBuffer(subsection, buffer, offset);
        }
        return offset - initialOffset;
    }
    copyEntriesIntoBuffer(entries, buffer, offset) {
        const length = entries.length;
        for (let idx = 0; idx < length; idx++) {
            const entry = entries[idx];
            const entryOffset = padStart(String(entry.offset), 10, '0');
            offset += copyStringIntoBuffer(entryOffset, buffer, offset);
            buffer[offset++] = CharCodes.Space;
            const entryGen = padStart(String(entry.ref.generationNumber), 5, '0');
            offset += copyStringIntoBuffer(entryGen, buffer, offset);
            buffer[offset++] = CharCodes.Space;
            buffer[offset++] = entry.deleted ? CharCodes.f : CharCodes.n;
            buffer[offset++] = CharCodes.Space;
            buffer[offset++] = CharCodes.Newline;
        }
        return 20 * length;
    }
    append(currEntry) {
        if (this.chunkLength === 0) {
            this.subsections.push([currEntry]);
            this.chunkIdx = 0;
            this.chunkLength = 1;
            return;
        }
        const chunk = this.subsections[this.chunkIdx];
        const prevEntry = chunk[this.chunkLength - 1];
        if (currEntry.ref.objectNumber - prevEntry.ref.objectNumber > 1) {
            this.subsections.push([currEntry]);
            this.chunkIdx += 1;
            this.chunkLength = 1;
        }
        else {
            chunk.push(currEntry);
            this.chunkLength += 1;
        }
    }
}
Object.defineProperty(PDFCrossRefSection, "create", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => new PDFCrossRefSection({
        ref: PDFRef.of(0, 65535),
        offset: 0,
        deleted: true,
    })
});
Object.defineProperty(PDFCrossRefSection, "createEmpty", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => new PDFCrossRefSection()
});
export default PDFCrossRefSection;
