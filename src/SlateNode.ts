import { Node, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export type ASCIIColor = string;

type BaseNode = {
  children?: undefined | SlateNode[],
  text: null | string,
};

type LeafStyles = {
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


type BaseLeafNode = {
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

export type FileT = { type: 'URL', url: string } | { type: 'Image ID', id: string };

export type EmptySlateNode = ({ text: string, children?: SlateNode[] } & BaseLeafNode);
export type SlateLeafNode = (
  {
    'font-size': LeafStyles['font-size'],
  } & Omit<BaseLeafNode, 'font-size'>) 
  | ({
    bold: LeafStyles['bold'],
  } & Omit<BaseLeafNode, 'bold'>) 
  | ({
    code: LeafStyles['code'],
  } & Omit<BaseLeafNode, 'code'>) 
  | ({
    italic: LeafStyles['italic'],
  } & Omit<BaseLeafNode, 'italic'>) 
  | ({
    underline: LeafStyles['underline'],
  } & Omit<BaseLeafNode, 'underline'>) 
  | ({
    'font-weight': LeafStyles['font-weight'],
  } & Omit<BaseLeafNode, 'font-weight'>)
  | ({
    'text-color': LeafStyles['text-color'],
  } & Omit<BaseLeafNode, 'text-color'>)
  | ({
    'highlight-color': LeafStyles['highlight-color'],
  } & Omit<BaseLeafNode, 'highlight-color'>)
  | EmptySlateNode;

export type LinkNode = ({
  type: 'link',
  url: string,
}) & BaseNode;

export type ImageVideoNode = ({
  type: 'image' | 'video',
  url: string,
} | {
  type: 'image' | 'video',
  fileData: { type: 'Image ID', id: string },
}) & BaseNode;

export type BackgroundColorNode = ({
  type: 'background-color',
  color: string,
} & BaseNode);

export type SlateElementNode = (
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

export type SlateNode = Node & (
  SlateElementNode | SlateLeafNode);

export type SlateEditorT = Omit<ReactEditor, 'children'> & {
  children: SlateNode[],
};

export const convertSlateEditor = (slateEditor: SlateEditorT): BaseEditor => (slateEditor as any);

export type BaseElementProps = { 
  children: Array<JSX.Element>,
  minimalFormatting: boolean,
  element: SlateElementNode,
  onFileLoad?: (opts: { id: string }) => Promise<{ url: string }>,
};

export type BaseLeafProps = {
  children: Array<JSX.Element>,
  minimalFormatting: boolean,
  leaf: SlateLeafNode,
};
