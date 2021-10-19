import "core-js/stable";
import "regenerator-runtime/runtime";
import 'get-root-node-polyfill/implement';

import React from 'react'
import _ from 'lodash';
import { getBackgroundColor, extractVariables, extractText } from './utils';
import { renderToStaticMarkup } from 'react-dom/server'
import deserialize from './deserialize';
import loadImages from './AsyncFileLoadStore';
import extractMinimumFontSize from './extractMinimumFontSize';
import { SlateNode } from './SlateNode';
import SlateController from './SlateController';
import './index.css';

export { 
  extractMinimumFontSize, getBackgroundColor, extractVariables, extractText,
};

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

export const isEmpty = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): boolean => (extractText(slateContent, variables).trim().length === 0);

export default SlateController
