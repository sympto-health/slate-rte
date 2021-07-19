import React from 'react'
import _ from 'lodash';
import { renderToStaticMarkup } from 'react-dom/server'
import SlateRTE from './SlateRTE';
import getBackgroundColor from './getBackgroundColor';
import deserialize from './deserialize';
import { SlateNode } from './SlateNode';
import './index.css';

export { getBackgroundColor };

export const parseAsHTML = (
  slateContent: SlateNode[],
  variables: { [variableName: string]: string },
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
): string => (renderToStaticMarkup(
    <SlateRTE onFileLoad={onFileLoad} variables={variables} mode="Read-Only" value={slateContent} />
  ).replace(/data-slate-[^"]*="[^"]*"/g, ""));

export const deserializeHTMLString = (htmlString: string): SlateNode[] => {
  const domData = new DOMParser().parseFromString(htmlString, 'text/html')
  return deserialize(domData.body);
};

// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
export const extractText = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): string => (_.compact(_.flatten((slateContent || [])
  .map((contentItem: SlateNode) => ([
    (contentItem.text ? String(contentItem.text) : ' '),
    (contentItem.type === 'variable' ? variables[contentItem.variableName] : ''),
    ...(contentItem.children ? extractText((contentItem.children as null | SlateNode[]), variables) : []),
  ]))))).join('');

export const isEmpty = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): boolean => (extractText(slateContent, variables).trim().length === 0);

export default SlateRTE
