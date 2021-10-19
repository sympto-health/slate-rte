// @ts-nocheck
import _ from 'lodash';
import { SlateNode } from './SlateNode';
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
  const deserializedNodes = _.flatten(Array.from(childNodes)
    .map(deserialize));
  return deserializedNodes.length === 0 ? [''] : deserializedNodes;
};

const parseLeaf = (el: HTMLElement) => {
  const { style } = el;
  const appliedStyleFuncs = [
    () => {
      if (el.nodeName === 'SPAN' && style.fontSize) {
        const fontSizePx = Number(style.fontSize.replace('em', '')) * 16.00;
        return { 'font-size': { value: fontSizePx } };
      }
      return null;
    },
    () => {
      if (el.nodeName === 'SPAN' && style.fontWeight) {
        const fontWeight = Number(style.fontWeight);
        const isBold = el.getAttribute('data-type') === 'bold';
        return isBold
          ? { bold: true }
          : { 'font-weight': { value: fontWeight } };
      }
      return null;
    },
    () => {
      if (el.nodeName === 'SPAN' && style.color) {
        const targetColor = el.getAttribute('data-color')
          ? el.getAttribute('data-color')
          : style.color;
        return { 'text-color': { color: targetColor } };
      }
      return null;
    },
    () => {
      if (el.nodeName === 'SPAN' && style.backgroundColor) {
        const targetColor = el.getAttribute('data-color')
          ? el.getAttribute('data-color')
          : style.color;
        return { 'highlight-color': { color: targetColor } };
      }
      return null;
    },
    () => {
      if (el.nodeName === 'SPAN' && el.getAttribute('data-variable-leaf')) {
        return { text: '', variable: { variableName: el.getAttribute('data-variable-leaf') } };
      }
      return null;
    },
    () => (el.nodeName === 'STRONG' ? { bold: true } : null),
    () => (el.nodeName === 'CODE' ? { code: true } : null),
    () => (el.nodeName === 'EM' ? { italic: true } : null),
    () => (el.nodeName === 'U' ? { underline: true } : null),
    () => (el.nodeName === 'SPAN' ? {} : null),
  ];
  const attrs = appliedStyleFuncs.reduce((allStyles: ?{ [string]: string }, appliedStyleFunc) => (
    appliedStyleFunc() != null
      ? {
        ...(allStyles || {}),
        ...appliedStyleFunc(),
      }
      : allStyles
  ), null);

  const nodeData = attrs
    ? parseChildren(el.childNodes).map((child) => jsx('text', attrs, child))
    : null;
  return nodeData;
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
  if (el.nodeName === 'SPAN' && el.getAttribute('data-variable') != null) {
    return jsx('element', { type: 'variable', variableName: el.getAttribute('data-variable'), text: null }, children);
  }
  const leafData = parseLeaf(el);
  if (leafData) {
    return leafData;
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
  if (el.nodeName === 'DIV' 
     && _.isEqual(_.sortBy(el.className.split(' ')), _.sortBy(['d-inline-block', 'image-item']))
    && el.getAttribute('data-type') === 'image') {
     
    const img = el.childNodes[0];
    const imgData = img.getAttribute('data-image-id') != null
      ? {
        fileData: {
          type: 'Image ID',
          id: img.getAttribute('data-image-id'),
        },
      }
      : { url: img.src };
    return jsx('element', { ...imgData, type: 'image', text: null }, [{ text: ' '}]);
  }
  if (el.nodeName === 'DIV' && el.className.length === 0 && el.childNodes.length === 0) {
    const targetColor = el.getAttribute('data-color')
      ? el.getAttribute('data-color')
      : el.style.backgroundColor;
    return jsx('element', { type: 'background-color', color: targetColor }, children);
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
  return jsx('element', { type: 'paragraph' }, children);
}

const deserializeBody = (el: HTMLElement): SlateNode[] => {
  const deserializedHTML = deserialize(el);
  return deserializedHTML.length === 0 || deserializedHTML[0].type == null
    ? [{ type: 'paragraph', noPadding: true, children: deserializedHTML }]
    : deserializedHTML;
};

export default deserializeBody;
