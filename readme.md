Fork of https://github.com/Hopding/pdf-lib

Includes updates to the build process. 

## Features
 - PDFDocument.drawText() returns the number of lines that are drawn after word wrapping. 
    Use it for text flow:
    ```javascript
    let startY = 250;

    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const textWidth = 100;
    const lineHeight = 20;
    startY -= lineHeight * pdfDoc.drawText(text, {
      x: 50,
      y: startY,
      size: 16,
      width: textWidth,
      lineHeight,
    });

    const text2 = 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    startY -= lineHeight * pdfDoc.drawText(text2, {
      x: 50,
      y: startY,
      size: 12,
      width: textWidth,
      lineHeight,
    });
    ```
    

## Compile 
```bash
bun install 
bun run build 
bun run build:types
```

