// @ts-nocheck
// TODO: Unit tests for this file
import { Descendant } from 'slate'
import _ from 'lodash';
import { jsx } from 'slate-hyperscript'

// https://github.com/ianstormtaylor/slate/blob/master/site/examples/paste-html.tsx#L42-L80

const BLOCK_TYPES = {
  BLOCKQUOTE: 'block-quote',
  UL: 'bulleted-list',
  H1: 'heading-one',
  H2: 'heading-two',
  LI: 'list-item',
  OL: 'numbered-list',
};

const parseChildren = (childNodes: Array<HTMLElement>) => {
  const childNodes = _.flatten(Array.from(childNodes)
    .map(deserialize));
  return childNodes.length === 0 ? [''] : childNodes;
};

const parseLeaf = (el: HTMLElement) => {
  const { style } = el;
  const children = parseChildren(el.childNodes);
  const fetchAttr = () => {
    if (el.nodeName === 'SPAN' && style.fontSize) {
      const fontSizePx = Number(style.fontSize.replace('em', '')) * 16.00;
      return { 'font-size': { value: fontSizePx } };
    }
    if (el.nodeName === 'SPAN' && style.fontWeight) {
      return { 'font-weight': { value: style.fontWeight } };
    }
    if (el.nodeName === 'SPAN' && style.color) {
      return { 'text-color': { color: style.color } };
    }
    if (el.nodeName === 'SPAN' && style.backgroundColor) {
      return { 'highlight-color': { color: style.backgroundColor } };
    }
    if (el.nodeName === 'SPAN') {
      return {};
    }
    if (el.nodeName === 'STRONG') {
      return { bold: true };
    }
    if (el.nodeName === 'CODE') {
      return { code: true };
    }
    if (el.nodeName === 'EM') {
      return { italic: true };
    }
    if (el.nodeName === 'U') {
      return { underline: true };
    }
    return null;
  };
  const attrs = fetchAttr();
  return attrs ? children.map(child => jsx('text', attrs, child)) : null;

};

const deserialize = (el: HTMLElement): Descendant[] => {
  if (el.nodeType === 3) {
    return el.textContent
  } 
  if (el.nodeType !== 1) {
    return null 
  }  
  if (el.nodeName === 'BR') {
    return ''
  }
  const children = parseChildren(el.childNodes);

  // main divs
  if (el.nodeName === 'BODY' || el.className.includes('SlateRTE') || el.getAttribute('data-gramm') != null) {
    return jsx('fragment', {}, children)
  }
  const leafParse = parseLeaf(el);
  if (leafParse) {
    return leafParse;
  }

  if (BLOCK_TYPES[el.nodeName]) {
    return jsx('element', { type: BLOCK_TYPES[el.nodeName] }, children);
  }
  if (el.nodeName === 'DIV' && el.style.textAlign === 'left') {
    return jsx('element', { type: 'left-align' }, children);
  }
  if (el.nodeName === 'DIV' && el.style.textAlign === 'right') {
    return jsx('element', { type: 'right-align' }, children);
  }
  if (el.nodeName === 'DIV' && el.style.textAlign === 'center') {
    return jsx('element', { type: 'center-align' }, children);
  }
  if (el.nodeName === 'DIV' && el.style.paddingBottom === '1rem') {
    return jsx('element', { type: 'paragraph' }, children);
  }
  if (el.nodeName === 'DIV' && el.style.paddingBottom === '0.01rem') {
    return jsx('element', { type: 'paragraph', noPadding: true }, children);
  }
  if (el.nodeName === 'DIV' && el.className.length === 0 && el.childNodes.length === 0) {
    return jsx('element', { type: 'background-color', color: el.style.backgroundColor }, children);
  }
  if (el.nodeName === 'A') {
    return jsx('element', { type: 'link', url: el.getAttribute('href') }, children);
  }
  const matchFirstChildNode = (curEl, matchProperties) => {
    if (curEl.childNodes.length > 0) {
      const childNode = curEl.childNodes[0];
      return _.toPairs(matchProperties).every(([property, value]) => (
        childNode[property] === value
      ));
    }
    return false;
  }
  if (el.nodeName === 'DIV' && matchFirstChildNode(el, { nodeName: 'HR' })) {
    return jsx('element', { type: 'horizontal-line' }, parseChildren(_.tail(el.childNodes)) );
  }
  
  if (el.nodeName === 'DIV' && el.className === 'd-inline-block'
    && matchFirstChildNode(el, { nodeName: 'DIV', className: 'd-inline-block' })
    && matchFirstChildNode(el.childNodes[0], { nodeName: 'IMG' })) {
    const imgCont = el.childNodes[0];
    const img = el.childNodes[0].childNodes[0];
    return jsx('element', { type: 'image', url: img.src }, parseChildren(_.tail(imgCont)) );
  }

  return jsx('element', { type: 'paragraph' }, children);
}

const deserializeBody = (el: HTMLElement): Descendant[] => {
  const deserializedHTML = deserialize(el);
  return deserializedHTML.length === 0 || deserializedHTML[0].type == null 
    ? [{ type: 'paragraph', noPadding: true, children: deserializedHTML }]
    : deserializedHTML;
};

export default deserializeBody;
