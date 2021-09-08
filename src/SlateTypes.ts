export type ASCIIColor = string;

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
  // only a leaf as a child for a variable item
  variable: {
    variableName: string,
  },
};


type BaseLeafNode<T> = {
  bold: undefined,
  'font-size': undefined,
  type: undefined,
  code: undefined,
  italic: undefined,
  underline: undefined,
  'font-weight': undefined,
  'text-color': undefined,
  'highlight-color': undefined,
  'variable': undefined,
} & T;

export type FileT = { type: 'URL', url: string } | { type: 'Image ID', id: string };

export type EmptySlateNode<T> = ({ text: string, children?: T[] } & BaseLeafNode<T>);
export type SlateLeafNode<T> = {
  type?: null,
  bold?: null | LeafStyles['bold'],
  'font-size'?: null | LeafStyles['font-size'],
  code?: null | LeafStyles['code'],
  italic?: null | LeafStyles['italic'],
  underline?: null | LeafStyles['underline'],
  'font-weight'?: null | LeafStyles['font-weight'],
  'text-color'?: null | LeafStyles['text-color'],
  'highlight-color'?:  null | LeafStyles['highlight-color'],
  variable?: null | LeafStyles['variable'],
  text?: null | unknown | string,
  children?: T[],
} & T;

export type LinkNode<T> = ({
  type: 'link',
  url: string,
}) & T;

export type ImageVideoNode<T> = ({
  type: 'image' | 'video',
  url: string,
  width?: number, // px
  height?: number, // px
} | {
  type: 'image' | 'video',
  fileData: { type: 'Image ID', id: string },
  width?: number, // px
  height?: number, // px
}) & T;

export type BackgroundColorNode<T> = ({
  type: 'background-color',
  color: string,
} & T);

export type VariableNode<T> = ({
  type: 'variable',
  variableName: string,
} & T);

export type SlateElementNode<T> = (
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
  } & T)
  | LinkNode<T>
  | ImageVideoNode<T>
  | BackgroundColorNode<T>
  | VariableNode<T>
  | ({
    noPadding?: boolean;
    type: undefined,
  } & T);

export type CustomSlateNode<T> = (SlateElementNode<T> | SlateLeafNode<T>);
