import "core-js/stable";
import "regenerator-runtime/runtime";
// @ts-ignore
import rootNode from 'get-root-node-polyfill';
// @ts-ignore
import isImplemented from 'get-root-node-polyfill/is-implemented';

if (!isImplemented() && Node) {
  Object.defineProperty(Node.prototype, 'getRootNode', {
    enumerable: false,
    configurable: false,
    value: rootNode,
  });
}

import React from 'react'
import _ from 'lodash';
import { renderToStaticMarkup } from 'react-dom/server'
import getBackgroundColor from './getBackgroundColor';
import deserialize from './deserialize';
import loadImages from './AsyncFileLoadStore';
import { SlateNode } from './SlateNode';
import SlateController from './SlateController';
import './index.css';

export { getBackgroundColor };

export const parseAsHTML = async (
  slateContent: SlateNode[],
  variables: { [variableName: string]: string },
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
): Promise<string> => {
  const loadedImages = await loadImages(slateContent, onFileLoad);
  return renderToStaticMarkup(
    <SlateController
      loadedImages={loadedImages}
      variables={variables}
      mode="Read-Only"
      onFileLoad={onFileLoad}
      value={slateContent}
    />
  ).replace(/data-slate-[^"]*="[^"]*"/g, "");
};

export const deserializeHTMLString = (htmlString: string): SlateNode[] => {
  // remove all 0 width spaces
  const formattedHTMLString = htmlString.replace(/\uFEFF/g,'');
  const domData = new DOMParser().parseFromString(formattedHTMLString, 'text/html');
  return deserialize(domData.body);
};

export const extractVariables = (slateContent: SlateNode[]): Array<string> => (_.compact(_.flatten(
  (slateContent || [])
    .map((contentItem: SlateNode) => ([
      (contentItem.type === 'variable' ? contentItem.variableName : null),
      ...(contentItem.children ? extractVariables((contentItem.children as SlateNode[])) : []),
    ])))));

// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
export const extractText = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): string => (_.compact(_.flatten((slateContent || [])
  .map((contentItem: SlateNode) => ([
    (contentItem.text ? String(contentItem.text) : ' '),
    (contentItem.type === 'variable' ? variables[contentItem.variableName] : ''),
    ...(contentItem.children ? extractText((contentItem.children as null | SlateNode[]), variables) : []),
  ]))))).join('');

export const isEmpty = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): boolean => (extractText(slateContent, variables).trim().length === 0);

export default SlateController
