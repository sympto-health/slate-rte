import React, { useState } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import FileUpload from './FileUpload';
import { FileT } from './SlateTypes';
import './AttachmentModal.css';

const fetchImageDimensions = async (file: File): Promise<{ 
  width: number, height: number,
}> => (new Promise((resolve) => {
  const url = URL.createObjectURL(file);
  const img = new Image;

  img.onload = () => {
    URL.revokeObjectURL(img.src);
    resolve({ width: img.width, height: img.height });
  };

  img.src = url;
}));

type BaseProps = {
  closeModal: () => void,
  onUpload: (file: File, progress: (progressPercent: number) => void) => Promise<null | FileT>,
};

type Props = BaseProps & ({
  onFinish: (data: FileT, dimensions: { width: number, height: number }) => void,
  type: 'image',
} | {
  type: 'video',
  onFinish: (data: FileT) => void,
});

const AttachmentModal = ({
  closeModal, onUpload, ...opts
}: Props) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentState, setCurrentState] = useState('FileSelect');
  return (
    <Modal
      show
      onHide={() => { closeModal(); }}
      className="SlateRTE-AttachmentModal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">{`Upload ${opts.type}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3 d-flex">
        { currentState === 'Uploading' && (
          <div className="flex-grow-1 p-3 flex-column">
            <div className="display-4 text-center pb-4">
              Uploading...
            </div>
            <ProgressBar animated now={uploadProgress * 100} />
          </div>
        )}
        {
          currentState === 'FileSelect' && (
            <FileUpload
              type={opts.type}
              setFileToUpload={async (file: File) => {
                setCurrentState('Uploading');
                const url = await onUpload(file, (progress) => {
                  setUploadProgress(progress);
                });
                if (url !== null && opts.type === 'image') {
                  opts.onFinish(url, await fetchImageDimensions(file));
                }
                if (url !== null && opts.type === 'video') {
                  opts.onFinish(url);
                }
                closeModal();
              }}
            />
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="w-100"
          onClick={() => { closeModal(); }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttachmentModal;
