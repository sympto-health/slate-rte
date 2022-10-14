import _ from 'lodash';
import { SlateNode } from './SlateNode'

const findBackgroundColorNode = (value: SlateNode[]) => {
  const firstNode = _.head(value);
  return firstNode && firstNode.type === 'background-color' && firstNode.color != null
    ? firstNode
    : null;
}

const getBackgroundColor = (value: SlateNode[]): null | string => {
  const node = findBackgroundColorNode(value);
  return node != null ? String(node.color) : null;
}

export const getBorderColor = (value: SlateNode[]): null | string => {
  const node = findBackgroundColorNode(value);
  return node != null && node.borderColor != null ? String(node.borderColor) : null;
}

export default getBackgroundColor;
