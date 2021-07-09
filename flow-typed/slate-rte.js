declare module 'slate-rte' {
  import type {
    Node, Element, Component, ComponentType, Ref,
  } from 'react';

  declare type FileT = { type: 'URL', url: string } | { type: 'Image ID', id: string };

  declare type ASCIIColor = string;

  declare type BaseNode = {
    children?: undefined | Array<SlateNode>,
    text: null | string,
  };
  declare type LeafStyles = {
    bold: boolean,
    'font-size': {
      value: number,
    },
    type: undefined,
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


  declare type BaseLeafNode = {
    bold: undefined,
    'font-size': undefined,
    type: undefined,
    code: undefined,
    italic: undefined,
    underline: undefined,
    'font-weight': undefined,
    'text-color': undefined,
    'highlight-color': undefined,
  } & BaseNode;

  declare type EmptySlateNode = ({ text: string, children?: Array<BaseNode> } & BaseLeafNode);
  declare type SlateLeafNode = (
    {
      'font-size': $PropertyType<LeafStyles, 'font-size'>,
    } & Omit<BaseLeafNode, 'font-size'>)
    | ({
      bold: $PropertyType<LeafStyles, 'bold'>,
    } & Omit<BaseLeafNode, 'bold'>)
    | ({
      code: $PropertyType<LeafStyles, 'code'>,
    } & Omit<BaseLeafNode, 'code'>)
    | ({
      italic: $PropertyType<LeafStyles, 'italic'>,
    } & Omit<BaseLeafNode, 'italic'>)
    | ({
      underline: $PropertyType<LeafStyles, 'underline'>,
    } & Omit<BaseLeafNode, 'underline'>)
    | ({
      'font-weight': $PropertyType<LeafStyles, 'font-weight'>,
    } & Omit<BaseLeafNode, 'font-weight'>)
    | ({
      'text-color': $PropertyType<LeafStyles, 'text-color'>,
    } & Omit<BaseLeafNode, 'text-color'>)
    | ({
      'highlight-color': $PropertyType<LeafStyles, 'highlight-color'>,
    } & Omit<BaseLeafNode, 'highlight-color'>)
    | EmptySlateNode;

  declare type LinkNode = ({
    type: 'link',
    url: string,
  }) & BaseNode;

  declare type ImageVideoNode = ({
    type: 'image' | 'video',
    url: string,
  } | {
    type: 'image' | 'video',
    fileData: { type: 'Image ID', id: string },
  }) & BaseNode;

  declare type BackgroundColorNode = ({
    type: 'background-color',
    color: string,
  } & BaseNode);

  declare type SlateElementNode = (
    {
      type: 'block-quote'
       | 'bulleted-list'
       | 'heading-one'
       | 'heading-two'
       | 'list-item'
       | 'numbered-list'
       | 'left-align'
       | 'right-align'
       | 'center-align'
       | 'horizontal-line',
    } & BaseNode)
    | LinkNode
    | ImageVideoNode
    | BackgroundColorNode
    | ({
      noPadding?: boolean;
      type: undefined,
    } & BaseNode);

  declare type SlateNode = (SlateElementNode | SlateLeafNode);

  declare type BaseSlateRTEProps = {
    value: Array<SlateNode>,
    setValue: (value: Array<SlateNode>) => void,
    toolbarClassName?: string,
    onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
    className?: string,
    inputClassName?: string,
    options?: {
      // effectively specifies what 1em is equal to, based on the font-size
      // optional, defaults 1em = 16px
      defaultFontSizePx: number,
    },
  };

  declare export default class SlateRTE extends React$Component<{
    ...BaseSlateRTEProps,
    uploadFile?: (
      file: File, progressCallBack: (progress: number) => void,
    ) => Promise<null | FileT>,
    mode: 'Read-Only' | 'Minimal Read-Only' | 'PDF' | 'Minimal PDF' | 'Edit',
  }> {}
}
