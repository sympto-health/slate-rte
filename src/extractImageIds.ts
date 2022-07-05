import _ from 'lodash';
import { SlateNode } from './SlateNode'

export const extractImageIds = (slateContent: SlateNode[]): Array<string> => (_.compact(_.flatten(
  (slateContent || [])
    .map((contentItem: SlateNode) => ([
      ((contentItem.type === 'image' || contentItem.type === 'video')  && contentItem.fileData != null ? contentItem.fileData.id : null),
      ...(contentItem.children ? extractImageIds((contentItem.children as SlateNode[])) : []),
    ])))));


export default extractImageIds;
