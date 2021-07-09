import { Node, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomSlateNode, SlateElementNode, SlateLeafNode } from './SlateTypes';

export type ASCIIColor = string;

export type SlateNode = Node & CustomSlateNode< {
  children?: undefined | SlateNode[],
  text: null | string,
}>;

export type SlateEditorT = Omit<ReactEditor, 'children'> & {
  children: SlateNode[],
};

export const convertSlateEditor = (slateEditor: SlateEditorT): BaseEditor => (slateEditor as any);

export type BaseElementProps = { 
  children: Array<JSX.Element>,
  minimalFormatting: boolean,
  element: SlateElementNode<SlateNode>,
  onFileLoad?: (opts: { id: string }) => Promise<{ url: string }>,
};

export type BaseLeafProps = {
  children: Array<JSX.Element>,
  minimalFormatting: boolean,
  leaf: SlateLeafNode<SlateNode>,
};
