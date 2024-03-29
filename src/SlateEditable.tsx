import React, { useMemo, useState } from 'react'
import { withHistory } from 'slate-history'
import {
  faBold, faItalic, faUnderline, faQuoteLeft, faCode, faHeading, faListOl, faListUl, faFont, IconDefinition,
  faAlignLeft, faAlignRight, faAlignCenter, faGripLines, faTint, faHighlighter, faFillDrip, faEllipsisH, faBorderTopLeft,
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Card } from 'react-bootstrap'
import cx from 'classnames';
import { createEditor } from 'slate';
import { v4 as uuidv4 } from 'uuid';
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
import { SlateLeafNode, FileT } from './SlateTypes';
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
  value, uploadFile, variables, inputClassName, onFileLoad, setValue, toolbarClassName, boundingBox,
}: ({
  setValue:(value: SlateNode[]) => void,
  toolbarClassName?: string,
  uploadFile: (file: File, progressCallBack: (progress: number) => void) => Promise<null | FileT>,
  boundingBox: { top: number, left: number },
} & BaseProps)): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const editor: ReactEditor = useMemo(() => withVariables(false)(withImages(withLinks(withHistory(withReact(createEditor()))))), [])
  const [showAllOptions, setShowAllOptions] = useState(false);
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
          icon={(faEllipsisH as IconProp)}
          isActive={showAllOptions}
          onClick={() => {
            setShowAllOptions((curOption) => !curOption);
          }}
        />
        <VariableSuggestions
          boundingBox={boundingBox}
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
            <ColorPicker icon={faBorderTopLeft} type="border-color" />
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
            key={uuidv4()}
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
