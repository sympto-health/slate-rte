import React, { useMemo, useState, useRef } from 'react'
import { withHistory } from 'slate-history'
import {
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter, faGripLines, faTint, faHighlighter, faFillDrip, faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'
import cx from 'classnames';
import { createEditor } from 'slate';
import _ from 'lodash';
import { Editable, ReactEditor, RenderLeafProps, RenderElementProps, withReact, Slate } from 'slate-react';
import ColorPicker from './ColorPicker';
import FontFormatter from './FontFormatter';
import { withLinks, LinkButton } from './Links';
import FormatMark, { MarkFormats, HotKeyHandler } from './FormatMark';
import FormatBlock, { BlockFormats } from './FormatBlock';
import FormatButton from './FormatButton';
import VariableSuggestions, { withVariables } from './Variables';
import ImageAdd, { withImages } from './ImageAdd';
import { FileT, SlateLeafNode } from './SlateTypes';
import { SlateNode, BaseElementProps } from './SlateNode';
import getBackgroundColor from './getBackgroundColor';
import SlatePDF from './SlatePDF';
import { Leaf, Element } from './SlateElements';

type ElementProps = {
  attributes: RenderElementProps['attributes'],
  isReadOnly: boolean,
  variables: { [variableName: string]: string },
} & BaseElementProps;

type LeafProps = {
  attributes: RenderLeafProps['attributes'],
  children: JSX.Element,
  minimalFormatting: boolean,
  leaf: SlateLeafNode<SlateNode>,
  variables: { [variableName: string]: string },
};

// default size in px for font-size of 1em
const DEFAULT_EM_SIZE = 16;

type BaseProps = {
  value: SlateNode[],
  uploadFile?: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
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

/* Modes:
    Read only - full formatting, not editable
    Edit - ability to edit text, with full formatting
    Minimal read only - read only mode w/ no background colors, no alignment formatting,
      no text colors (background color becomes text color if applicable)
 */
const SlateRTE = ({
  value, uploadFile, className, variables, inputClassName, options, onFileLoad, ...opts
}: ({
  setValue:(value: SlateNode[]) => void,
  mode: 'Edit',
  toolbarClassName?: string,
} & BaseProps) | ({
  mode: 'Read-Only' | 'Minimal Read-Only' | 'PDF' | 'Minimal PDF',
} & BaseProps)): JSX.Element => {
  const readOnlyMode = opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withVariables(readOnlyMode)(withImages(withLinks(withHistory(withReact(createEditor()))))), [])
  const backgroundColor = getBackgroundColor(value);
  const calculateColorStyles = () => {
    if (backgroundColor == null) return {};
    if (opts.mode === 'Minimal Read-Only') return { color: backgroundColor };
    return { backgroundColor };
  };
  const [showAllOptions, setShowAllOptions] = useState(false);
  const slateEditor = useRef<HTMLDivElement | null>(null)
  if (opts.mode === 'PDF' || opts.mode === 'Minimal PDF') {
    return (
      <SlatePDF
        options={options}
        minimalFormatting={opts.mode === 'Minimal PDF'}
        value={value}
        variables={variables}
        onFileLoad={onFileLoad}
      />
    );
  }
  return (
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
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          if (opts.mode === 'Edit') {
            opts.setValue(value as SlateNode[])
          }
        }}
      >
        { opts.mode === 'Edit' && (
          <Card
            className={cx('toolbar-item d-flex flex-row flex-wrap shadow-sm px-2 py-1 card mb-3 w-auto', opts.toolbarClassName)}
          >
            {[
              { format: 'bold', icon: faBold },
              { format: 'italic', icon: faItalic },
              { format: 'underline', icon: faUnderline },
              { format: 'code', icon: faCode },
            ].map((
              { format, icon }: { format: MarkFormats, icon: IconDefinition },
            ) => (
              <FormatMark
                key={format}
                format={format}
                icon={icon}
              />
            ))}
            <FormatButton
              icon={faEllipsisH}
              isActive={showAllOptions}
              onClick={() => {
                setShowAllOptions((curOption) => !curOption);
              }}
            />
            <VariableSuggestions
              boundingBox={slateEditor.current
                ? {
                  top: slateEditor.current.getBoundingClientRect().top,
                  left: slateEditor.current.getBoundingClientRect().left,
                }
                : { top: 0, left: 0 }}
              variables={_.keys(variables)}
              value={value}
            />
            { showAllOptions && (
              <>
                {[
                  { format: 'heading-one', icon: faHeading },
                  { format: 'heading-two', icon: faFont },
                  { format: 'block-quote', icon: faQuoteLeft },
                  { format: 'numbered-list', icon: faListOl },
                  { format: 'bulleted-list', icon: faListUl},
                  { format: 'left-align', icon: faAlignLeft },
                  { format: 'center-align', icon: faAlignCenter },
                  { format: 'right-align', icon: faAlignRight },
                  { format: 'horizontal-line', icon: faGripLines },
                ].map(({ format, icon }: { icon: IconDefinition, format: BlockFormats }) => (
                  <FormatBlock format={format} icon={icon}  key={format}/>
                ))}
                <LinkButton />
                <ColorPicker icon={faTint} type="text-color" />
                <ColorPicker icon={faHighlighter} type="highlight-color" />
                <ColorPicker icon={faFillDrip} type="background-color" />
                { uploadFile && (<ImageAdd type="image" uploadFile={uploadFile} />)}
                { uploadFile && (<ImageAdd type="video" uploadFile={uploadFile} />)}
                <FontFormatter options={[300, 400, 700, 800]} type="font-weight" defaultVal={400} />
                <FontFormatter options={_.range(8, 60)} type="font-size" defaultVal={16} />
              </>
            )}
          </Card>
        )}
        <Editable
          readOnly={opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only'}
          renderElement={(props) => (
            <Element
              {...(props as ElementProps)}
              onFileLoad={onFileLoad}
              isReadOnly={opts.mode === 'Read-Only' || opts.mode === 'Minimal Read-Only'}
              minimalFormatting={opts.mode === 'Minimal Read-Only'}
            />
          )}
          renderLeaf={(props) => (
            <Leaf
              {...(props as unknown as LeafProps)}
              variables={variables}
              minimalFormatting={opts.mode === 'Minimal Read-Only'}
            />
           )}
          placeholder="Enter some rich text…"
          spellCheck
          className={inputClassName}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onKeyDown={(event: KeyboardEvent) => (HotKeyHandler({ event, editor }))}
        />
      </Slate>
    </div>
  );
}

export default SlateRTE;
