import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));

// Define a route to generate and download the multi-page PDF
const __dirname = path.resolve(path.dirname('')); 
app.get('/font', (req, res) => {
    // Replace 'font.ttf' with the path to your font file
    const fontPath = './fonts/Uni_Ila_Sundaram_06.ttf'; // font correction sathya to mohan - default :-arialB.ttf
    
    // Check if the font file exists
    if (!fs.existsSync(fontPath)) {
        return res.status(404).json({ error: 'Font file not found' });
    }
    
    // Read the font file and send it in the response
    const fontStream = fs.createReadStream(fontPath);
    fontStream.pipe(res);
});

app.get('/pdfWhite', (req, res) => {
    // Replace 'example.pdf' with the path to your PDF file4
    const pdfPath = 'landscape.pdf';
  
    // Read the PDF file asynchronously
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error('Error reading PDF:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Set the response headers
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="example.pdf"');
  
      // Send the PDF data as a buffer in the response
      res.send(data);
    });
  });
app.get('/pdfrose', (req, res) => {
    // Replace 'example.pdf' with the path to your PDF file
    const pdfPath = 'rosepdf.pdf';
  
    // Read the PDF file asynchronously
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error('Error reading PDF:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Set the response headers
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="example.pdf"');
  
      // Send the PDF data as a buffer in the response
      res.send(data);
    });
  });
app.get('/pdfgreen', (req, res) => {
    // Replace 'example.pdf' with the path to your PDF file
    const pdfPath = 'greenpdf.pdf';
  
    // Read the PDF file asynchronously
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error('Error reading PDF:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Set the response headers
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="example.pdf"');
  
      // Send the PDF data as a buffer in the response
      res.send(data);
    });
  });
app.get('/pdfport', (req, res) => {
    // Replace 'example.pdf' with the path to your PDF file
    const pdfPath = 'portrait.pdf';
  
    // Read the PDF file asynchronously
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error('Error reading PDF:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Set the response headers
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', 'attachment; filename="example.pdf"');
  
      // Send the PDF data as a buffer in the response
      res.send(data);
    });
  });


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
