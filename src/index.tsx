import React, { useMemo } from 'react'
import { Editable, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react'
import { Node, createEditor } from 'slate'
import _ from 'lodash';
import { withHistory } from 'slate-history'
import { 
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter, faGripLines, faTint, faHighlighter, faFillDrip,
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'
import ReactPlayer from 'react-player';
import cx from 'classnames';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import ImageAdd from './ImageAdd';
import ColorPicker from './ColorPicker';
import FontFormatter from './FontFormatter';
import './index.css';

const getBackgroundColor = (value: Node[]): null | string => {
  const firstNode = _.head(value);
  return firstNode && firstNode.type === 'background-color' && firstNode.color != null  
    ? String(firstNode.color)
    : null;
}

const SlateRTE = ({ value, setValue, readOnlyMode, uploadFile }: {
  value: Node[],
  setValue:(value: Node[]) => void,
  uploadFile?: (file: File, progressCallBack: (progress: number) => void) => Promise<null | string>,
  readOnlyMode: boolean,
}) => {
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])
  const backgroundColor = getBackgroundColor(value);
  return (
    <div 
      className={cx(
        'SlateRTE d-flex flex-column justify-content-start text-left p-3',
        {
          'read-only': readOnlyMode,
        }
      )}
      style={backgroundColor ? {
        backgroundColor,
      } : {}}
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
            <ColorPicker icon={faFillDrip} type="background-color" />
            { uploadFile && (<ImageAdd type="image" uploadFile={uploadFile} />)}
            { uploadFile && (<ImageAdd type="video" uploadFile={uploadFile} />)}
            <FontFormatter options={[300, 400, 600]} type="font-weight" defaultVal={400} />
            <FontFormatter options={_.range(8, 60)} type="font-size" defaultVal={16} />
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
      return (
        <div className="d-inline-block" {...attributes}>
          <div className="d-inline-block" contentEditable={false}>
            <img alt="Uploaded Image" src={String(element.url) || ''} className="image-item" />
          </div>
          {children}
        </div>
      )
    case 'video':
      return (
        <div className="d-inline-block video-item-cont" {...attributes}>
          <div className="d-inline" contentEditable={false}>
            <ReactPlayer
              url={String(element.url)}
              playing
              className="video-item"
              controls
              playsinline
            />
          </div>
          {children}
        </div>
      )
    case 'background-color':
      return (<div />);
    default:
      return <div className="pb-3" {...attributes}>{children}</div>
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
  if (leaf['font-size']) {
    // @ts-ignore
    const { value: fontSize } = leaf['font-size'];
    children = <span style={{ fontSize: `${fontSize / (16.00)}em` }} >{children}</span>
  }
  if (leaf['font-weight']) {
    // @ts-ignore
    const { value: fontWeight } = leaf['font-weight'];
    children = <span style={{ fontWeight }} >{children}</span>
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
