import React, { useState } from 'react';
import { Button, Modal, ProgressBar } from 'react-bootstrap';
import FileUpload from './FileUpload';
import './AttachmentModal.css';


const AttachmentModal = ({
  closeModal, onUpload, onFinish, type,
}: {
  closeModal: () => void,
  onUpload: (file: File, progress: (progressPercent: number) => void) => Promise<null | string>,
  onFinish: (url: string) => void,
  type: 'video' | 'image',
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentState, setCurrentState] = useState('FileSelect');
  return (
    <Modal
      show
      onHide={() => { closeModal(); }}
      className="SlateRTE-AttachmentModal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">{`Upload ${type}`}</Modal.Title>
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
              type={type}
              setFileToUpload={async (file: File) => {
                setCurrentState('Uploading');
                const url = await onUpload(file, (progress) => {
                  setUploadProgress(progress);
                });
                if (url !== null) {
                  onFinish(url);
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
