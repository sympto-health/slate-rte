import React, { useMemo, useState } from 'react'
import { withHistory } from 'slate-history'
import { 
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter, faGripLines, faTint, faHighlighter, faFillDrip, faEllipsisH, 
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'
import ReactPlayer from 'react-player';
import cx from 'classnames';
import { isSafari, isIOS } from 'react-device-detect';
import { createEditor } from 'slate';
import _ from 'lodash';
import { Editable, ReactEditor, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react';
import ColorPicker from './ColorPicker';
import FontFormatter from './FontFormatter';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import FormatButton from './FormatButton';
import ImageAdd from './ImageAdd';
import { SlateNode, SlateElementNode, SlateLeafNode } from './SlateNode';
import getBackgroundColor from './getBackgroundColor';
import SlatePDF from './SlatePDF';

type ElementProps = { 
  attributes: RenderElementProps['attributes'], 
  children: JSX.Element,
  minimalFormatting: boolean,
  element: SlateElementNode,
};

type LeafProps = {
  attributes: RenderLeafProps['attributes'], 
  children: JSX.Element,
  minimalFormatting: boolean,
  leaf: SlateLeafNode,
};

// default size in px for font-size of 1em
const DEFAULT_EM_SIZE = 16;

/* Modes:
    Read only - full formatting, not editable
    Edit - ability to edit text, with full formatting
    Minimal read only - read only mode w/ no background colors, no alignment formatting, 
      no text colors (background color becomes text color if applicable)
 */
const SlateRTE = ({ 
  value, setValue, mode, uploadFile, toolbarClassName, className, inputClassName, options,
}: {
  value: SlateNode[],
  setValue:(value: SlateNode[]) => void,
  uploadFile?: (file: File, progressCallBack: (progress: number) => void) => Promise<null | string>,
  mode: 'Read-Only' | 'Edit' | 'Minimal Read-Only' | 'PDF' | 'Minimal PDF',
  toolbarClassName?: string,
  className?: string,
  inputClassName?: string,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number, 
  },
}) => {
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])
  const backgroundColor = getBackgroundColor(value);
  const calculateColorStyles = () => {
    if (backgroundColor == null) return {};
    if (mode === 'Minimal Read-Only' || mode === 'PDF') return { color: backgroundColor };
    return { backgroundColor };
  };
  const [showAllOptions, setShowAllOptions] = useState(false);

  if (mode === 'PDF' || mode === 'Minimal PDF') {
    return (
      <SlatePDF 
        options={options} 
        minimalFormatting={mode === 'Minimal PDF'} 
        value={value} 
      />
    );
  }
  return (
    <div 
      className={cx(
        'SlateRTE d-flex flex-column justify-content-start text-left',
        {
          'read-only': mode === 'Read-Only' || mode === 'Minimal Read-Only',
          'p-3': mode !== 'Minimal Read-Only',
        },
        className,
      )}
      style={{
        ...calculateColorStyles(),
        fontSize: options ? `${DEFAULT_EM_SIZE / options.defaultFontSizePx}em` : '1em',
      }}
    >
      <Slate editor={editor} value={value as any[]} onChange={value => setValue(value as SlateNode[])}>
        { mode === 'Edit' && (
          <Card 
            className={cx('toolbar-item d-flex flex-row flex-wrap shadow-sm px-2 py-1 card mb-3 w-auto', toolbarClassName)}
          >
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
            <FormatButton
              icon={faEllipsisH}
              isActive={showAllOptions}
              onClick={() => {
                setShowAllOptions((curOption) => !curOption);
              }}
            />
            { showAllOptions && (
              <>
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
              </>
            )}
          </Card>
        )}
        <Editable
          readOnly={mode === 'Read-Only' || mode === 'Minimal Read-Only'}
          renderElement={(props: any) => (
            <Element 
              {...(props as ElementProps)}
              minimalFormatting={mode === 'Minimal Read-Only'}
            />
          )}
          renderLeaf={(props: any) => (
            <Leaf 
              {...(props as LeafProps)}
              minimalFormatting={mode === 'Minimal Read-Only'} 
            />
           )}         
          placeholder="Enter some rich text…"
          spellCheck
          className={inputClassName}
          // @ts-ignore
          onKeyDown={(event: KeyboardEvent) => (HotKeyHandler({ event, editor }))}
        />
      </Slate>
    </div>
  );
}


const Element = ({ 
  attributes, children, element, minimalFormatting,
}: ElementProps) => {
  switch (element.type) {
    case 'block-quote': 
      return (<blockquote {...attributes}>{children}</blockquote>);
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
      return minimalFormatting 
        ? <div>{children}</div> 
        : <div {...attributes} style={{ textAlign: 'left' }}>{children}</div>
    case 'right-align':
      return minimalFormatting 
        ? <div>{children}</div>
        : <div {...attributes} style={{ textAlign: 'right' }}>{children}</div>
    case 'center-align':
      return minimalFormatting
        ? <div>{children}</div> 
        : <div {...attributes} style={{ textAlign: 'center' }}>{children}</div>
    case 'horizontal-line':
      return minimalFormatting
        ? <div>{children}</div> 
        : (
          <div {...attributes}>
            <hr />
            {children}
          </div>
        )
    case 'link':
      return (
        <a target="_blank" {...attributes} href={element.url}>
          {children}
        </a>
      );
    case 'image':
      return (
        <div className="d-inline-block" {...attributes}>
          <div className="d-inline-block" contentEditable={false}>
            <img alt="Uploaded Image" src={element.url} className="image-item" />
          </div>
          {children}
        </div>
      );
    case 'video':
      return (
        <div className="d-inline-block video-item-cont" {...attributes}>
          <div className="d-inline" contentEditable={false}>
            <ReactPlayer
              url={String(element.url)}
              playing
              config={String(element.url).includes('.m3u8') ? {
                file: {
                  forceHLS: !isSafari && !isIOS,
                  hlsOptions: {
                    xhrSetup: (xhr: any) => {
                      // eslint-disable-next-line
                      xhr.withCredentials = true; // send cookies
                    },
                  },
                },
              } : {}}
              className="video-item"
              controls
              playsinline
            />
          </div>
          {children}
        </div>
      );
    case 'background-color':
      return (<div style={{ backgroundColor: String(element.color) }} />);
    default: 
      return <div style={element.noPadding ? { paddingBottom: '0.01rem' } : { paddingBottom: '1rem' }} {...attributes}>{children}</div>
  }
}

const Leaf = ({ 
  attributes, children, leaf, minimalFormatting,
}: LeafProps) => {
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
    const { value: fontSize } = leaf['font-size'];
    // note that em is relative, so base em size will still be relevant here
    children = <span style={{ fontSize: `${fontSize / DEFAULT_EM_SIZE}em` }} >{children}</span>
  }
  if (leaf['font-weight']) {
    const { value: fontWeight } = leaf['font-weight'];
    children = <span style={{ fontWeight }} >{children}</span>
  }
  if (leaf['text-color']) {
    const { color } = leaf['text-color'];
    children = minimalFormatting ? children : (<span style={{ color }} >{children}</span>)
  }
  if (leaf['highlight-color']) {
    const highlightBackgroundColor = leaf['highlight-color'].color;
    children = <span style={{ backgroundColor: highlightBackgroundColor }} >{children}</span>
  }


  return <span {...attributes}>{children}</span>
}

export default SlateRTE;
