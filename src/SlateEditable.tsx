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
import { SlateLeafNode } from './SlateTypes';
import { SlateNode, BaseElementProps } from './SlateNode';
import { Leaf, Element } from './SlateElements';
import { BaseProps } from './SlateProps';

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

/* Modes:
    Read only - full formatting, not editable
    Edit - ability to edit text, with full formatting
    Minimal read only - read only mode w/ no background colors, no alignment formatting,
      no text colors (background color becomes text color if applicable)
 */
const SlateEditable = ({
  value, uploadFile, variables, inputClassName, onFileLoad, setValue, toolbarClassName,
}: ({
  setValue:(value: SlateNode[]) => void,
  toolbarClassName?: string,
  uploadFile: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
} & BaseProps)): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withVariables(false)(withImages(withLinks(withHistory(withReact(createEditor()))))), [])
  const [showAllOptions, setShowAllOptions] = useState(false);
  const slateEditor = useRef<HTMLDivElement | null>(null)
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value as SlateNode[])
      }}
      >
      <Card
        className={cx('toolbar-item d-flex flex-row flex-wrap shadow-sm px-2 py-1 card mb-3 w-auto', toolbarClassName)}
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
      <Editable
        readOnly={false}
        renderElement={(props) => (
          <Element
            {...(props as ElementProps)}
            onFileLoad={onFileLoad}
            isReadOnly={false}
            minimalFormatting={false}
          />
        )}
        renderLeaf={(props) => (
          <Leaf
            {...(props as unknown as LeafProps)}
            variables={variables}
            minimalFormatting={false}
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
  );
};

export default SlateEditable;
