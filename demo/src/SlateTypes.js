/* @flow */
// ensure these types are equivalent to the module flow types
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
  variable: {
    variableName: string,
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
  variable?: $PropertyType<LeafStyles, 'variable'>,
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

declare type VariableNode = ({
  type: 'variable',
  variableName: string,
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
  | NoTypeNode
  | VariableNode);

type SlateNode = (SlateElementNode | SlateLeafNode);

export type SlateContentItem = SlateNode;
