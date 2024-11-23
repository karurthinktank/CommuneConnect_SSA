import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
//import path from 'path';


// PDF Modification
const pdfData = await fs.readFile('./simple.pdf');
const pdfDoc = await PDFDocument.load(pdfData);
const pages = pdfDoc.getPages()
pages[0].drawText('You can modify PDFs too!')
const pdfBytes = await pdfDoc.save()
app.get('/font', (req, res) => {
    // Replace 'font.ttf' with the path to your font file
    const fontPath = 'path/to/your/font.ttf';
    
    // Check if the font file exists
    if (!fs.existsSync(fontPath)) {
        return res.status(404).json({ error: 'Font file not found' });
    }
    
    // Read the font file and send it in the response
    const fontStream = fs.createReadStream(fontPath);
    fontStream.pipe(res);
});