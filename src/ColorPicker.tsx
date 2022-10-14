import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Range, Transforms } from 'slate'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { BackgroundColorNode } from './SlateTypes';
import { SlateEditorT, SlateNode, convertSlateEditor } from './SlateNode';
import ColorPickerPopup from './ColorPickerPopup';

const ColorPicker = ({ type, icon }: {
  icon: IconDefinition, type: 'text-color' | 'highlight-color' | 'background-color',
}) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate();
  const [selectedText, setSelectedText] = useState<Range | null>(null);
  const currentColor = getActiveColor(editor, type);

  return (
    <ColorPickerPopup
      currentColor={currentColor}
      icon={icon}
      setColor={(newColor: string) => {
        console.log({ newColor });
        setSelectedText(editor.selection);
        toggleColor(editor, selectedText, newColor, type);
      }}
      colorPickerId={type}
    />
  );
}

// color is a hexcode
const toggleColor = (
  editor: SlateEditorT,
  selectedText: Range | null,
  color: string,
  type: 'text-color' | 'highlight-color' | 'background-color',
) => {
  if (type === 'background-color') {
    const point = Editor.start(convertSlateEditor(editor), [0, 0])
    const node: BackgroundColorNode<SlateNode> = {
      type: 'background-color',
      color,
      text: null,
      children: [],
    };

    if (editor.children[0].type !== 'background-color') {
      Transforms.insertNodes(convertSlateEditor(editor), (node as any), { at: point });
    } else {
      Transforms.setNodes(convertSlateEditor(editor), (node as any), { at: point });
    }
    return;
  }

  const currentColor = getActiveColor(editor, type)
  if (currentColor === color) {
    Editor.removeMark(convertSlateEditor(editor), type)
  } else {
    // TODO: figure out a way to do this without mutating the editor properties
    editor.selection = selectedText;
    Editor.addMark(convertSlateEditor(editor), type, { color });
  }
}

export const getActiveColor = (editor: SlateEditorT, type: 'text-color' | 'highlight-color' | 'background-color'): null | string => {
  const marks = Editor.marks(convertSlateEditor(editor));
  return marks && marks[type] ? marks[type].color : null;
}



export default ColorPicker
