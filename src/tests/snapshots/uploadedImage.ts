import { SlateElementNode } from '../../SlateTypes';
import { SlateNode } from '../../SlateNode';

export const initialSlate = [
  ({
    type: 'background-color',
    color: '#ecf0f1',
    children: [
      {
        text: '',
      },
    ],
    text: null,
  } as SlateElementNode<SlateNode>),
  ({
    type: 'center-align',
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
      },
      {
        type: 'image',
        text: null,
        children: [
          {
            text: ' ',
          },
        ],
        fileData: {
          type: 'Image ID',
          id: 'd2ae024b-5105-4967-82d5-b0c6d2911105',
        },
      },
      {
        text: '',
        zavala: 22,
      },
    ],
  } as SlateElementNode<SlateNode>),
];


export const slateHTML = `<div class="SlateRTE d-flex flex-column justify-content-start text-left position-relative read-only p-3" style="background-color:#ecf0f1;font-size:1em"><div data-gramm="false" spellcheck="false" autoCorrect="false" autoCapitalize="false"   style="position:relative;outline:none;white-space:pre-wrap;word-wrap:break-word"><div data-color="#ecf0f1" style="background-color:#ecf0f1"></div><div  style="text-align:center"><span ><span ><span data-color="#2980b9" style="color:#2980b9"><span style="font-weight:600"><span style="font-size:1.375em"><span data-type="bold" style="font-weight:700"><span  >﻿</span></span></span></span></span></span></span><div    data-type="image" class="d-inline-block"><div contenteditable="false"><img data-image-id="d2ae024b-5105-4967-82d5-b0c6d2911105" alt="Uploaded Image" src="a" class="image-item d-inline-block"/></div></div><span ><span ><span  >﻿<br/></span></span></span></div></div></div>`
