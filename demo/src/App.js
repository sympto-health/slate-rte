import React, { useState } from "react";
import SlateRTE, { extractText, deserializeHTMLString, parseAsHTML, getBackgroundColor }  from "slate-rte";
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PDFPreview from './PDFPreview';

const fileToBase64 = (file) => (
  new Promise(resolve => {
    const reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    // Convert data to base64 
    reader.readAsDataURL(file);
  }));

const App = () => {
  const [value, setValue] = useState([
      {
        "type": "background-color",
        "color": "#ecf0f1",
        "children": [
          {
            "text": ""
          }
        ]
      },
      {
        "type": "center-align",
        "children": [
          {
            "text": "DASH DISABILITY ",
            "font-size": {
              "value": 16
            },
            "font-weight": {
              "value": 300
            }
          }
        ]
      },
      {
        "type": "center-align",
        "children": [
          {
            "text": "& SYMPTOM SCORE",
            "font-size": {
              "value": 16
            },
            "font-weight": {
              "value": 300
            }
          }
        ]
      },
      {
        "type": "center-align",
        "children": [
          {
            "bold": true,
            "text": "0.83",
            "font-size": {
              "value": 22
            },
            "text-color": {
              "color": "#2980b9"
            },
            "font-weight": {
              "value": 600
            }
          }
        ]
      }
    ]);
  const htmlValue = (() => {
    try {
      return parseAsHTML(value)
    } catch (e) {
      console.log(e);
      return '';
    }
  })();

  const deserializedValue = (() => {
    try {
      return deserializeHTMLString(htmlValue);
    } catch (e) {
      console.log(e);
      return [];
    }
  })();
  return (
    <div className="bg-light h-100 p-4 pb-5">
      <div 
        className="pt-1 mx-4 rounded-pill w-25" 
        style={{
          backgroundColor: getBackgroundColor(value),
        }} 
      />
      <div>{extractText(value)}</div>
      <div className="m-3 text-large text-center font-weight-light">
        Editable
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE 
          mode="Edit"
          toolbarClassName="w-50"
          uploadFile={async (file, progress) => {

            // progress is a callback to update progress indicator
            // file contains file to uploaded
            // returns url of image from server

            // simulate an upload
            await new Promise(r => setTimeout(r, 100));
            await progress(30);
            await new Promise(r => setTimeout(r, 100));
            await progress(50);
            await new Promise(r => setTimeout(r, 100));
            await progress(70);
            await new Promise(r => setTimeout(r, 100));
            
            const [extension] = file.name.match(/\.[0-9a-z]+$/i);
            if (extension === '.mp4') {
              return 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
            }
            return fileToBase64(file);
          }} 
          value={value} 
          setValue={setValue} 
        />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Read Only
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE mode="Read-Only" value={value} setValue={setValue} />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Editable with Adjusted Font Size
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE options={{ defaultFontSizePx: 30 }} mode="Edit" value={value} setValue={setValue} />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Minimal Read Only
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE mode="Minimal Read-Only" value={value} setValue={setValue} />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        PDF
      </div>
      <PDFPreview value={value} mode="PDF" />
      <div className="m-3 text-large text-center font-weight-light">
        Minimal PDF
      </div>
      <PDFPreview value={value} mode="Minimal PDF" />
      <div className="m-3 text-large text-center font-weight-light">
        HTML Parse Testing
      </div>
      <code className="m-3 card p-4 shadow-sm">{htmlValue}</code>
      <Card className="m-3 shadow-sm">
        <SlateRTE mode="Read-Only" value={deserializedValue} setValue={setValue} />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Slate Compared
      </div>
      <div>{JSON.stringify(deserializedValue)}</div>
      <div className="mt-3">{JSON.stringify(value)}</div>
    </div>
  );
}  


export default App;