import _ from 'lodash';
import { SlateNode } from './SlateNode'

const DEFAULT_EM_SIZE = 16;

// font size only counts if has text in it or if font size explicitly stated
const fetchFontSize = (slateContent: SlateNode): number | null => {
  if (slateContent.text != null && (
    slateContent.text.trim().length > 0 || slateContent['font-size']
  )) {
    return slateContent['font-size']  
      ? slateContent['font-size'].value
      : DEFAULT_EM_SIZE;
  }
  return null;
};

const extractFontSizes = (slateContent: null | SlateNode[]): Array<number> => {
  const fontSizes: Array<number> = _.compact(_.flatten((slateContent || [])
    .map((contentItem: SlateNode) => ([
      fetchFontSize(contentItem),
      ...(contentItem.children 
        ? extractFontSizes((contentItem.children as null | SlateNode[]))
        : []),
    ]))));
  return fontSizes;
};


// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
const extractMinMaxFontSize = (slateContent: null | SlateNode[]): {
  minFontSize: number, maxFontSize: number,
} | null => {
  const fontSizes: Array<number> = extractFontSizes(slateContent);
  return fontSizes.length > 0 
    ? {
      minFontSize: _.min(fontSizes) || DEFAULT_EM_SIZE,
      maxFontSize: _.max(fontSizes) || DEFAULT_EM_SIZE, 
    }
    : null;
}

export default extractMinMaxFontSize;
