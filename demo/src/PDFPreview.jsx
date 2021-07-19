/* @flow */
import React from "react";
import SlateRTE from 'slate-rte';
import type { SlateNode } from 'slate-rte';
import { Card } from 'react-bootstrap';
import {
  Document, Page, PDFViewer, Font, View,
} from '@react-pdf/renderer';
import Nunito300 from './fonts/NunitoSans_300.ttf';
import Nunito300Italic from './fonts/NunitoSans_300_italic.ttf';
import Nunito400 from './fonts/NunitoSans_400.ttf';
import Nunito400Italic from './fonts/NunitoSans_400_italic.ttf';
import Nunito700 from './fonts/NunitoSans_700.ttf';
import Nunito700Italic from './fonts/NunitoSans_700_italic.ttf';
import Nunito800 from './fonts/NunitoSans_800.ttf';
import Nunito800Italic from './fonts/NunitoSans_800_italic.ttf';
import Nunito900 from './fonts/NunitoSans_900.ttf';
import Nunito900Italic from './fonts/NunitoSans_900_italic.ttf';
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
    { src: Nunito800, fontWeight: 800 },
    { src: Nunito800Italic, fontWeight: 800, fontStyle: 'italic' },
    { src: Nunito900, fontWeight: 900 },
    { src: Nunito900Italic, fontWeight: 900, fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'monospace',
  src: RobotoMono,
});

const PDFPreview = ({
  defaultFontSize, value, mode, onFileLoad, variables,
}: {
  defaultFontSize?: ?number,
  value: Array<SlateNode>,
  mode: 'PDF' | 'Minimal PDF',
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
  variables: { [variableName: string]: string },
}) => (
  <Card className="m-3 shadow-sm">
    <PDFViewer>
      <Document>
        <Page style={{ fontFamily: 'Nunito' }}>
          <View style={{ padding: 10 }}>
            <SlateRTE
              variables={variables}
              onFileLoad={onFileLoad}
              options={defaultFontSize ? { defaultFontSizePx: defaultFontSize || 20 } : null}
              mode={mode}
              value={value}
            />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  </Card>
);

PDFPreview.defaultProps = {
  defaultFontSize: null,
};

export default PDFPreview;
