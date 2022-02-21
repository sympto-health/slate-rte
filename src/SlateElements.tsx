import React from 'react'
import ReactPlayer from 'react-player';
import cx from 'classnames';
import { isSafari, isIOS } from 'react-device-detect';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useSelected, useFocused, RenderLeafProps, RenderElementProps } from 'slate-react';
import { SlateLeafNode } from './SlateTypes';
import ImageRender from './ImageRender';
import { SlateNode, BaseElementProps } from './SlateNode';
import AsyncFileLoad from './AsyncFileLoad';

export type ElementProps = {
  attributes: RenderElementProps['attributes'],
  isReadOnly: boolean,
  variables: { [variableName: string]: string },
  loadedImages?: { [fileId: string]: string }, // mapping of file id to url
} & BaseElementProps;

export type LeafProps = {
  attributes: RenderLeafProps['attributes'],
  children: JSX.Element,
  minimalFormatting: boolean,
  leaf: SlateLeafNode<SlateNode>,
  variables: { [variableName: string]: string },
};

// default size in px for font-size of 1em
const DEFAULT_EM_SIZE = 16;

export const Element = (props: ElementProps): JSX.Element => {
  const {
    attributes, children, element, minimalFormatting, onFileLoad, isReadOnly, loadedImages,
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
        <ImageRender 
          isReadOnly={isReadOnly} 
          loadedImages={loadedImages} 
          isSelected={selected && focused}
          className="image-item d-inline-block"
          nodeData={element} 
          onFileLoad={onFileLoad}
          attributes={attributes}
        >
          {children}
        </ImageRender>
      );
    case 'video':
      return (
        <div className="d-inline-block video-item-cont" {...attributes}>
          <div className="d-inline" contentEditable={false}>
            <AsyncFileLoad nodeData={element} onFileLoad={onFileLoad}>
              {(videoData) => (
                <>
                  {videoData && (
                    <ReactPlayer
                      url={String(videoData.url)}
                      playing
                      config={String(videoData.url).includes('.m3u8') ? {
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
                </>
              )}
            </AsyncFileLoad>
          </div>
          {children}
        </div>
      );
    case 'background-color':
      return (
        <div 
          data-color={String(element.color)} 
          className="d-none"
          style={{ backgroundColor: String(element.color) }} 
        >
          {children}
        </div>
      );
    case 'variable':
      return isReadOnly
        ? (
          <span
            {...attributes}
            data-variable={element.variableName}
            contentEditable={false}
          >
            {children}
          </span>
        )
        : (
          <span
            {...attributes}
            contentEditable={false}
            data-variable={element.variableName}
            className={cx('border', {'shadow-sm': selected && focused })}
          >
            {`{${element.variableName}}`}
            {children}
          </span>
        );
    default:
      return <div style={element.noPadding ? { paddingBottom: '0.01rem' } : { paddingBottom: '1rem' }} {...attributes}>{children}</div>  }
}

export const Leaf = ({
  attributes, children, leaf, minimalFormatting, variables,
}: LeafProps): JSX.Element => {
    // if variable type leaf, then child must include variable name
  const baseChild: JSX.Element = (
    <React.Fragment key={uuidv4()}>
      {_.compact([leaf.variable ? variables[leaf.variable.variableName] : children])}
    </React.Fragment>
  );

  const styleFuncs = [
    (child: JSX.Element): JSX.Element => (leaf.bold ? <span key={uuidv4()} data-type="bold" style= {{ fontWeight: 700 }}>{child}</span> : child),
    (child: JSX.Element): JSX.Element => (leaf.code ? <code key={uuidv4()}>{child}</code> : child),
    (child: JSX.Element): JSX.Element => (leaf.italic ? <em key={uuidv4()}>{child}</em> : child),
    (child: JSX.Element): JSX.Element => (leaf.underline ? <u key={uuidv4()}>{child}</u> : child),
    (child: JSX.Element): JSX.Element => (leaf['font-size'] != null
      // note that em is relative, so base em size will still be relevant here
      ? (<span key={uuidv4()} style={{ fontSize: `${leaf['font-size'].value / DEFAULT_EM_SIZE}em` }} >{child}</span>)
      : child),
    (child: JSX.Element): JSX.Element => (leaf['font-weight'] != null
      ? (<span key={uuidv4()}  style={{ fontWeight: leaf['font-weight'].value }} >{child}</span>)
      : child),
    (child: JSX.Element): JSX.Element => (leaf['text-color'] != null && !minimalFormatting
      ? (<span key={uuidv4()} data-color={leaf['text-color'].color} style={{ color: leaf['text-color'].color }}>{child}</span>)
      // if text color not set, or minimial formatting (dont include font color), just return child ofc
      : child),
    (child: JSX.Element): JSX.Element => (leaf['highlight-color'] != null
      ? (<span key={uuidv4()} data-color={leaf['highlight-color'].color} style={{ backgroundColor: leaf['highlight-color'].color }}>{child}</span>)
      : child),
  ];

  const finalChildComponent = styleFuncs.reduce((finalChild, styleFunc) => (styleFunc(finalChild)), baseChild)
  return leaf.variable
    ? <span key={uuidv4()} data-variable-leaf={leaf.variable.variableName} {...attributes}>{finalChildComponent}</span>
    : <span key={uuidv4()} {...attributes}>{finalChildComponent}</span>
}
