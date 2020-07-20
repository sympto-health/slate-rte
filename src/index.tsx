import React, { useMemo } from 'react'
import { Editable, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react'
import { Node, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { 
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter, faGripLines, faTint, faHighlighter,
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'
import cx from 'classnames';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import ImageAdd from './ImageAdd';
import ColorPicker from './ColorPicker';
import './index.css';

const SlateRTE = ({ value, setValue, readOnlyMode, uploadImage }: {
  value: Node[],
  setValue:(value: Node[]) => void,
  uploadImage?: (file: File, progressCallBack: (progress: number) => void) => Promise<null | string>,
  readOnlyMode: boolean,
}) => {
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])

  return (
    <div 
      className={cx(
        'SlateRTE d-flex flex-column justify-content-start text-left p-3',
        {
          'read-only': readOnlyMode,
        }
      )}
    >
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        { !readOnlyMode && (
          <Card className="d-flex flex-row flex-wrap shadow-sm px-2 py-1 card mb-3 w-auto">
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
              { format: 'horizontal-line', icon: faGripLines },
            ].map(({ format, icon }: { icon: IconDefinition, format: BlockFormats }) => (
              <FormatBlock format={format} icon={icon}  key={format}/>
            ))}
            <LinkButton />
            <ColorPicker icon={faTint} type="text-color" />
            <ColorPicker icon={faHighlighter} type="highlight-color" />
            { uploadImage && (<ImageAdd uploadImage={uploadImage} />)}
          </Card>
        )}
        <Editable
          readOnly={readOnlyMode}
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
    case 'horizontal-line': 
      return (
        <div {...attributes}>
          <hr />
          {children}
        </div>
      )
    case 'link':
      return (
        <a {...attributes} href={String(element.url) || ''}>
          {children}
        </a>
      )
    case 'image':
    console.log(element);
      return (
        <div {...attributes}>
          <img alt="Uploaded Image" src={String(element.url) || ''} className="image-item" />
          {children}
        </div>
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
    const { color } = leaf['text-color'];
    children = <span style={{ color }} >{children}</span>
  }
  if (leaf['highlight-color']) {
    // @ts-ignore
    const backgroundColor = leaf['highlight-color'].color;
    children = <span style={{ backgroundColor }} >{children}</span>
  }


  return <span {...attributes}>{children}</span>
}

export default SlateRTE
