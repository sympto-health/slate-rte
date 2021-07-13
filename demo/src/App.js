import React, { useState } from "react";
import SlateRTE, { extractText, deserializeHTMLString, parseAsHTML, getBackgroundColor }  from "slate-rte";
import { Card } from 'react-bootstrap';
import uuid from 'uuid/v4';
import swal from 'sweetalert';
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
  const [value, setValue] = useState([{"type":"paragraph","children":[{"text":""},{"type":"image","text":null,"children":[{"text":""}],"url":"data:image/png;base64,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"},{"text":""}]}]);
  const [fileMapping, setFileMapping] = useState({});
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
  const onFileLoad = async ({ id }) => ({ url: fileMapping[id] });
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
          onFileLoad={onFileLoad}
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
              return {
                type: 'URL',
                url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
              };
            }
            const uploadFileDirectly = await swal(
              `How would you like to upload file?`,
              {
                dangerMode: true,
                buttons: ['Upload File Id', 'Upload File Directly'],
              },
            );
            const fileData = await fileToBase64(file);
            const saveFileData = () => {
              const fileId = uuid();
              setFileMapping({
                [fileId]: fileData,
              });
              return fileId;
            };
            return uploadFileDirectly
              ? {
                type: 'URL',
                url: fileData,
              } : {
                type: 'Image ID',
                id: saveFileData(fileData),
              };
          }} 
          value={value} 
          setValue={setValue} 
        />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Read Only
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE onFileLoad={onFileLoad} mode="Read-Only" value={value} setValue={setValue} />
      </Card>
      <div className="m-3 text-large text-center font-weight-light">
        Editable with Adjusted Font Size
      </div>
      <Card className="m-3 shadow-sm">
        <SlateRTE onFileLoad={onFileLoad} options={{ defaultFontSizePx: 30 }} mode="Edit" value={value} setValue={setValue} />
      </Card>
      <div className="d-flex align-items-center w-100">
        <div className="w-100">
          <div className="m-3 text-large text-center font-weight-light">
            Minimal Read Only
          </div>
          <Card className="m-3 shadow-sm">
            <SlateRTE onFileLoad={onFileLoad} mode="Minimal Read-Only" value={value} setValue={setValue} />
          </Card>
        </div>
        <div className="w-100">
          <div className="m-3 text-large text-center font-weight-light">
            Minimal PDF
          </div>
          <PDFPreview onFileLoad={onFileLoad} value={value} mode="Minimal PDF" />
        </div>
      </div>
      <div className="d-flex align-items-center w-100">
        <div className="w-100">
          <div className="m-3 text-large text-center font-weight-light">
            PDF
          </div>
          <PDFPreview onFileLoad={onFileLoad} value={value} mode="PDF" />
        </div>
        <div className="w-100">
          <div className="m-3 text-large text-center font-weight-light">
            PDF (adjusted Font size)
          </div>
          <PDFPreview onFileLoad={onFileLoad} defaultFontSize={30} value={value} mode="PDF" />
        </div>
      </div>
      <div className="m-3 text-large text-center font-weight-light">
        HTML Parse Testing
      </div>
      <code className="m-3 card p-4 shadow-sm">{htmlValue}</code>
      <Card className="m-3 shadow-sm">
        <SlateRTE onFileLoad={onFileLoad} mode="Read-Only" value={deserializedValue} setValue={setValue} />
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