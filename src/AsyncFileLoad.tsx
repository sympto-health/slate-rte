import React, { useState, useEffect } from 'react'
import { SlateNode } from './SlateNode';
import { ImageVideoNode } from './SlateTypes';

const AsyncFileLoad = ({
  onFileLoad, nodeData, children,
}: { 
  onFileLoad?: (fileData: { id: string }) => Promise<{ url: string }>,
  nodeData: ImageVideoNode<SlateNode>,
  children: (urlData: { url: string }) => (JSX.Element),
}) => {
  const [loadedFileURL, setLoadedFileURL] = useState<{ url: string } | null>(null);
  useEffect(() => {
    const loadFile = async (): Promise<{ url: string }> => {
      if ('url' in nodeData) {
        return { url: nodeData.url };
      } else if (onFileLoad == null) {
        throw new Error('Invalid file');
      } else {
        return onFileLoad({ id: nodeData.fileData.id });
      }
    };
    const setURL = async () => {
      const urlData = await loadFile();
      setLoadedFileURL(urlData);
    };
    setURL();
  }, [JSON.stringify(nodeData)]);
  return (
    <>
      {loadedFileURL && (
        children(loadedFileURL)
      )}
    </>
  );
};

export default AsyncFileLoad;
