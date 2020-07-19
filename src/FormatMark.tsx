import React from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor } from 'slate'
import isHotkey from 'is-hotkey'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import FormatButton from './FormatButton';

export type MarkFormats = 'bold' | 'italic' | 'underline' | 'code';

const FormatMark = ({ format, icon }: {
  format: MarkFormats,
  icon: IconDefinition,
}) => {
  const editor = useSlate();
  return (
    <FormatButton 
      isActive={isMarkActive(editor, format)}
      icon={icon}
      onClick={() => {
        toggleMark(editor, format)
      }}
    />
  );
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

export const HotKeyHandler = ({
  event, editor,
}: { editor : ReactEditor, event: KeyboardEvent }) => {
  for (const hotkey in HOTKEYS) {
    if (isHotkey(hotkey, event)) {
      event.preventDefault()
      const mark = HOTKEYS[hotkey]
      toggleMark(editor, mark)
    }
  }
};

const toggleMark = (editor: ReactEditor, format: MarkFormats) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor: ReactEditor, format: MarkFormats) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}


export default FormatMark
