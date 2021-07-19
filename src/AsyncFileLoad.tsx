import React, { useState, useEffect } from 'react'
import { SlateNode } from './SlateNode';
import { ImageVideoNode } from './SlateTypes';

const extractImageURL = (
  nodeData: ImageVideoNode<SlateNode>,
  loadedImages?: { [fileId: string]: string }, // mapping of file id to url
) => {
  if ('url' in nodeData) {
    return { url: nodeData.url, id: null };
  }
  if (loadedImages && loadedImages[nodeData.fileData.id]) {
    return { url: loadedImages[nodeData.fileData.id], id: nodeData.fileData.id };
  }
  return null;
}

const AsyncFileLoad = ({
  onFileLoad, nodeData, children, loadedImages,
}: {
  onFileLoad: (fileData: { id: string }) => Promise<{ url: string }>,
  nodeData: ImageVideoNode<SlateNode>,
  children: (urlData: { url: string, id: string | null }) => (JSX.Element),
  loadedImages?: { [fileId: string]: string }, // mapping of file id to url
}): JSX.Element => {
  const [loadedFileURL, setLoadedFileURL] = useState<{ url: string, id: null | string } | null>(
    extractImageURL(nodeData, loadedImages));
  useEffect(() => {
    const loadFile = async () => {
      if ('url' in nodeData) {
        return { url: nodeData.url, id: null };
      }
      if (loadedImages && loadedImages[nodeData.fileData.id]) {
        return { url: loadedImages[nodeData.fileData.id], id: nodeData.fileData.id };
      }
      return { ...(await onFileLoad({ id: nodeData.fileData.id })), id: nodeData.fileData.id };
    };
    const setURL = async () => {
      const urlData = await loadFile();
      setLoadedFileURL(urlData);
    };
    setURL();
  }, [onFileLoad, nodeData, JSON.stringify(nodeData)]);
  return (
    <>
      {loadedFileURL && (
        children(loadedFileURL)
      )}
    </>
  );
};

export default AsyncFileLoad;
