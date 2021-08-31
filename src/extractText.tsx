import _ from 'lodash';
import { SlateNode } from './SlateNode'

// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
const extractText = (slateContent: null | SlateNode[], variables: { [variableName: string]: string }): string => (_.compact(_.flatten((slateContent || [])
  .map((contentItem: SlateNode) => ([
    (contentItem.text ? String(contentItem.text) : ' '),
    (contentItem.type === 'variable' ? variables[contentItem.variableName] : ''),
    ...(contentItem.children ? extractText((contentItem.children as null | SlateNode[]), variables) : []),
  ]))))).join('');



export default extractText;
