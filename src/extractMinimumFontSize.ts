import _ from 'lodash';
import { SlateNode } from './SlateNode'

const DEFAULT_EM_SIZE = 16;

const fetchFontSize = (slateContent: SlateNode): number | null => {
  if (slateContent.text != null) {
    return slateContent['font-size']  
      ? slateContent['font-size'].value
      : DEFAULT_EM_SIZE;
  }
  return null;
};


// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
const extractMinimumFontSize = (slateContent: null | SlateNode[]): number | null => (
  _.min(_.flatten((slateContent || [])
    .map((contentItem: SlateNode) => ([
      fetchFontSize(contentItem),
      contentItem.children 
        ? extractMinimumFontSize((contentItem.children as null | SlateNode[])) 
        : null,
    ])))) || null);

export default extractMinimumFontSize;
