/* @flow */
import React, { useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import cx from 'classnames';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import './FileUpload.css';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const MAX_FILE_SIZE = 1048576 * 100; // 100 MBS

type Props = {
  setFileToUpload: (file: File) => (void | Promise<void>),
  type: 'video' | 'image',
};

const FileUpload = ({
  setFileToUpload,
  type,
}: Props) => {
  const [rejectFiles, setRejectFiles] = useState<FileRejection[]>([]);
  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setRejectFiles(rejectedFiles);
      swal(`Cannot upload file ${rejectedFiles[0].file.name}. Upload images or PDFs up to 60MB in size only.`);
    }
    if (acceptedFiles.length > 0) {
      setFileToUpload(acceptedFiles[0]);
    }
  }, []);
  const fileTypes = type === 'image'
    ? 'image/png, image/gif, image/jpeg, image/tiff, image/webp'
    : 'video/mpeg, video/mp4';
  const {
    getRootProps, getInputProps, isDragActive,
  } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    minSize: 0,
    accept: fileTypes,
  });

  return (
    <div
      {...getRootProps()}
      className={cx('SlateRTE-FileUpload-container', {
        'border-primary upload-box-active': isDragActive,
      })}
    >
      <input {...getInputProps()} />
      <div className={cx('file-children', { 'd-none': isDragActive })}>
        <div className="border p-4 attachment-upload-modal text-center text-large font-weight-light">
          {`Drag or click here to upload an ${type}.`}
        </div>
      </div>
      {
        rejectFiles.length === 0 && isDragActive && (
          <div className="d-flex flex-column">
            <FontAwesomeIcon icon={(faCloudUploadAlt as IconProp)} className="upload-icon text-secondary" />
            <div className="display-4 upload-text">
              Drop your file here to upload...
            </div>
          </div>
        )
      }
    </div>
  );
};

FileUpload.defaultProps = {
  fileTypes: '',
};

export default FileUpload;
