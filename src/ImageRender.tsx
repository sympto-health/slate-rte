import React from 'react'
import { Resizable } from 're-resizable';
import { useSlate } from 'slate-react'
import { Transforms } from 'slate'
import { RenderElementProps } from 'slate-react';
import cx from 'classnames';
import _ from 'lodash';
import { convertSlateEditor, SlateNode } from './SlateNode';
import AsyncFileLoad, { AsyncFileLoadProps } from './AsyncFileLoad';
import ImageSizeRender from './ImageSizeRender';
import Loading from './Loading';

type BaseImageProps = Omit<AsyncFileLoadProps, 'children'>;

type Props = {
  isReadOnly: boolean,
  children: JSX.Element[],
  isSelected: boolean,
  className: string,
  attributes: RenderElementProps['attributes'],
} & BaseImageProps;

const enableProp = (shouldEnable: boolean) => ({ 
  top: shouldEnable, 
  right: shouldEnable,
  bottom: shouldEnable, 
  left: shouldEnable, 
  topRight: shouldEnable,
  bottomRight: shouldEnable, 
  bottomLeft: shouldEnable, 
  topLeft: shouldEnable,
});


const EDITABLE_RENDER_DELAY = 1; // 1 seconds delay between renders when in edit mode

const ImageRender = ({ 
  nodeData, onFileLoad, loadedImages, isReadOnly, children, className, attributes, isSelected, 
}: Props) => {
  // @ts-ignore
  const editor: SlateEditorT = useSlate()

  const onResizeFinish = ({
    currentWidth, currentHeight, widthDelta,
  }: {
    currentWidth: number, currentHeight: number, widthDelta: number, 
  }) => {
    const newNodeWidth = (widthDelta + currentWidth);
    const newNodeHeight = (newNodeWidth / currentWidth) * currentHeight;
    Transforms.setNodes(
      convertSlateEditor(editor), 
      // @ts-ignore
      { width: newNodeWidth, height: newNodeHeight  }, 
      {
        match: (n: SlateNode)  => (_.isEqual(_.omit(n, 'width', 'height'), _.omit(nodeData, 'width', 'height'))),
      },
     );
  };

  const imageItem = ({ url, id, height }: { 
    url: string, 
    id: string | null,
    height: string,
  }) => (
    <img 
      data-image-id={id} 
      alt="Uploaded Image" 
      src={url} 
      style={{ height }}
      className="d-inline-block w-100"   
    />
  );

  return (
    <div
      {...attributes}
      data-type="image"
      className={cx(className, { 'border border-secondary shadow-sm': !isReadOnly && isSelected })}
      style={nodeData.width && nodeData.height
        ? {
          width: `${nodeData.width}px`,
          height: `${nodeData.height}px`,
        }
        : {}}
    >
      <AsyncFileLoad 
        delaySeconds={(isReadOnly || isSelected) ? null : EDITABLE_RENDER_DELAY} 
        loadedImages={loadedImages} 
        nodeData={nodeData} 
        onFileLoad={onFileLoad}
      >
        {(imageData) => (
          <>
            {imageData && isReadOnly && imageItem({ 
              ...imageData,
              height: nodeData.height ? '100%' : 'auto',
            })}
            {!isReadOnly && (
              <div contentEditable={false}>
                {imageData && (nodeData.width == null || nodeData.height == null) &&(
                  <ImageSizeRender imageURL={imageData.url}>
                    {({ width: imageWidth, height: imageHeight }) => (
                      <Resizable 
                        lockAspectRatio
                        enable={enableProp(isSelected)}
                        onResizeStop={(...params) => {
                          const { width: widthDelta } = params[3];
                          const currentWidth = nodeData.width ? nodeData.width : imageWidth;
                          const currentHeight = nodeData.height ? nodeData.height : imageHeight;
                          onResizeFinish({ currentWidth, currentHeight, widthDelta })
                        }}
                      >
                        {imageItem({ 
                          ...imageData,
                          height: nodeData.height ? '100%' : 'auto',
                        })}
                      </Resizable>
                    )}
                  </ImageSizeRender>
                )}
                {nodeData.width != null && nodeData.height != null && (
                  <Resizable 
                    lockAspectRatio
                    enable={enableProp(isSelected)}
                    onResizeStop={(...params) => {
                      const { width: widthDelta } = params[3];
                      onResizeFinish({ currentWidth: nodeData.width || 1, currentHeight: nodeData.height || 1, widthDelta })
                    }}
                  >
                    {imageData && imageItem({ ...imageData, height: '100%' })}
                    {imageData == null && (
                      <div style={{ height: `${nodeData.height}px` }}>
                        <Loading />
                      </div>
                    )}
                  </Resizable>
                )}
              </div>
            )}
          </>
        )}
      </AsyncFileLoad>
      {children}
    </div>
  );
}

export default ImageRender;
