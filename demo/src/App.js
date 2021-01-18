import React, { useState } from "react";
import SlateRTE, { parseAsHTML, getBackgroundColor }  from "slate-rte";
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      type: 'paragraph',
      children: [
        { text: 'This is editable ' },
        { text: 'rich', bold: true },
        { text: ' text, ' },
        { text: 'much', italic: true },
        { text: ' better than a ' },
        { text: '<textarea>', code: true },
        { text: '!' },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text ",
        },
        { text: 'bold', bold: true },
        {
          text:
            ', or add a semantically rendered block quote in the middle of the page, like this:',
        },
      ],
    },
    {
      type: 'block-quote',
      children: [{ text: 'A wise quote.' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ]);
  return (
    <div className="bg-light h-100 p-4 pb-5">
      <div 
        className="pt-1 mx-4 rounded-pill w-25" 
        style={{
          backgroundColor: getBackgroundColor(value),
        }} 
      />
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
      <Card className="m-3 shadow-sm">
        <SlateRTE mode="Read-Only" value={value} setValue={setValue} />
      </Card>
      <Card className="m-3 shadow-sm">
        <SlateRTE mode="Minimal Read-Only" value={value} setValue={setValue} />
      </Card>
      <Card className="m-3 shadow-sm">
        <div
          dangerouslySetInnerHTML={{
            __html: parseAsHTML(value),
          }}
        />
      </Card>
    </div>
  );
}  


export default App;