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
} & T;

export type FileT = { type: 'URL', url: string } | { type: 'Image ID', id: string };

export type EmptySlateNode<T> = ({ text: string, children?: T[] } & BaseLeafNode<T>);
export type SlateLeafNode<T> = (
  {
    'font-size': LeafStyles['font-size'],
  } & Omit<BaseLeafNode<T>, 'font-size'>) 
  | ({
    bold: LeafStyles['bold'],
  } & Omit<BaseLeafNode<T>, 'bold'>) 
  | ({
    code: LeafStyles['code'],
  } & Omit<BaseLeafNode<T>, 'code'>) 
  | ({
    italic: LeafStyles['italic'],
  } & Omit<BaseLeafNode<T>, 'italic'>) 
  | ({
    underline: LeafStyles['underline'],
  } & Omit<BaseLeafNode<T>, 'underline'>) 
  | ({
    'font-weight': LeafStyles['font-weight'],
  } & Omit<BaseLeafNode<T>, 'font-weight'>)
  | ({
    'text-color': LeafStyles['text-color'],
  } & Omit<BaseLeafNode<T>, 'text-color'>)
  | ({
    'highlight-color': LeafStyles['highlight-color'],
  } & Omit<BaseLeafNode<T>, 'highlight-color'>)
  | EmptySlateNode<T>;

export type LinkNode<T> = ({
  type: 'link',
  url: string,
}) & T;

export type ImageVideoNode<T> = ({
  type: 'image' | 'video',
  url: string,
} | {
  type: 'image' | 'video',
  fileData: { type: 'Image ID', id: string },
}) & T;

export type BackgroundColorNode<T> = ({
  type: 'background-color',
  color: string,
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
  | ({
    noPadding?: boolean;
    type: undefined,
  } & T);

export type CustomSlateNode<T> = (SlateElementNode<T> | SlateLeafNode<T>);
