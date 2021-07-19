import { SlateNode } from './SlateNode';
import { FileT } from './SlateTypes';

export type BaseProps = {
  value: SlateNode[],
  className?: string,
  inputClassName?: string,
  // mapping of variable to variable value
  variables: { [variableName: string]: string },
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number,
  },
};


export type SlateProps = ({
  setValue:(value: SlateNode[]) => void,
  mode: 'Edit',
  uploadFile: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
  toolbarClassName?: string,
} & BaseProps) | ({
  mode: 'PDF' | 'Minimal PDF',
} & BaseProps) | ({
  mode: 'Read-Only' | 'Minimal Read-Only',
  loadedImages?: { [fileId: string]: string }, // mapping of file id to url
} & BaseProps);
