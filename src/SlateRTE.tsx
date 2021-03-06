import React, { useMemo, useState, useRef } from 'react'
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
import { useSelected, useFocused, Editable, ReactEditor, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react';
import ColorPicker from './ColorPicker';
import FontFormatter from './FontFormatter';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import FormatButton from './FormatButton';
import VariableSuggestions, { withVariables } from './Variables';
import ImageAdd, { withImages } from './ImageAdd';
import { FileT, SlateLeafNode } from './SlateTypes';
import { SlateNode, BaseElementProps } from './SlateNode';
import getBackgroundColor from './getBackgroundColor';
import SlatePDF from './SlatePDF';
import AsyncFileLoad from './AsyncFileLoad';

type ElementProps = { 
  attributes: RenderElementProps['attributes'], 
  isReadOnly: boolean,
  variables: { [variableName: string]: string },
} & BaseElementProps;

type LeafProps = {
  attributes: RenderLeafProps['attributes'], 
  children: JSX.Element,
  minimalFormatting: boolean,
  leaf: SlateLeafNode<SlateNode>,
  variables: { [variableName: string]: string },
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
  value, setValue, mode, uploadFile, toolbarClassName, className, variables, inputClassName, options, onFileLoad,
}: {
  value: SlateNode[],
  setValue:(value: SlateNode[]) => void,
  uploadFile?: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
  mode: 'Read-Only' | 'Edit' | 'Minimal Read-Only' | 'PDF' | 'Minimal PDF',
  toolbarClassName?: string,
  onFileLoad?: (opts: { id: string }) => Promise<{ url: string }>,
  className?: string,
  inputClassName?: string,
  // mapping of variable to variable value
  variables: { [variableName: string]: string },
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number, 
  },
}) => {
  const readOnlyMode = mode === 'Read-Only' || mode === 'Minimal Read-Only';
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withVariables(readOnlyMode)(withImages(withLinks(withHistory(withReact(createEditor()))))), [])
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
        variables={variables}
        onFileLoad={onFileLoad}
      />
    );
  }
  const slateEditor = useRef<HTMLDivElement | null>(null)
  return (
    <div 
      className={cx(
        'SlateRTE d-flex flex-column justify-content-start text-left position-relative',
        {
          'read-only': mode === 'Read-Only' || mode === 'Minimal Read-Only',
          'p-3': mode !== 'Minimal Read-Only',
        },
        className,
      )}
      ref={slateEditor}
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
            <VariableSuggestions 
              boundingBox={slateEditor.current 
                ? { 
                  top: slateEditor.current.getBoundingClientRect().top, 
                  left: slateEditor.current.getBoundingClientRect().left,
                } 
                : { top: 0, left: 0 }} 
              variables={_.keys(variables)}
              value={value} 
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
                <FontFormatter options={[300, 400, 700, 800]} type="font-weight" defaultVal={400} />
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
              onFileLoad={onFileLoad}
              isReadOnly={mode === 'Read-Only' || mode === 'Minimal Read-Only'}
              minimalFormatting={mode === 'Minimal Read-Only'}
            />
          )}
          renderLeaf={(props: any) => (
            <Leaf 
              {...(props as LeafProps)}
              variables={variables}
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


const Element = (props: ElementProps) => {
  const { 
    attributes, children, element, minimalFormatting, onFileLoad, isReadOnly, 
  } = props;
  const selected = useSelected();
  const focused = useFocused();
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
        <div
          {...attributes}
          className={cx('d-inline-block', { 'shadow-sm': selected && focused })}
        >
          <div contentEditable={false}>
            <AsyncFileLoad nodeData={element} onFileLoad={onFileLoad}> 
              {({ url }) => (
                <img alt="Uploaded Image" src={url} className="image-item d-inline-block" />
              )}
            </AsyncFileLoad>
          </div>
          {children}
        </div>
      );
    case 'video':
      return (
        <div className="d-inline-block video-item-cont" {...attributes}>
          <div className="d-inline" contentEditable={false}>
            <AsyncFileLoad nodeData={element} onFileLoad={onFileLoad}> 
              {({ url }) => (
                <ReactPlayer
                  url={String(url)}
                  playing
                  config={String(url).includes('.m3u8') ? {
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
              )}
            </AsyncFileLoad>
          </div>
          {children}
        </div>
      );
    case 'background-color':
      return (<div style={{ backgroundColor: String(element.color) }} />);
    case 'variable':
      return isReadOnly
        ? (
          <span
            {...attributes}
            className="d-inline-block"
            contentEditable={false}
          >
            {children}
          </span>
        )
        : (
          <span
            {...attributes}
            contentEditable={false}
            className={cx('border', {'shadow-sm': selected && focused })}
          >
            {`\{${element.variableName}\}`}
            {children}
          </span>
        );
    default: 
      return <div style={element.noPadding ? { paddingBottom: '0.01rem' } : { paddingBottom: '1rem' }} {...attributes}>{children}</div>  }
}

const Leaf = ({ 
  attributes, children, leaf, minimalFormatting, variables
}: LeafProps) => {
    // if variable type leaf, then child must include variable name
  const baseChild: JSX.Element = (
    <>
      {_.compact([
        leaf.variable ? variables[leaf.variable.variableName] : null,
        children,
      ])}
    </>
  );

  const styleFuncs = [
    (child: JSX.Element): JSX.Element => (leaf.bold ? <span style= {{ fontWeight: 700 }}>{child}</span> : child),
    (child: JSX.Element): JSX.Element => (leaf.code ? <code>{child}</code> : child),
    (child: JSX.Element): JSX.Element => (leaf.italic ? <em>{child}</em> : child),
    (child: JSX.Element): JSX.Element => (leaf.underline ? <u>{child}</u> : child),
    (child: JSX.Element): JSX.Element => (leaf['font-size'] 
      // note that em is relative, so base em size will still be relevant here
      ? <span style={{ fontSize: `${leaf['font-size'].value / DEFAULT_EM_SIZE}em` }} >{child}</span>
      : child),
    (child: JSX.Element): JSX.Element => (leaf['font-weight'] 
      ?  <span style={{ fontWeight: leaf['font-weight'].value }} >{child}</span>
      : child),
    (child: JSX.Element): JSX.Element => (leaf['text-color'] && !minimalFormatting
      ?  <span style={{ color: leaf['text-color'].color }} >{child}</span>
      // if text color not set, or minimial formatting (dont include font color), just return child ofc
      : child),
    (child: JSX.Element): JSX.Element => (leaf['highlight-color'] 
      ?  <span style={{ backgroundColor: leaf['highlight-color'].color }} >{child}</span>
      : child),
  ];

  const finalChildComponent = styleFuncs.reduce((finalChild, styleFunc) => (styleFunc(finalChild)), baseChild)

  return <span {...attributes}>{finalChildComponent}</span>
}

export default SlateRTE;
