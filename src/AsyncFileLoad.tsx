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

export type AsyncFileLoadProps = {
  onFileLoad: (fileData: { id: string }) => Promise<{ url: string }>,
  nodeData: ImageVideoNode<SlateNode>,
  children: (urlData: null | { url: string, id: string | null }) => (JSX.Element | JSX.Element[]),
  loadedImages?: { [fileId: string]: string }, // mapping of file id to url
  delaySeconds?: null | number, // seconds to delay image loading
};

const AsyncFileLoad = ({
  onFileLoad, nodeData, children, loadedImages, delaySeconds, 
}: AsyncFileLoadProps): JSX.Element => {
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
    let delayTimeout: null | ReturnType<typeof setTimeout> = null;
    if (delaySeconds) {
      delayTimeout = setTimeout(setURL, delaySeconds * 1000);
    } else {
      setURL();
    }
    return () => {
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }
    };
  }, [onFileLoad, delaySeconds, nodeData, JSON.stringify(nodeData)]);
  return (
    <>
      {children(loadedFileURL)}
    </>
  );
};

export default AsyncFileLoad;
