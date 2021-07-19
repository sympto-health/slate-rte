import React, { useState } from 'react'
import { Transforms, Editor, Path, Node } from 'slate'
import { useSlate,  ReactEditor } from 'slate-react'
import { faImages, faVideo } from '@fortawesome/free-solid-svg-icons'
import { ImageVideoNode, EmptySlateNode, FileT } from './SlateTypes';
import { SlateNode, SlateEditorT } from './SlateNode';
import FormatButton from './FormatButton';
import AttachmentModal from './AttachmentModal';

const ImageAdd = ({ uploadFile, type }: {
  uploadFile: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
  type: 'video' | 'image',
}) => {
  // @ts-ignore
  const editor: ReactEditor = useSlate();
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  const insertFile = (fileData: FileT) => {
    const { selection } = editor;
    const file: ImageVideoNode<SlateNode> = {
      type,
      text: null,
      children: [({ text: ' ' } as EmptySlateNode<SlateNode>)],
      ...(fileData.type === 'URL'
         ? {
           url: fileData.url,
         }
         : {
           fileData,
          })
    };
    ReactEditor.focus(editor);

    if (!!selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus?.path
      );

      if (editor.isVoid(parentNode) || Node.string(parentNode).length) {
        // Insert the new image node after the void node or a node with content
        Transforms.insertNodes(editor, file, {
          at: Path.next(parentPath),
          select: true
        });
      } else {
        // If the node is empty, replace it instead
        Transforms.removeNodes(editor, { at: parentPath });
        Transforms.insertNodes(editor, file, { at: parentPath, select: true });
      }
    } else {
      // Insert the new image node at the bottom of the Editor when selection
      // is falsey
      Transforms.insertNodes(editor, file, { select: true });
    }
  };


  return (
    <>
      {
        showAttachmentModal && (
          <AttachmentModal
            closeModal={() => { setShowAttachmentModal(false); }}
            onUpload={uploadFile}
            type={type}
            onFinish={insertFile}
          />
        )
      }
      <FormatButton
        isActive={false}
        icon={type === 'image' ? faImages : faVideo}
        onClick={async () => {
          setShowAttachmentModal(true);
        }}
      />
    </>
  );
}



export const withImages = (editor: SlateEditorT) => {
  const { isVoid } = editor;

  // @ts-ignore
  editor.isVoid = (element: SlateNode) =>
    // @ts-ignore
    element.type === "image" ? true : isVoid(element);

  return editor;
};

export default ImageAdd
