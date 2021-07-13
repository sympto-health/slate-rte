declare module 'slate-rte' {
  import type {
    Node, Element, Component, ComponentType, Ref,
  } from 'react';

  declare type ASCIIColor = string;

  declare type BaseNode = {
    children?: ?Array<SlateNode>,
    text?: ?string,
  };
  declare type LeafStyles = {
    bold: boolean,
    'font-size': {
      value: number,
    },
    code: boolean,
    italic: boolean,
    underline: boolean,
    'font-weight': {
      value: number,
    },
    'text-color': {
      color: ASCIIColor,
    },
    'highlight-color': {
      color: ASCIIColor,
    },
  };


  declare type SlateLeafNode = {
    type?: null,
    bold?: $PropertyType<LeafStyles, 'bold'>,
    'font-size'?: $PropertyType<LeafStyles, 'font-size'>,
    code?: $PropertyType<LeafStyles, 'code'>,
    italic?: $PropertyType<LeafStyles, 'italic'>,
    underline?: $PropertyType<LeafStyles, 'underline'>,
    'font-weight'?: $PropertyType<LeafStyles, 'font-weight'>,
    'text-color'?: $PropertyType<LeafStyles, 'text-color'>,
    'highlight-color'?: $PropertyType<LeafStyles, 'highlight-color'>,
    ...BaseNode,
  };

  declare type LinkNode = ({
    type: 'link',
    url: string,
    ...BaseNode,
  });

  declare type ImageVideoNode = ({
    type: 'image' | 'video',
    url: string,
    ...BaseNode,
  } | {
    type: 'image' | 'video',
    fileData: { type: 'Image ID', id: string },
    ...BaseNode,
  });

  declare type BackgroundColorNode = ({
    type: 'background-color',
    color: string,
    ...BaseNode,
  });

  declare type NoTypeNode = {
    noPadding?: boolean;
    type?: null,
    ...BaseNode,
  };

  declare type ParagraphNode = {
    type: 'block-quote'
     | 'bulleted-list'
     | 'heading-one'
     | 'heading-two'
     | 'list-item'
     | 'numbered-list'
     | 'left-align'
     | 'right-align'
     | 'center-align'
     | 'horizontal-line'
     | 'paragraph',
    ...BaseNode
  };

  declare type SlateElementNode = (ParagraphNode
    | LinkNode
    | ImageVideoNode
    | BackgroundColorNode
    | NoTypeNode);

  declare type SlateNode = (SlateElementNode | SlateLeafNode);

  declare type BaseSlateRTEProps = {
    value: Array<SlateNode>,
    toolbarClassName?: string,
    onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
    className?: string,
    inputClassName?: string,
    options?: {
      // effectively specifies what 1em is equal to, based on the font-size
      // optional, defaults 1em = 16px
      defaultFontSizePx: number,
    },
    variables: { [variableName: string]: string },
  };

  declare export function getBackgroundColor(
    Array<SlateNode>,
  ): string | null;

  declare export function isEmpty(
    null | Array<SlateNode>,
  ): boolean;

  declare export function extractText(
    null | Array<SlateNode>,
  ): string;

  declare export function deserializeHTMLString(
    htmlString: string,
  ): Array<SlateNode>;

  declare export function parseAsHTML(
    slateContent: Array<SlateNode>,
    variables: { [variableName: string]: string },
  ): string;

  declare export default class SlateRTE extends React$Component<{|
    ...BaseSlateRTEProps,
    uploadFile?: (
      file: File, progressCallBack: (progress: number) => void,
    ) => Promise<null | FileT>,
    setValue: (value: Array<SlateNode>) => void,
    mode: 'Edit',
  |} | {|
    ...BaseSlateRTEProps,
    mode: 'Read-Only' | 'Minimal Read-Only' | 'PDF' | 'Minimal PDF',
  |}> {}
}
