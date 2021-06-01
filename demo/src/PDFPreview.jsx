import React from "react";
import SlateRTE  from "slate-rte";
import { Card } from 'react-bootstrap';
import {
  Document, Page, PDFViewer, Font,
} from '@react-pdf/renderer';
import Nunito300 from './fonts/NunitoSans_300.ttf';
import Nunito300Italic from './fonts/NunitoSans_300_italic.ttf';
import Nunito400 from './fonts/NunitoSans_400.ttf';
import Nunito400Italic from './fonts/NunitoSans_400_italic.ttf';
import Nunito700 from './fonts/NunitoSans_700.ttf';
import Nunito700Italic from './fonts/NunitoSans_700_italic.ttf';
import RobotoMono from './fonts/RobotoMono.ttf';

Font.register({
  family: 'Nunito',
  fonts: [
    { src: Nunito400 },
    { src: Nunito400Italic, fontStyle: 'italic' },
    { src: Nunito300, fontWeight: 300 },
    { src: Nunito300Italic, fontWeight: 300, fontStyle: 'italic' },
    { src: Nunito700, fontWeight: 700 },
    { src: Nunito700Italic, fontWeight: 700, fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'monospace',
  src: RobotoMono,
});

const PDFPreview = ({ value, mode }: { value: any[], mode: 'Minimal PDF' | 'PDF '}) => (
  <Card className="m-3 shadow-sm">
    <PDFViewer>
      <Document>
        <Page style={{ fontFamily: 'Nunito' }}>
          <SlateRTE key={JSON.stringify(value)} options={{ defaultFontSizePx: 20 }} mode={mode} value={value} />
        </Page>
      </Document>
    </PDFViewer>
  </Card>
);


export default PDFPreview;