import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router';
import { IDCARD } from "helpers/url_helper";
import { GET } from "helpers/api_helper";
import { ToastContainer } from 'react-toastify';
import { Link } from "react-router-dom";
import CustomToast from "components/Common/Toast";
import Loader from "components/Common/Loader";
import horizontalfront from "../../assets/images/horizontal-front.jpg"
import horizontalback from "../../assets/images/horizontal-back.jpg"
import verticalfront from "../../assets/images/vertical-front.jpg"
import verticalback from "../../assets/images/vertical-back.jpg"
import profilepicture from "../../assets/images/id-photo-square.png";
import noprofile from '../../assets/images/noprofile.jpg';
import horizwhitfront from "../../assets/images/vertical-front-white.jpg"
import horizwhiteback from "../../assets/images/vertical-back-white.jpg.jpg"
import horizontalgreenfront from "../../assets/images/PageFront.jpg";
import horizontalgreenback from "../../assets/images/PageBack.jpg";
import { jsPDF } from "jspdf";
import "../../assets/scss/_idcard.scss";
import { date } from "yup";
import { Button, Card, Col, Container } from "reactstrap";
import Breadcrumb from "components/Common/Breadcrumb";
import { decode,encode } from 'base64-arraybuffer';
import ReactToPrint, { PrintContextConsumer, useReactToPrint } from 'react-to-print';
import { PDFDocument,rgb, StandardFonts  } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';
import { withTranslation,useTranslation } from "react-i18next";
import PropTypes from 'prop-types';
const arrName=['கருப்பண்ணன்']

function UseridCard() {
    const [data, setCardvalue] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const { id } = useParams();
    const horizontalFront = useRef(null);
    const horizontalBackside = useRef(null);
    const horizontalPlainFront = useRef(null);
    const horizontalPlainBackside = useRef(null);
    const [pdfBytes, setPdfBytes] = useState(null);
    const [pdfBytesPort, setPdfBytesPort] = useState(null);
    const [pdfBytesPortWhite, setPdfBytesPortWhite] = useState(null);
    const [pdfBytesWhite, setPdfBytesWhite] = useState(null);
    const base64Image = "data:image/png;base64,"
    const { t } = useTranslation();

    function splitTextIntoLines(text, maxWidth, fontSize,customFont) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = fontSize * customFont.widthOfTextAtSize(word, fontSize);

            if (width + customFont.widthOfTextAtSize(currentLine + ' ' + word, fontSize) > maxWidth) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += ' ' + word;
            }
        }

        lines.push(currentLine);
        return lines;
    }

