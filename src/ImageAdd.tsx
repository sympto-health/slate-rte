import React from 'react'
import { Transforms, Range } from 'slate'
import { useSlate,  ReactEditor } from 'slate-react'
import { faImages } from '@fortawesome/free-solid-svg-icons'

import FormatButton from './FormatButton';


const ImageAdd = ({ uploadImage }: {
  uploadImage: () => Promise<null | string>,
}) => {
  const editor = useSlate();
  return (
    <FormatButton 
      isActive={false}
      icon={faImages}
      onClick={async () => {
        const url = await uploadImage();
        if (!url) return
        insertImage(editor, url)
      }}
    />
  );
}

const insertImage = (editor: ReactEditor, url: string) => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const image = {
    type: 'image',
    url,
    children: isCollapsed ? [{ text: '' }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, image)
  } else {
    Transforms.wrapNodes(editor, image, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
};

export default ImageAdd
