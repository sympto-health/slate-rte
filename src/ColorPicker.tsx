import React, { useState } from 'react'
import { useSlate, ReactEditor } from 'slate-react'
import { Editor, Range } from 'slate'
import { TwitterPicker } from 'react-color';
import { faTint } from '@fortawesome/free-solid-svg-icons'
import FormatButton from './FormatButton';

const ColorPicker = () => {
  const editor = useSlate();
  const [showColorPicker, setColorPicker] = useState(false);
  const [selectedText, setSelectedText] = useState<Range | null>(null);
  const currentColor = getActiveColor(editor);
  return (
    <>
      <FormatButton 
        isActive={currentColor != null}
        icon={faTint}
        style={currentColor ? {
          color: currentColor,
        } : {}}
        onClick={() => {
          setSelectedText(editor.selection);
          setColorPicker(true);
        }}
      />
      {
        showColorPicker && (
          <TwitterPicker 
            onChange={({ hex: newColor }) => { 
              toggleColor(editor, selectedText, newColor); 
              setColorPicker(false);
            }} 
          />
        )
      }
    </>
  );
}

// color is a hexcode
const toggleColor = (editor: ReactEditor, selectedText: Range | null, color: string) => {
  const currentColor = getActiveColor(editor)

  if (currentColor === color) {
    Editor.removeMark(editor, 'text-color')
  } else {
    // TODO: figure out a way to do this without mutating the editor properties
    editor.selection = selectedText;
    Editor.addMark(editor, 'text-color', { color });
  }
}

export const getActiveColor = (editor: ReactEditor): null | string => {
  const marks = Editor.marks(editor)
  return marks && marks['text-color'] ? marks['text-color'].color : null;
}



export default ColorPicker
