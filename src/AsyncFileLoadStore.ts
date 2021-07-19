/* @flow */
import _ from 'lodash';
import { SlateNode } from './SlateNode';
import { ImageVideoNode } from './SlateTypes';

const fetchFileIds = (slateContent: SlateNode[]): Array<string> => {
  const allNodes = _.compact(_.flatten((slateContent || []).map((nodeData) => ([
    nodeData, ...(nodeData.children || []),
  ]))));
  return _.compact(allNodes.map((contentItem: SlateNode) => {
    if (contentItem.type === 'image' || contentItem.type === 'video') {
      const fileNode: ImageVideoNode<SlateNode> = contentItem;
      return !('url' in fileNode) ? fileNode.fileData.id : null;
    }
    return null;
  }));
}

const loadImages = async (
  slateContent: SlateNode[],
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
): Promise<{
  // maps to url
  [fileId: string]: string,
}> => {
 const fileIds = fetchFileIds(slateContent);
  console.log(fileIds);
  const hydratedFileData = await Promise.all(_.uniq(fileIds).map(async fileId => ({
    fileId,
    fileData: await onFileLoad({ id: fileId }),
  })))
  const fileMapping = _.keyBy(hydratedFileData, 'fileId');
  const simplifiedFileMapping: Array<[string, string]> = _.toPairs(fileMapping)
    .map(([fileId, { fileData }]) => (
      [fileId, fileData.url]
    ));
  console.log(simplifiedFileMapping);
  return _.fromPairs(simplifiedFileMapping);
};


export default loadImages;
