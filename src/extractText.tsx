import _ from 'lodash';
import { SlateNode } from './SlateNode'

// iterates through every single slate item and children and stringifies everything by extracting
// all teh text
const extractText = (
  slateContent: null | SlateNode[], variables: { [variableName: string]: string }, includeNewLines: undefined | boolean = false,
): string => (_.compact(_.flatten((slateContent || [])
  .map((contentItem: SlateNode) => ([
  	(includeNewLines && contentItem.type != null ? '\n' : ''),
    (contentItem.text ? String(contentItem.text) : ' '),
    (contentItem.type === 'variable' ? variables[contentItem.variableName] : ''),
    ...(contentItem.children ? extractText((contentItem.children as null | SlateNode[]), variables, includeNewLines) : []),
  ]))))).join('');



export default extractText;
