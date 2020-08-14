import React, { useState } from 'react'
import { useSlate, ReactEditor } from 'slate-react'
import { Editor, Range, Transforms } from 'slate'
import { TwitterPicker } from 'react-color';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import FormatButton from './FormatButton';

const ColorPicker = ({ type, icon }: { 
  icon: IconDefinition, type: 'text-color' | 'highlight-color' | 'background-color',
}) => {
  const editor = useSlate();
  const [showColorPicker, setColorPicker] = useState(false);
  const [selectedText, setSelectedText] = useState<Range | null>(null);
  const currentColor = getActiveColor(editor, type);
  return (
    <>
      <FormatButton 
        isActive={currentColor != null}
        icon={icon}
        itemColor={currentColor}
        onClick={() => {
          setSelectedText(editor.selection);
          setColorPicker(true);
        }}
      />
      {
        showColorPicker && (
          <TwitterPicker 
            onChange={({ hex: newColor }) => { 
              toggleColor(editor, selectedText, newColor, type); 
              setColorPicker(false);
            }} 
          />
        )
      }
    </>
  );
}

// color is a hexcode
const toggleColor = (
  editor: ReactEditor, 
  selectedText: Range | null, 
  color: string, 
  type: 'text-color' | 'highlight-color' | 'background-color',
) => {
  if (type === 'background-color') {
    const point = Editor.start(editor, [0, 0])
    const node = {
      type: 'background-color',
      color,
      children: [],
    };

    if (editor.children[0].type !== 'background-color') {
      Transforms.insertNodes(editor, node, { at: point });
    } else {
      Transforms.setNodes(editor, {
        type: 'background-color',
        color,
        children: [],
      }, { at: point });
    }
    return;
  }

  const currentColor = getActiveColor(editor, type)
  if (currentColor === color) {
    Editor.removeMark(editor, type)
  } else {
    // TODO: figure out a way to do this without mutating the editor properties
    editor.selection = selectedText;
    Editor.addMark(editor, type, { color });
  }
}

export const getActiveColor = (editor: ReactEditor, type: 'text-color' | 'highlight-color' | 'background-color'): null | string => {
  const marks = Editor.marks(editor)
  return marks && marks[type] ? marks[type].color : null;
}



export default ColorPicker
