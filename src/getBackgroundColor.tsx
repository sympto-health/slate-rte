import { Node } from 'slate'
import _ from 'lodash';

const getBackgroundColor = (value: Node[]): null | string => {
  const firstNode = _.head(value);
  return firstNode && firstNode.type === 'background-color' && firstNode.color != null  
    ? String(firstNode.color)
    : null;
}

export default getBackgroundColor;