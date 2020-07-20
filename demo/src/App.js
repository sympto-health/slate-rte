import React, { useState } from "react";
import SlateRTE from "slate-rte";

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
    <div>
      <SlateRTE 
        uploadImage={async (file, progress) => {
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
          
          return 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg';
        }} 
        readOnlyMode={false} 
        value={value} 
        setValue={setValue} 
      />
      <SlateRTE readOnlyMode value={value} setValue={setValue} />
    </div>
  );
}  


export default App;