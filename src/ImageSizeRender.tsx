import React, { useState, useEffect } from 'react'

type Props = {
  imageURL: string,
  children: (sizeProps: { width: number, height: number }) => JSX.Element,
};

const ImageSizeRender = ({
  imageURL, children,
}: Props) => {
  const [imageSize, setImageSize] = useState<null | { width: number, height: number }>(null);
  useEffect(() => {
    var t = new Image();
    t.src = imageURL;
    t.onload = () => {
      setImageSize({ width: t.width, height: t.height })
    };
  }, [imageURL]);
  return (
    <>
      {imageSize != null && children(imageSize)}
    </>
  );
}

export default ImageSizeRender;
