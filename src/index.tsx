import React, { useMemo, useState } from 'react'
import { Editable, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react'
import { Node, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { 
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter,
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import ColorPicker from './ColorPicker';
import './index.css';

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
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])

  return (
    <div className="SlateRTE d-flex flex-column justify-content-start text-left p-3">
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Card className="d-flex flex-row shadow-sm px-2 py-1 card mb-3 w-auto">
          {[
            { format: 'bold', icon: faBold },
            { format: 'italic', icon: faItalic },
            { format: 'underline', icon: faUnderline },
            { format: 'code', icon: faCode },
          ].map((
            { format, icon }: { format: MarkFormats, icon: IconDefinition },
          ) => (
            <FormatMark 
              key={format}
              format={format}
              icon={icon}
            />
          ))}
          {[
            { format: 'heading-one', icon: faHeading },
            { format: 'heading-two', icon: faFont },
            { format: 'block-quote', icon: faQuoteLeft },
            { format: 'numbered-list', icon: faListOl },
            { format: 'bulleted-list', icon: faListUl},
            { format: 'left-align', icon: faAlignLeft },
            { format: 'center-align', icon: faAlignCenter },
            { format: 'right-align', icon: faAlignRight },
          ].map(({ format, icon }: { icon: IconDefinition, format: BlockFormats }) => (
            <FormatBlock format={format} icon={icon}  key={format}/>
          ))}
          <LinkButton />
          <ColorPicker />
        </Card>
        <Editable
          renderElement={(props: RenderElementProps) => <Element {...props} />}
          renderLeaf={(props: RenderLeafProps) => <Leaf {...props} />}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          // @ts-ignore
          onKeyDown={(event: KeyboardEvent) => (HotKeyHandler({ event, editor }))}
        />
      </Slate>
    </div>
  );
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
    case 'left-align':
      return <div {...attributes} className="text-left">{children}</div>
    case 'right-align':
      return <div {...attributes} className="text-right">{children}</div>
    case 'center-align':
      return <div {...attributes} className="text-center">{children}</div>
    case 'link':
      return (
        <a {...attributes} href={String(element.url) || ''}>
          {children}
        </a>
      )
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
  if (leaf['text-color']) {
    // @ts-ignore
    const color = leaf['text-color'].color;
    children = <span style={{ color }} >{children}</span>
  }

  return <span {...attributes}>{children}</span>
}

export default SlateRTE
