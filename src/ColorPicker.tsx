import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Range, Transforms } from 'slate'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { BackgroundColorNode } from './SlateTypes';
import { SlateEditorT, SlateNode, convertSlateEditor } from './SlateNode';
import ColorPickerPopup from './ColorPickerPopup';
import getBackgroundColor, { getBorderColor } from './getBackgroundColor';
import _ from 'lodash';

const ColorPicker = ({ type, icon }: {
  icon: IconDefinition, type: 'text-color' | 'highlight-color' | 'background-color' | 'border-color',
}) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate();
  const [selectedText, setSelectedText] = useState<Range | null>(null);
  const currentColor = getActiveColor(editor, type);

  return (
    <ColorPickerPopup
      currentColor={currentColor != null ? currentColor : DEFAULT_COLORS[type]}
      icon={icon}
      onBeforeToggleColorPicker={() => {
        setSelectedText(editor.selection);
      }}
      setColor={(newColor: string) => {
        toggleColor(editor, selectedText, newColor, type);
      }}
      colorPickerId={type}
    />
  );
}

const DEFAULT_COLORS = {
  'text-color': '#212529',
  'border-color': '#FFFFFF',
  'background-color': '#FFFFFF',
  'highlight-color': '#f1c40f',
};

// color is a hexcode
const toggleColor = (
  editor: SlateEditorT,
  selectedText: Range | null,
  color: string,
  type: 'text-color' | 'highlight-color' | 'background-color' | 'border-color',
) => {
  if (type === 'background-color' || type === 'border-color') {
    const targetNode = _.head(editor.children)?.type === 'background-color'
      ? _.head(editor.children) as BackgroundColorNode<SlateNode>
      : null;
    const newNode: BackgroundColorNode<SlateNode> = type === 'background-color'
      ? {
        type: 'background-color',
        children: [{ text: '' }],
        text: null,
        color,
        borderColor: targetNode != null ? targetNode.borderColor : null,
      }
      : {
        type: 'background-color',
        children: [{ text: '' }],
        color: targetNode != null ? targetNode.color : DEFAULT_COLORS[type],
        borderColor: color,
        text: null,
      }

    if (targetNode == null) {
      Transforms.insertNodes(convertSlateEditor(editor), (newNode as any), { at: [0]});
    } else {
      Transforms.setNodes(convertSlateEditor(editor), (newNode as any), { at: [0]});
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

export const getActiveColor = (editor: SlateEditorT, type: 'text-color' | 'highlight-color' | 'background-color' | 'border-color'): null | string => {
  if (type === 'background-color') {
    return getBackgroundColor(editor.children);
  }
  if (type === 'border-color') {
    return getBorderColor(editor.children);
  }
  const marks = Editor.marks(convertSlateEditor(editor));
  return marks && marks[type] ? marks[type].color : null;
}



export default ColorPicker
