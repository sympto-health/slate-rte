import { SlateElementNode } from '../../SlateTypes';
import { SlateNode } from '../../SlateNode';

export const initialSlate = [
  ({
    type: 'background-color',
    color: '#ecf0f1',
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
        text: 'DASH DISABILITY ',
        'font-size': {
          value: 16,
        },
        'font-weight': {
          value: 300,
        },
      },
    ],
  } as SlateElementNode<SlateNode>),
  ({
    type: 'center-align',
    children: [
      {
        text: '& SYMPTOM SCORE',
        'font-size': {
          value: 16,
        },
        'font-weight': {
          value: 300,
        },
      },
    ],
  } as SlateElementNode<SlateNode>),
  ({
    type: 'center-align',
    children: [
      {
        bold: true,
        text: '0.83',
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
    ],
  } as SlateElementNode<SlateNode>),
];

// with data-color attribute
export const parsedBackground = `<div class="SlateRTE d-flex flex-column justify-content-start text-left position-relative read-only p-3" style="background-color:#ecf0f1;font-size:1em"><div data-gramm="false" spellcheck="false" autoCorrect="false" autoCapitalize="false"   style="position:relative;outline:none;white-space:pre-wrap;word-wrap:break-word"><div data-color="#ecf0f1" style="background-color:#ecf0f1"></div><div  style="text-align:center"><span ><span ><span style="font-weight:300"><span style="font-size:1em">DASH DISABILITY </span></span></span></span></div><div  style="text-align:center"><span ><span ><span style="font-weight:300"><span style="font-size:1em">&amp; SYMPTOM SCORE</span></span></span></span></div><div  style="text-align:center"><span ><span ><span data-color="#2980b9" style="color:#2980b9"><span style="font-weight:600"><span style="font-size:1.375em"><span data-type="bold" style="font-weight:700">0.83</span></span></span></span></span></span></div></div></div>`;

// ensure that colors still work even without data-color attribute
export const deprecatedParsedBackground = `<div class="SlateRTE d-flex flex-column justify-content-start text-left position-relative read-only p-3" style="background-color:#ecf0f1;font-size:1em"><div data-gramm="false" spellcheck="false" autoCorrect="false" autoCapitalize="false"   style="position:relative;outline:none;white-space:pre-wrap;word-wrap:break-word"><div style="background-color:#ecf0f1"></div><div  style="text-align:center"><span ><span ><span style="font-weight:300"><span style="font-size:1em"><span >DASH DISABILITY </span></span></span></span></span></div><div  style="text-align:center"><span ><span ><span style="font-weight:300"><span style="font-size:1em"><span >&amp; SYMPTOM SCORE</span></span></span></span></span></div><div  style="text-align:center"><span ><span ><span style="color:#2980b9"><span style="font-weight:600"><span style="font-size:1.375em"><span data-type="bold" style="font-weight:700"><span >0.83</span></span></span></span></span></span></span></div></div></div>`;

export const deprecatedSlateResp = [
  ({
    ...initialSlate[0],
    color: 'rgb(236, 240, 241)',
  } as SlateElementNode<SlateNode>),
  initialSlate[1],
  initialSlate[2],
  ({
    type: 'center-align',
    children: [
      {
        bold: true,
        text: '0.83',
        'font-size': {
          value: 22,
        },
        'text-color': {
          color: 'rgb(41, 128, 185)',
        },
        'font-weight': {
          value: 600,
        },
      },
    ],
  } as SlateElementNode<SlateNode>),
];
