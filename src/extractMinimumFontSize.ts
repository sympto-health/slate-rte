import _ from 'lodash';
import { SlateNode } from './SlateNode'

const DEFAULT_EM_SIZE = 16;

// font size only counts if has text in it
const fetchFontSize = (slateContent: SlateNode): number | null => {
  if (slateContent.text != null && slateContent.text.trim().length > 0) {
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
