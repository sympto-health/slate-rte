import React, { useState } from 'react'
import { Transforms, Range } from 'slate'
import { useSlate,  ReactEditor } from 'slate-react'
import { faImages, faVideo } from '@fortawesome/free-solid-svg-icons'
import { LinkNode, EmptySlateNode, convertSlateEditor } from './SlateNode';
import FormatButton from './FormatButton';
import AttachmentModal from './AttachmentModal';

const ImageAdd = ({ uploadFile, type }: {
  uploadFile: (file: File, progressCallBack: (progress: number) => void) => Promise<null | string>,
  type: 'video' | 'image',
}) => {
  // @ts-ignore
  const editor: ReactEditor = useSlate();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selection, setSelection] = useState<Range | null>(null);
  return (
    <>
      {
        showAttachmentModal && (
          <AttachmentModal 
            closeModal={() => { setShowAttachmentModal(false); }}
            onUpload={(file, progressCallBack) => {
              return uploadFile(file, progressCallBack);
            }}
            type={type}
            onFinish={(url) => { 
              insertFile(type, editor, url, selection)
              setSelection(null)
            }}
          />
        )
      }
      <FormatButton 
        isActive={false}
        icon={type === 'image' ? faImages : faVideo}
        onClick={async () => {
          setSelection(editor.selection);
          setShowAttachmentModal(true);
        }}
      />
    </>
  );
}

const insertFile = (type: 'image' | 'video', editor: ReactEditor, url: string, selection: Range | null) => {
  const isCollapsed = selection && Range.isCollapsed(selection)
  const file: LinkNode = {
    type,
    url,
    text: null,
    children: [({ text: '' } as EmptySlateNode)],
  };

  if (isCollapsed) {
    // @ts-ignore
    Transforms.insertNodes(convertSlateEditor(editor), file)
  } else {
    // @ts-ignore
    Transforms.wrapNodes(convertSlateEditor(editor), file, { split: true })
    // @ts-ignore
    Transforms.collapse(convertSlateEditor(editor), { edge: 'end' })
  }
};

export default ImageAdd
