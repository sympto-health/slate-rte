import { Node, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

type ASCIIColor = string;

type BaseNode = {
  children?: undefined | SlateNode[],
  text: null | string,
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

export type EmptySlateNode = ({ text: string, children?: SlateNode[] } & BaseLeafNode);
export type SlateLeafNode = (
  {
    'font-size': {
      value: number,
    },
  } & Omit<BaseLeafNode, 'font-size'>) 
  | ({
    bold: boolean,
  } & Omit<BaseLeafNode, 'bold'>) 
  | ({
    code: boolean,
  } & Omit<BaseLeafNode, 'code'>) 
  | ({
    italic: boolean,
  } & Omit<BaseLeafNode, 'italic'>) 
  | ({
    underline: boolean,
  } & Omit<BaseLeafNode, 'underline'>) 
  | ({
    'font-weight': {
      value: number,
    },
  } & Omit<BaseLeafNode, 'font-weight'>)
  | ({
    'text-color': {
      color: ASCIIColor,
    },
  } & Omit<BaseLeafNode, 'text-color'>)
  | ({
    'highlight-color': {
      color: ASCIIColor,
    },
  } & Omit<BaseLeafNode, 'highlight-color'>)
  | EmptySlateNode;

export type LinkNode = {
  type: 'link' | 'image' | 'video',
  url: string,
} & BaseNode;

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
};

export type BaseLeafProps = {
  children: Array<JSX.Element>,
  minimalFormatting: boolean,
  leaf: SlateLeafNode,
};
