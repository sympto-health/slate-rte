import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import { Editor, Range, Transforms } from 'slate'
import { TwitterPicker } from 'react-color';
import { Dropdown } from 'react-bootstrap';
import cx from 'classnames';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { BackgroundColorNode } from './SlateTypes';
import { SlateEditorT, SlateNode, convertSlateEditor } from './SlateNode';
import FormatButton from './FormatButton';

const ColorPicker = ({ type, icon }: { 
  icon: IconDefinition, type: 'text-color' | 'highlight-color' | 'background-color',
}) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate();
  const [showColorPicker, setColorPicker] = useState(false);
  const [selectedText, setSelectedText] = useState<Range | null>(null);
  const currentColor = getActiveColor(editor, type);

  return (
    <Dropdown
      show={showColorPicker}
      className="d-flex"
    >
      <FormatButton 
        isActive={currentColor != null}
        icon={icon}
        type="dropdown"
        className={cx({ 'border border-primary': showColorPicker })}
        itemColor={currentColor}
        onClick={() => {
          setSelectedText(editor.selection);
          setColorPicker(!showColorPicker);
        }}
      />
      <Dropdown.Menu
        className="bg-transparent border-0"
        popperConfig={{
          modifiers: [{
            name: 'preventOverflow',
          }, {
            name: 'arrow',
            options: {
              padding: 5, // 5px from the edges of the popper
            },
          }],
        }}
      >
        <Dropdown.Item className="bg-transparent border-0">
          <TwitterPicker 
            onChange={({ hex: newColor }) => { 
              toggleColor(editor, selectedText, newColor, type); 
              setColorPicker(false);
            }} 
          />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
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