const landscapepdfColor = (data) => {
    if(!data){
        return
    }
   
    async function createPdf() {
    const pdfBytes = await fetch('http://localhost:8080/pdfrose').then(res => res.arrayBuffer());
    //const flagPdfBytes = await fetch('http://localhost:8080/convert').then((res) => res.arrayBuffer());
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
   
    const fontSize = 7; // default font size is 7;
    pdfDoc.registerFontkit(fontkit);

    // Embed image into the PDF
    const fontBytes = await fetch('http://localhost:8080/font').then(res => res.arrayBuffer());
    

    // Embed the font into the PDF document
    const customFont = await pdfDoc.embedFont(fontBytes,{ subset: true,features: { liga: false }});
    //const [americanFlag] = await pdfDoc.embedPdf(flagPdfBytes);
   // americanFlag.width=200;
   // americanFlag.height=200;
    const page = pdfDoc.getPages();
    page[0].setFont(customFont);
    // Set the font for the page
    /*page[0].drawPage(americanFlag, {
        x: 10,
        y: 150,
      });*/
    if(data?.profile_image){
        const imageBytes = data?.profile_image || decode(data?.profile_image);
        try{
            const image = await pdfDoc.embedPng(imageBytes);
            page[0].drawImage(image, {
                x: 161.4, // X coordinate  // Default x: 161
                y: 35.4, // Y coordinate   // Default y: 35
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
                
              });
        }
       
          catch(err){
            const image = await pdfDoc.embedJpg(imageBytes);
            page[0].drawImage(image, {
                x: 161.4, // X coordinate
                y: 35.4, // Y coordinate
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
              });
          }
    }
   
    //const page = pdfDoc.addPage([243.13, 154]);
    page[0].setFont(customFont);
   
    //const textWidthName = customFont.widthOfTextAtSize(toConvertName, fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
//console.log('கிருஷ்ணராயபுரம்'.split(''))
//console.log('கருப்பண்ணன்'.split(''))

const toConvertName= (t(data.name).split('.'));
const textWidthName = customFont.widthOfTextAtSize(toConvertName[0], fontSize);
//const startXName = page[0].getWidth() - textWidthName - 20;
page[0].drawText(toConvertName[0]+'.', {
    x: 167, // X coordinate // Default : x: 167
    y: 23.7, // Y coordinate // Default : y: 23
    size: fontSize,
    font:customFont 
    // Adjust height as needed
  });
page[0].drawText(toConvertName[1], {
  x: 167+textWidthName, // X coordinate
  y: 23.7, // Y coordinate
  size: fontSize,
  font:customFont 
  // Adjust height as needed
});


  

    const toConvertedText=(data.member_id+''||'NA');
    //const textIdName = customFont.widthOfTextAtSize(toConvertedText, fontSize);
    //const startXId = page[0].getWidth() - textIdName - 20;
    page[0].drawText(toConvertedText, {
        x: 179, // X coordinate
        y: 12.6, // Y coordinate // Default : y: 11
        size: fontSize, 
        font:customFont,// Adjust height as needed
      });


    //const page2=pdfDoc.addPage([243.13, 154]);  
    page[1].setFont(customFont);  
    const tocFather='த/க பெ : '+(data?.father_or_husband ||'NA');

      console.log(t(tocFather).split(''));
      page[1].drawText(t(tocFather).split('').join('')+',', {
        x: 130, // X coordinate // x:135,
        y: 121, // Y coordinate
        size: fontSize,
        charSpace: 1, wordSpace: 0 // Adjust height as needed
      });
    
      const regex = /[\u200B-\u200D\uFEFF]/g;
    const tocAddress=(data?.current_address.replace(regex, ''));
   // debugger;
    const addresSplit= tocAddress.split(',');
    let y=111;
    for(let i=0;i<addresSplit.length;i++){
        const extra=addresSplit.length ===i+1?'':','
        page[1].drawText((addresSplit[i]+extra).trim(), {
            x: 130, // default : x:135,
            y,
            size: fontSize,
            color: rgb(0, 0, 0),
            charSpace: 1, wordSpace: 0 // black color
        });
        y=y-10
    }

    const tocPhone=((data?.mobile_number||'NA'));
    const tocPhoneText = customFont.widthOfTextAtSize(tocAddress, fontSize);
    const startxPon = page[1].getWidth() - tocPhoneText - 20;
      page[1].drawText(tocPhone, {
        x: 190, // X coordinate
        y: 67.6, // Y coordinate // Default : y: 66
        size: fontSize, // Adjust height as needed
      });

      const pdfBytes1 = await pdfDoc.save();
      const pdfBase64 = encode(pdfBytes1);
      setPdfBytes(pdfBase64);
      //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      //document.getElementById('pdf').src = pdfDataUri;
    }
    createPdf();
};
const landscapepdfWhite = (data) => {
    if(!data){
        return
    }
   
    async function createPdf() {
    const pdfBytes = await fetch('http://localhost:8080/pdfWhite').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
   
    const fontSize = 7;
    pdfDoc.registerFontkit(fontkit);

    // Embed image into the PDF
    const fontBytes = await fetch('http://localhost:8080/font').then(res => res.arrayBuffer());
    

    // Embed the font into the PDF document
    const customFont = await pdfDoc.embedFont(fontBytes,{ subset: true,features: { liga: false }});
    const page = pdfDoc.getPages();
    // Set the font for the page
    if(data?.profile_image){
        const imageBytes = data?.profile_image || decode(data?.profile_image);
        try{
            const image = await pdfDoc.embedPng(imageBytes);
        page[0].drawImage(image, {
            x: 161.4, // X coordinate
            y: 35.4, // Y coordinate
            width:42, // Adjust width as needed
            height: 42, // Adjust height as needed
          });

        }catch(err){
            const image = await pdfDoc.embedJpg(imageBytes);
            page[0].drawImage(image, {
                x: 161.4, // X coordinate
                y: 35.4, // Y coordinate
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
              });
    
        }
        
    }
   
    //const page = pdfDoc.addPage([243.13, 154]);
    page[0].setFont(customFont);
   
    const toConvertName= (t(data.name).split('.'));
const textWidthName = customFont.widthOfTextAtSize(toConvertName[0], fontSize);
//const startXName = page[0].getWidth() - textWidthName - 20;
page[0].drawText(toConvertName[0]+'.', {
    x: 167, // X coordinate
    y: 23.7, // Y coordinate
    size: fontSize,
    font:customFont 
    // Adjust height as needed
  });
    //const textWidthName = customFont.widthOfTextAtSize(toConvertName, fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
    page[0].drawText(toConvertName[1], {
      x: 167+textWidthName, // X coordinate
      y: 23.7, // Y coordinate
      size: fontSize, // Adjust height as needed
    });

    const toConvertedText=(data.member_id+''||'NA');
    //const textIdName = customFont.widthOfTextAtSize(toConvertedText, fontSize);
    //const startXId = page[0].getWidth() - textIdName - 20;
    page[0].drawText(toConvertedText, {
        x: 179, // X coordinate
        y: 12.6, // Y coordinate
        size: fontSize, // Adjust height as needed
      });

    //const page2=pdfDoc.addPage([243.13, 154]);  
    page[1].setFont(customFont);  
    const tocFather='த/க பெ : '+(data?.father_or_husband ||'NA');
      page[1].drawText(tocFather+',', {
        x: 130, // X coordinate
        y: 121, // Y coordinate
        size: fontSize, // Adjust height as needed
      });
   
    const tocAddress=(data?.current_address);
   // debugger;
    const addresSplit= tocAddress.split(',');
    let y=111;
    for(let i=0;i<addresSplit.length;i++){
        const extra=addresSplit.length ===i+1?'':','
        page[1].drawText((addresSplit[i]+extra).trim(), {
            x: 130,
            y,
            size: fontSize,
            color: rgb(0, 0, 0), // black color
        });
        y=y-10
    }

    const tocPhone=((data?.mobile_number||'NA'));
    const tocPhoneText = customFont.widthOfTextAtSize(tocAddress, fontSize);
    const startxPon = page[1].getWidth() - tocPhoneText - 20;
      page[1].drawText(tocPhone, {
        x: 190, // X coordinate
        y: 67.6, // Y coordinate
        size: fontSize, // Adjust height as needed
      });

      const pdfBytes1 = await pdfDoc.save();
      const pdfBase64 = encode(pdfBytes1);
      setPdfBytesWhite(pdfBase64);
      //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      //document.getElementById('pdf').src = pdfDataUri;
    }
    createPdf();
};
const portraitColor = (data) => {
    if(!data){
        return
    }
   
    async function createPdf() {
    const pdfBytes = await fetch('http://localhost:8080/pdfgreen').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
   
    const fontSize = 8;
    pdfDoc.registerFontkit(fontkit);

    // Embed image into the PDF
    const fontBytes = await fetch('http://localhost:8080/font').then(res => res.arrayBuffer());
    

    // Embed the font into the PDF document
    const customFont = await pdfDoc.embedFont(fontBytes,{ subset: true,features: { liga: false }});
    const page = pdfDoc.getPages();
    // Set the font for the page
    if(data?.profile_image){
        const imageBytes = data?.profile_image || decode(data?.profile_image);
        try{
            const image = await pdfDoc.embedPng(imageBytes);
            page[0].drawImage(image, {
                x: 48, // X coordinate --> x: 47.3,
                y: 29.7, // Y coordinate  --> y: 30,
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
              });
        }catch(err){
            const image = await pdfDoc.embedJpg(imageBytes);
            page[0].drawImage(image, {
                x: 48, // X coordinate
                y: 29.7, // Y coordinate
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
              });
        }
       
       
    }
   
    //const page = pdfDoc.addPage([243.13, 154]);
    page[0].setFont(customFont);
   
    const toConvertName= (t(data.name).split('.'));
    const textWidthName = customFont.widthOfTextAtSize(toConvertName[0], fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
    page[0].drawText(toConvertName[0]+'.', {
        x: 52.5, // X coordinate
        y: 16.8, // Y coordinate  // Default : y: 14,
        size: fontSize,
        font:customFont 
        // Adjust height as needed
      });
    //const textWidthName = customFont.widthOfTextAtSize(toConvertName, fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
    page[0].drawText(toConvertName[1], {
      x: 52.5+textWidthName, // X coordinate
      y: 16.8, // Y coordinate
      size: fontSize, 
      font:customFont // Adjust height as needed
    });

    const toConvertedText=(data.member_id+''||'NA');
    //const textIdName = customFont.widthOfTextAtSize(toConvertedText, fontSize);
    //const startXId = page[0].getWidth() - textIdName - 20;
    page[0].drawText(toConvertedText, {
        x: 62, // X coordinate
        y: 6.4, // Y coordinate
        size: fontSize, // Adjust height as needed
      });

    //const page2=pdfDoc.addPage([243.13, 154]);  
    page[1].setFont(customFont);  
    const tocFather='த/க பெ : '+(data?.father_or_husband ||'NA');
      page[1].drawText(tocFather+',', {
        x: 1, // X coordinate  --x: 4,
        y: 77.3, // Y coordinate  --y: 77, 
        size: fontSize, // Adjust height as needed
      });
   
    const tocAddress=(data?.current_address);
   // debugger;
    const addresSplit= tocAddress.split(',');
    let y=69.3; //default y=69;;
    for(let i=0;i<addresSplit.length;i++){
        const extra=addresSplit.length ===i+1?'':','
        page[1].drawText((addresSplit[i]+extra).trim(), {
            x: 1,  // default  x: 10,;
            y,
            size: fontSize,
            color: rgb(0, 0, 0), // black color
        });
        y=y-8 // default  y=y-7
    }

    const tocPhone=((data?.mobile_number||'NA'));
    const tocPhoneText = customFont.widthOfTextAtSize(tocAddress, fontSize);
    const startxPon = page[1].getWidth() - tocPhoneText - 20;
      page[1].drawText(tocPhone, {
        x: 65.5, // X coordinate
        y: 38, // Y coordinate // default y: 35,
        size: fontSize, // Adjust height as needed
      });

      const pdfBytes1 = await pdfDoc.save();
      const pdfBase64 = encode(pdfBytes1);
      setPdfBytesPort(pdfBase64);
      //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      //document.getElementById('pdf').src = pdfDataUri;
    }
    createPdf();
};
const portraitWhite = (data) => {
    if(!data){
        return
    }
   
    async function createPdf() {
    const pdfBytes = await fetch('http://localhost:8080/pdfport').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
   
    const fontSize = 8;  // font size correction on all of the same places sathya to mohan ; default font is 8;
    pdfDoc.registerFontkit(fontkit);

    // Embed image into the PDF
    const fontBytes = await fetch('http://localhost:8080/font').then(res => res.arrayBuffer());
    

    // Embed the font into the PDF document
    const customFont = await pdfDoc.embedFont(fontBytes,{ subset: true,features: { liga: false }});
    const page = pdfDoc.getPages();
    // Set the font for the page
    if(data?.profile_image){
        const imageBytes = data?.profile_image || decode(data?.profile_image);
        try{
            const image = await pdfDoc.embedPng(imageBytes);
            page[0].drawImage(image, {
            x: 48, // X coordinate
            y: 29.7, // Y coordinate
            width:42, // Adjust width as needed
            height: 42, // Adjust height as needed
          });
        }catch(err){
            const image = await pdfDoc.embedJpg(imageBytes);
            page[0].drawImage(image, {
                x: 48, // X coordinate
                y: 29.7, // Y coordinate
                width:42, // Adjust width as needed
                height: 42, // Adjust height as needed
              });
        }
    }
   
    //const page = pdfDoc.addPage([243.13, 154]);
    page[0].setFont(customFont);
   
    const toConvertName= (t(data.name).split('.'));
    const textWidthName = customFont.widthOfTextAtSize(toConvertName[0], fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
    page[0].drawText(toConvertName[0]+'.', {
        x: 52.5, // X coordinate
        y: 16.6, // Y coordinate
        size: fontSize,
        font:customFont 
        // Adjust height as needed
      });
    
    //const textWidthName = customFont.widthOfTextAtSize(toConvertName, fontSize);
    //const startXName = page[0].getWidth() - textWidthName - 20;
    page[0].drawText(toConvertName[1], {
      x: 52.5+textWidthName, // X coordinate
      y: 16.8, // Y coordinate
      size: fontSize, // Adjust height as needed
    });

    const toConvertedText=(data.member_id+''||'NA');
    //const textIdName = customFont.widthOfTextAtSize(toConvertedText, fontSize);
    //const startXId = page[0].getWidth() - textIdName - 20;
    page[0].drawText(toConvertedText, {
        x: 62, // X coordinate
        y: 6.4, // Y coordinate
        size: fontSize, // Adjust height as needed
      });

    //const page2=pdfDoc.addPage([243.13, 154]);  
    page[1].setFont(customFont);  
    const tocFather='த/க பெ : '+(data?.father_or_husband ||'NA');
      page[1].drawText(tocFather+',', {
        x: 1, // X coordinate
        y: 77.3, // Y coordinate
        size: fontSize, // Adjust height as needed
      });
   
    const tocAddress=(data?.current_address);
   // debugger;
    const addresSplit= tocAddress.split(',');
    let y=69.3;
    for(let i=0;i<addresSplit.length;i++){
        const extra=addresSplit.length ===i+1?'':','
        page[1].drawText((addresSplit[i]+extra).trim(), {
            x: 1,
            y,
            size: fontSize,
            color: rgb(0, 0, 0), // black color
        });
        y=y-8
    }

    const tocPhone=((data?.mobile_number||'NA'));
    const tocPhoneText = customFont.widthOfTextAtSize(tocAddress, fontSize);
    const startxPon = page[1].getWidth() - tocPhoneText - 20;
      page[1].drawText(tocPhone, {
        x: 65.5, // X coordinate
        y: 38, // Y coordinate
        size: fontSize, // Adjust height as needed
      });

      const pdfBytes1 = await pdfDoc.save();
      const pdfBase64 = encode(pdfBytes1);
      setPdfBytesPortWhite(pdfBase64);
      //const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
      //document.getElementById('pdf').src = pdfDataUri;
    }
    createPdf();
};

    useEffect(() => {
        const init=async()=>{
           const userData= await fetchUser();
             landscapepdfColor(userData);
             landscapepdfWhite(userData);
             portraitColor(userData)
             portraitWhite(userData)
        }
        init();
    }, [])
    const fetchUser = async () => {
        setShowLoader(true);
        let url = IDCARD.replace(":slug", id);
        const response = await GET(url);
        console.log(response)
        if (response.status === 200) {
            setCardvalue(response.data);
            setShowLoader(false);
            console.log(data);
            return response.data
        }
        else {
            CustomToast(response.data.message, "error")
            setShowLoader(false);
            return []
        }
    }
    return (
        <>
            {showLoader && <Loader />}
            {/* <div className="page-content">
                <div className="container-fluid">
                <Breadcrumb  title="டேஷ்போர்டு" parentPath="/home" currentPath="/users" breadcrumbItem="குடும்பங்கள்" />
                  
                  


                </div>
            </div> */}
            <div className="page-content">

                <Container fluid>
                    <div className="row">
                        <div className="col-md-12">

                        <Breadcrumb title="குடும்பங்கள்" parentPath="/users" currentPath="/idcard" breadcrumbItem="அடையாள அட்டை" />

                            <Card>
                            <div className="id-horizontal">
                                   <div className="p-3 head-member">
                                                {/* <Button className="btn-success align-items-center d-flex gap-2 p-1 justify-content-center" onClick={verticalDownloadImage}>
                                                    <span className="mdi mdi-download-circle fs-2"></span>Download
                                                </Button> */}
                                                <h4>ID Card Preview</h4>
                                            </div>
                                 <div className="row justify-content-center p-3">
                                    <div id="backdropImg"></div>
                                     <div className="col-md-8 col-sm-10 col-lg-7 mb-3">
                                    <div style={{display:'flex', alignItems:'center'}}>
                                     <Button className="btn-success  ms-auto d-flex mr-2 p-1  justify-content-center"  style={{marginBottom: "10px",marginRight:"10px"}}>
                                            {pdfBytes ? (
      <a
      href={`data:application/pdf;base64,${pdfBytes}`} style={{color:'#fff',display:'flex',alignItems:'center'}}
      download="image.pdf"
    >
           <span className="mdi mdi-printer fs-2"></span>
           <span style={{display:'inline-block',padding:'5px'}}>Color BG</span>
        </a>
      ): <> <span className="mdi mdi-printer fs-2"></span>Loading.</>}
                                                  
                                        </Button>
                                        <Button className="btn-success ml-1 align-items-center d-flex gap-1 p-1 justify-content-center"  style={{marginBottom: "10px"}}>
                                            {pdfBytesWhite ? (
      <a
      href={`data:application/pdf;base64,${pdfBytesWhite}`} style={{color:'#fff',display:'flex',alignItems:'center'}}
      download="image.pdf"
    >
           <span className="mdi mdi-printer fs-2"></span>
           <span style={{display:'inline-block',padding:'5px'}}>White BG</span>
        </a>
      ): <> <span className="mdi mdi-printer fs-2"></span>Loading.</>}
                                                  
                                        </Button>
                                        </div>
                                         <div id="frontside" className="id-cover" ref={horizontalFront}>
                                             <img src={horizontalgreenfront} className="horizontal-front-img"  />
                                             <div className="user-content" >
                                                 {/* <img src={profilepicture} className="id-photo" /> */}
                                                 {data?.profile_image ? (<img className="id-photo" src={base64Image + data?.profile_image} alt="User Avatar" />)
                                                     : <img className="id-photo" src={noprofile} alt="User Profie"/>}
                                                 <p className="id-name">{data?.name}</p>
                                                 <p className="id-reg-no">{data?.member_id}</p>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="col-md-8 col-sm-10 col-lg-7">
                                  
                                         <div id="backside" className="id-cover" ref={horizontalBackside}>
                                             <img src={horizontalgreenback} className="horizontal-back-img" />
                                             <div className="user-content">
                                                 <p className="id-address justify-content-center">
                                                     த/க பெ: {data?.father_or_husband} <br />
                                                     {data?.current_address}
                                                 </p>
                                                 <p className="id-phone-no">{data?.mobile_number}</p>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                   </div>
                        
                                    {/* <<-- White  image Start here -->> */}
                                    <div style={{display:'none'}} className="id-horizontal card mt-3">
                                       
                                       <div className="p-3 head-member d-flex gap-3">
                                           
                                       </div>
                                       <div>
                                       <div className="row justify-content-center p-3 " >
                                               <div className="col-md-8 col-sm-10 col-lg-7 mb-3" id="print-content">
                                               <Button className="btn-success  ms-auto align-items-center d-flex gap-2 p-1  justify-content-center" onClick={()=>{
                                           // downloadAllImage('plainFrontSide')
                                        }} style={{marginBottom: "10px"}}>
                                                   <span className="mdi mdi-printer fs-2"></span>Print Plain FrontSide
                                        </Button>
                                                   <div id="plainFrontSide" className="id-cover" ref={horizontalPlainFront}>
                                                       <img src={horizwhitfront} className="horizontal-front-img" />
                                                       <div className="user-content">
                                                           {/* <img src={profilepicture} className="id-photo" /> */}
                                                           {data?.profile_image ? (<img className="id-photo" src={base64Image + data?.profile_image} alt="User Avatar" />)
                                                               : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                                           <p className="id-name">{data?.name}</p>
                                                           <p className="id-reg-no">{data?.member_id}</p>
                                                       </div>
                                                   </div>
                                               </div>
                                               <div className="col-md-8 col-sm-10 col-lg-7">
                                               <Button className="btn-success  ms-auto align-items-center d-flex gap-2 p-1  justify-content-center"onClick={()=>{
                                            //downloadAllImage('plainBackSide')
                                        }}  style={{marginBottom: "10px"}}>
                                                   <span className="mdi mdi-printer fs-2"></span>Print Plain BackSide
                                        </Button>
                                                   <div id="plainBackSide" className="id-cover" ref={horizontalPlainBackside}>
                                                       <img src={horizwhiteback} className="horizontal-back-img" />
                                                       <div className="user-content">
                                                           <p className="id-address justify-content-center">
                                                               த/க பெ: {data?.father_or_husband} <br />
                                                               {data?.current_address}
                                                           </p>
                                                           <p className="id-phone-no">{data?.mobile_number}</p>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                           </div>
                                      </div>
                                       {/* <<-- White  image End  here -->> */}

    

                                {data?.is_charity_member ? (
                                    // <--preview start here -->>
                                    <>
                                      
                                         <div className="id-vertical card mb-5">
                                            <div className="p-3 head-member">
                                               
                                                <h4>ID Card Preview</h4>
                                            </div>
                                            <div className="row justify-content-center p-3" >
                                            <div className="col-md-8 col-sm-10 col-lg-7 mb-3">
                                    <div style={{display:'flex', alignItems:'center'}}>
                                     <Button className="btn-success  ms-auto d-flex mr-2 p-1  justify-content-center"  style={{marginBottom: "10px",marginRight:"10px"}}>
                                            {pdfBytesPort ? (
      <a
      href={`data:application/pdf;base64,${pdfBytesPort}`} style={{color:'#fff',display:'flex',alignItems:'center'}}
      download="image.pdf"
    >
           <span className="mdi mdi-printer fs-2"></span>
           <span style={{display:'inline-block',padding:'5px'}}>Color BG</span>
        </a>
      ): <> <span className="mdi mdi-printer fs-2"></span>Loading.</>}
                                                  
                                        </Button>
                                        <Button className="btn-success ml-1 align-items-center d-flex gap-1 p-1 justify-content-center"  style={{marginBottom: "10px"}}>
                                            {pdfBytesPortWhite ? (
      <a
      href={`data:application/pdf;base64,${pdfBytesPortWhite}`} style={{color:'#fff',display:'flex',alignItems:'center'}}
      download="image.pdf"
    >
           <span className="mdi mdi-printer fs-2"></span>
           <span style={{display:'inline-block',padding:'5px'}}>White BG</span>
        </a>
      ): <> <span className="mdi mdi-printer fs-2"></span>Loading.</>}
                                                  
                                        </Button>
                                        </div>
                                     </div>
                                                <div className="col-md-8 col-sm-10 col-lg-6" >

                                                    <div className="id-cover">
                                                        <div >
                                                            <img src={verticalfront} className="vertical-front-img" />
                                                            <div className="user-content" >
                                                                {data?.profile_image ? (<img className="id-photo" src={base64Image + data?.profile_image} alt="User Avatar" />)
                                                                    : <img className="id-photo" src={noprofile} alt="User Profie" />}

                                                                <p className="id-name">{data?.name}</p>
                                                                <p className="id-reg-no">{data?.receipt_no}</p>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-8 col-sm-10 col-lg-6">
                                                    <div className="id-cover" >
                                                        <img src={verticalback} className="vertical-back-img" />
                                                        <div className="user-content">
                                                            <p className="id-address">
                                                                த/க பெ: {data?.father_or_husband} <br />
                                                                {data?.current_address}
                                                            </p>
                                                            <p className="id-phone-no">{data?.phone_number}</p>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                       <div style={{display:'none'}} className="id-horizontal ">
                                 
                                            <div className="row justify-content-center p-3">
                                                <div className="col-md-8 col-sm-10 col-lg-7 mb-3">
                                                    <div className="id-cover" >
                                                        <img src={horizontalgreenfront} className="horizontal-front-img" />
                                                        <div className="user-content">
                                                           
                                                            {data?.profile_image ? (<img className="id-photo" src={base64Image + data?.profile_image} alt="User Avatar" />)
                                                                : <img className="id-photo" src={noprofile} alt="User Profie" />}
                                                            <p className="id-name">{data?.name}</p>
                                                            <p className="id-reg-no">{data?.member_id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 col-sm-10 col-lg-7">
                                                    <div className="id-cover">
                                                        <img src={horizontalgreenback} className="horizontal-back-img" />
                                                        <div className="user-content">
                                                            <p className="id-address justify-content-center">
                                                                த/க பெ: {data?.father_or_husband} <br />
                                                                {data?.current_address}
                                                            </p>
                                                            <p className="id-phone-no">{data?.member_id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                     
                                    </>
                                ) : <>
                                  
                                </>} 
                            </Card>
                        </div>
                    </div>
                </Container>
               
            </div>
            <ToastContainer />
        </>
    )
}
export default withTranslation()(UseridCard);

UseridCard.propTypes = {
  t: PropTypes.any
};