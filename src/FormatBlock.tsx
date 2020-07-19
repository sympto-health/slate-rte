import React from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import { Editor, Transforms } from 'slate'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import FormatButton from './FormatButton';
import './index.css';

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export type BlockFormats = 'heading-one' | 'heading-two' | 'block-quote' | 'numbered-list' | 'bulleted-list';

const FormatBlock = ({ format, icon }: {
  format: BlockFormats,
  icon: IconDefinition,
}) => {
  const editor = useSlate();
  return (
    <FormatButton 
      isActive={isBlockActive(editor, format)}
      icon={icon}
      onClick={() => {
        toggleBlock(editor, format)
      }}
    />
  );
}

const toggleBlock = (editor: ReactEditor, format: BlockFormats) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(String(n.type)),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const isBlockActive = (editor: ReactEditor, format: BlockFormats) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

export default FormatBlock;

