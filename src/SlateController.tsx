import React, { useMemo, useRef } from 'react'
import { withHistory } from 'slate-history'
import cx from 'classnames';
import { createEditor } from 'slate';
import { ErrorBoundary } from 'react-error-boundary'
import { v4 as uuidv4 } from 'uuid';
import { Editable, ReactEditor, withReact, Slate } from 'slate-react';
import { withLinks } from './Links';
import { HotKeyHandler } from './FormatMark';
import { withVariables } from './Variables';
import { withImages } from './ImageAdd';
import { SlateProps } from './SlateProps';
import getBackgroundColor from './getBackgroundColor';
import SlatePDF from './SlatePDF';
import SlateEditable from './SlateEditable'
import { Leaf, Element, ElementProps, LeafProps } from './SlateElements';

// default size in px for font-size of 1em
const DEFAULT_EM_SIZE = 16;

/* Modes:
    Read only - full formatting, not editable
    Edit - ability to edit text, with full formatting
    Minimal read only - read only mode w/ no background colors, no alignment formatting,
      no text colors (background color becomes text color if applicable)
 */
const SlateController = ({
  value, className, variables, inputClassName, options, onFileLoad, ...opts
}: SlateProps): JSX.Element => {
  const readOnlyMode = opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withVariables(readOnlyMode)(withImages(withLinks(withHistory(withReact(createEditor()))))), [readOnlyMode]);
  const backgroundColor = getBackgroundColor(value);
  const calculateColorStyles = () => {
    if (backgroundColor == null) return {};
    if (opts.mode === 'Minimal Read-Only') return { color: backgroundColor };
    return { backgroundColor };
  };
  const slateEditor = useRef<HTMLDivElement | null>(null);
  return (
    <ErrorBoundary
      fallbackRender={({error, resetErrorBoundary }) => {
        setTimeout(resetErrorBoundary, 500);
        return (
          <div className="text-danger text-center pt-2">
            <pre>{error.message}</pre>
          </div>
        );
      }}
    >
      {(opts.mode === 'PDF' || opts.mode === 'Minimal PDF') && (
        <SlatePDF
          options={options}
          minimalFormatting={opts.mode === 'Minimal PDF'}
          value={value}
          variables={variables}
          onFileLoad={onFileLoad}
        />
      )}
      {
        (opts.mode === 'Edit' || opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only') && (
          <div
            className={cx(
              'SlateRTE d-flex flex-column justify-content-start text-left position-relative',
              {
                'read-only': opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only',
                'p-3': opts.mode !== 'Minimal Read-Only',
              },
              className,
            )}
            ref={slateEditor}
            style={{
              ...calculateColorStyles(),
              fontSize: options ? `${DEFAULT_EM_SIZE / options.defaultFontSizePx}em` : '1em',
            }}
          >
            {opts.mode === 'Edit' && (
              <SlateEditable
                value={value}
                boundingBox={slateEditor.current
                  ? {
                    top: slateEditor.current.getBoundingClientRect().top,
                    left: slateEditor.current.getBoundingClientRect().left,
                  }
                  : { top: 0, left: 0 }}
                uploadFile={opts.uploadFile}
                variables={variables}
                inputClassName={inputClassName}
                onFileLoad={onFileLoad}
                setValue={opts.setValue}
                toolbarClassName={opts.toolbarClassName}
              />
            )}
            {(opts.mode === 'Minimal Read-Only' || opts.mode === 'Read-Only') && (
              <Slate
                editor={editor}
                value={value}
                onChange={() => (null)}
              >
                <Editable
                  readOnly
                  renderElement={(props) => (
                    <Element
                      {...(props as ElementProps)}
                      onFileLoad={onFileLoad}
                      isReadOnly
                      loadedImages={opts.loadedImages}
                      minimalFormatting={opts.mode === 'Minimal Read-Only'}
                    />
                  )}
                  renderLeaf={(props) => (
                    <Leaf
                      {...(props as unknown as LeafProps)}
                      variables={variables}
                      key={uuidv4()}
                      minimalFormatting={opts.mode === 'Minimal Read-Only'}
                    />
                  )}
                  spellCheck
                  className={inputClassName}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onKeyDown={(event: KeyboardEvent) => (HotKeyHandler({ event, editor }))}
                />
              </Slate>
            )}

          </div>
        )}
    </ErrorBoundary>
  );
}

export default SlateController;
