import React from 'react'
import { useSlate } from 'slate-react'
import { Editor, Transforms } from 'slate'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import FormatButton from './FormatButton';
import { SlateEditorT, convertSlateEditor, SlateNode } from './SlateNode';
import './index.css';

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export type BlockFormats = 'heading-one' | 'heading-two' | 'block-quote' | 'numbered-list' | 'bulleted-list' | 'left-align' | 'center-align' | 'right-align' | 'horizontal-line';

const FormatBlock = ({ format, icon }: {
  format: BlockFormats,
  icon: IconDefinition,
}) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate();
  return (
    <FormatButton
      isActive={isBlockActive(editor, format)}
      icon={(icon as IconProp)}
      onClick={() => {
        toggleBlock(editor, format)
      }}
    />
  );
}

const toggleBlock = (editor: SlateEditorT, format: BlockFormats) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(convertSlateEditor(editor), {
    match: (n: SlateNode)  => (n.type ? LIST_TYPES.includes(n.type) : false),
    split: true,
  })

  Transforms.setNodes(convertSlateEditor(editor), {
    // @ts-ignore
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(convertSlateEditor(editor), block)
  }
}

const isBlockActive = (editor: SlateEditorT, format: BlockFormats) => {
  const [match] = Editor.nodes(convertSlateEditor(editor), {
    match: (n: SlateNode) => n.type === format,
  })

  return !!match
}

export default FormatBlock;

