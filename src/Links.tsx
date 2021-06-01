import React from 'react'
import { useSlate } from 'slate-react'
import isUrl from 'is-url'
import { Editor, Transforms, Range } from 'slate'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { LinkNode, EmptySlateNode, SlateNode, SlateEditorT, convertSlateEditor } from './SlateNode';
import FormatButton from './FormatButton';

export const withLinks = (editor: SlateEditorT) => {
  const { insertData, insertText, isInline } = editor

  // @ts-ignore
  editor.isInline = (element: SlateNode) => {
    return (element.type === 'link' 
      || element.type === 'video' 
      || element.type === 'image')
        ? true 
        // @ts-ignore
        : isInline(element)
  }

  // @ts-ignore
  editor.insertText = (text: string | null) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      // @ts-ignore
      insertText(text)
    }
  }

  // @ts-ignore
  editor.insertData = (data: { getData: (dataType: string) => string }) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      // @ts-ignore
      insertData(data)
    }
  }

  return editor
}

export const LinkButton = () => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate()
  return (
    <FormatButton 
      isActive={isLinkActive(editor)}
      icon={faLink}
      onClick={() => {
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        insertLink(editor, url)
      }}
    />
  );
}

const insertLink = (editor: SlateEditorT, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = (editor: SlateEditorT) => {
  // @ts-ignore
  const [link] = Editor.nodes(convertSlateEditor(editor), { match: n => n.type === 'link' })
  return !!link
}

const unwrapLink = (editor: SlateEditorT) => {
  // @ts-ignore
  Transforms.unwrapNodes(convertSlateEditor(editor), { match: n => n.type === 'link' })
}

const wrapLink = (editor: SlateEditorT, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const children: SlateNode[] = isCollapsed ? [({ text: url, children: undefined } as EmptySlateNode)] : [];
  const link: LinkNode = {
    type: 'link',
    url,
    children,
    text: null,
  }

  if (isCollapsed) {
    // @ts-ignore
    Transforms.insertNodes(convertSlateEditor(editor), link)
  } else {
    // @ts-ignore
    Transforms.wrapNodes(convertSlateEditor(editor), link, { split: true })
    Transforms.collapse(convertSlateEditor(editor), { edge: 'end' })
  }
}