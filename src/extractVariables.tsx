import _ from 'lodash';
import { SlateNode } from './SlateNode'

export const extractVariables = (slateContent: SlateNode[]): Array<string> => (_.compact(_.flatten(
  (slateContent || [])
    .map((contentItem: SlateNode) => ([
      (contentItem.type === 'variable' ? contentItem.variableName : null),
      ...(contentItem.children ? extractVariables((contentItem.children as SlateNode[])) : []),
    ])))));


export default extractVariables;