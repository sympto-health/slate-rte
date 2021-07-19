import { SlateElementNode } from '../../SlateTypes';
import { SlateNode } from '../../SlateNode';

export const initialSlate = [
  ({
    type: 'background-color',
    color: '#f78da7',
    text: null,
    children: [
      {
        text: '',
      },
    ],
  } as SlateElementNode<SlateNode>),
  ({
    type: 'center-align',
    children: [
      {
        text: 'hi ',
        'font-size': {
          value: 22,
        },
        'text-color': {
          color: '#2980b9',
        },
        'font-weight': {
          value: 600,
        },
        bold: true,
      },
      {
        type: 'variable',
        variableName: 'foo',
        children: [
          {
            bold: true,
            text: '',
            'font-size': {
              value: 22,
            },
            'text-color': {
              color: '#2980b9',
            },
            'font-weight': {
              value: 600,
            },
            variable: {
              variableName: 'foo',
            },
          },
        ],
        text: null,
      },
      {
        text: ' thats cool',
        bold: true,
      },
    ],
  } as SlateElementNode<SlateNode>),
];

export const slateHTML = `<div class="SlateRTE d-flex flex-column justify-content-start text-left position-relative read-only p-3" style="background-color:#f78da7;font-size:1em"><div data-gramm="false" spellcheck="false" autoCorrect="false" autoCapitalize="false"   style="position:relative;outline:none;white-space:pre-wrap;word-wrap:break-word"><div data-color="#f78da7" style="background-color:#f78da7"></div><div  style="text-align:center"><span ><span ><span data-color="#2980b9" style="color:#2980b9"><span style="font-weight:600"><span style="font-size:1.375em"><span data-type="bold" style="font-weight:700">hi </span></span></span></span></span></span><span  data-variable="foo" class="d-inline-block" contenteditable="false"><span ><span ><span data-color="#2980b9" style="color:#2980b9"><span style="font-weight:600"><span style="font-size:1.375em"><span data-type="bold" style="font-weight:700"><span data-variable-leaf="foo">bar</span><span  >﻿<br/></span></span></span></span></span></span></span></span><span ><span ><span data-type="bold" style="font-weight:700"> thats cool</span></span></span></div></div></div>`;
