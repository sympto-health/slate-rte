import _ from 'lodash';
import { SlateNode } from './SlateNode'

const getBackgroundColor = (value: SlateNode[]): null | string => {
  const firstNode = _.head(value);
  return firstNode && firstNode.type === 'background-color' && firstNode.color != null  
    ? String(firstNode.color)
    : null;
}

export default getBackgroundColor;