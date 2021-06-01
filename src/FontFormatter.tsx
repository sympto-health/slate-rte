import React from 'react'
import { useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import { Form } from 'react-bootstrap';
import { SlateEditorT, convertSlateEditor } from './SlateNode';
import './FontFormatter.css';

type FontFormats = 'font-weight' | 'font-size';

const FontFormatter = ({ type, defaultVal, options }: {
  type: FontFormats,
  defaultVal: number,
  options: Array<number>,
}) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate();
  return (
    <Form.Group className="FontFormatter m-0">
      <Form.Control 
        value={getActiveValue(editor, type) || String(defaultVal)} 
        as="select" 
        size="sm" 
        custom 
        className="select-dropdown"
        onChange={(e) => {
          toggleFontStyle(editor, editor.selection, e.target.value, type);
        }}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </Form.Control>
      <div>{ type === 'font-weight' ? 'weight' : 'em'}</div>
    </Form.Group>
  );
}



const getActiveValue = (editor: SlateEditorT, type: 'font-weight' | 'font-size'): null | string => {
  const marks = Editor.marks(convertSlateEditor(editor))
  return marks && marks[type] ? marks[type].value : null;
}


const toggleFontStyle = (
  editor: SlateEditorT, 
  selectedText: Range | null, 
  fontValue: string, 
  type: FontFormats,
) => {
  // TODO: figure out a way to do this without mutating the editor properties
  editor.selection = selectedText;
  Editor.addMark(convertSlateEditor(editor), type, { value: Number(fontValue) });
}


export default FontFormatter;
