import React, { useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { ReactEditor, Editable, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react'
import { Editor, Transforms, Node, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, IconDefinition } from '@fortawesome/free-solid-svg-icons'

import { Button } from 'react-bootstrap'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

type FormatT = 'bold' | 'italic' | 'underline' | 'code';

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const defaultInitialValue: Node[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
];

const SlateRTE = () => {
  const [value, setValue] = useState(defaultInitialValue);
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <div>
        {
          [
            { format: 'bold', icon: faCoffee, type: 'mark' },
            { format: 'italic', icon: faCoffee, type: 'mark' },
            { format: 'underline', icon: faCoffee, type: 'mark' },
            { format: 'code', icon: faCoffee, type: 'mark' },
            { format: 'heading-one', icon: faCoffee, type: 'block' },
            { format: 'heading-two', icon: faCoffee, type: 'block' },
            { format: 'block-quote', icon: faCoffee, type: 'block' },
            { format: 'numbered-list', icon: faCoffee, type: 'block' },
            { format: 'bulleted-list', icon: faCoffee, type: 'block' },
          ].map(({ format, icon, type }: { format: FormatT, icon: IconDefinition, type: 'mark' | 'block' }) => (
            <Button
              active={type === 'mark' ? isMarkActive(editor, format) : isBlockActive(editor, format)}
              onMouseDown={event => {
                event.preventDefault()
                if (type === 'mark') {
                  toggleMark(editor, format)
                } else {
                  toggleBlock(editor, format)
                }
              }}
            >
              <FontAwesomeIcon icon={icon} />
            </Button>
          ))
        }
      </div>
      <Editable
        renderElement={(props: RenderElementProps) => <Element {...props} />}
        renderLeaf={(props: RenderLeafProps) => <Leaf {...props} />}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            // @ts-ignore
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  );
}

const toggleBlock = (editor: ReactEditor, format: FormatT) => {
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

const toggleMark = (editor: ReactEditor, format: FormatT) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: ReactEditor, format: FormatT) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

const isMarkActive = (editor: ReactEditor, format: FormatT) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export default SlateRTE
