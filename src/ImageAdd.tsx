import React, { useState } from 'react'
import { Transforms, Range } from 'slate'
import { useSlate,  ReactEditor } from 'slate-react'
import { faImages } from '@fortawesome/free-solid-svg-icons'

import FormatButton from './FormatButton';
import AttachmentModal from './AttachmentModal';

const ImageAdd = ({ uploadImage }: {
  uploadImage: (file: File, progressCallBack: (progress: number) => void) => Promise<null | string>,
}) => {
  const editor = useSlate();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selection, setSelection] = useState<Range | null>(null);
  return (
    <>
      {
        showAttachmentModal && (
          <AttachmentModal 
            closeModal={() => { setShowAttachmentModal(false); }}
            onUpload={(file, progressCallBack) => {
              return uploadImage(file, progressCallBack);
            }}
            onFinish={(url) => { 
              console.log("FINISHED");
              console.log(url);
              insertImage(editor, url, selection)
            }}
          />
        )
      }
      <FormatButton 
        isActive={false}
        icon={faImages}
        onClick={async () => {
          setSelection(editor.selection);
          setShowAttachmentModal(true);
        }}
      />
    </>
  );
}

const insertImage = (editor: ReactEditor, url: string, selection: Range | null) => {
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
