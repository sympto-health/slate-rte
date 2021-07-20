import React, { useState, useEffect } from 'react';
import { Transforms, Range, Editor } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { Button } from 'react-bootstrap';
import cx from 'classnames';
import { SlateNode, SlateEditorT, convertSlateEditor } from './SlateNode';
import { VariableNode } from './SlateTypes';

export const withVariables = (isReadOnly: boolean) => ((editor: SlateEditorT) => {
  if (isReadOnly) {
    // if read only, then show variable children, sicne variable element contains
    // a child containing a leaf with a variableName
    return editor;
  }
  const { isInline, isVoid } = editor;

  if (!isReadOnly) {
    // @ts-ignore
    editor.isInline = (element: SlateNode) => {
      // @ts-ignore
      return element.type === 'variable' ? true : isInline(element)
    }
    // @ts-ignore
    editor.isVoid = (element: SlateNode) => {
      // @ts-ignore
      return element.type === 'variable' ? true : isVoid(element)
    };
  }

  return editor
});


const insertVariable = (editor: SlateEditorT, variableName: string, target: Range) => {
  // leaf node being replaced
  const [node] = Editor.node(editor, target);

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  // @ts-ignore
  const children: SlateNode[] = [{ ...node, text: ' ', variable: { variableName }, children: undefined }];

  const mention: VariableNode<SlateNode> = {
    type: 'variable',
    variableName,
    children,
    text: null,
  };

  Transforms.select(editor, target);

  if (isCollapsed) {
    // @ts-ignore
    Transforms.insertNodes(convertSlateEditor(editor), mention)
  } else {
    // @ts-ignore
    Transforms.wrapNodes(convertSlateEditor(editor), mention, { split: true })
    Transforms.collapse(convertSlateEditor(editor), { edge: 'end' })
  }
  Transforms.move(editor);
};


// https://github.com/ianstormtaylor/slate/blob/main/site/examples/mentions.tsx
const VariableSuggestions = ({
  value,
  boundingBox,
  variables,
}: {
  value: SlateNode[],
  variables: Array<string>,
  boundingBox: { top: number, left: number },
}) => {
    // @ts-ignore
  const editor: SlateEditorT = useSlate();
  const [target, setTarget] = useState<Range | null | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const { selection } = editor;
  const [suggestionsDivStyle, setSuggestionsDivStyle] = useState({});
  useEffect(() => {
    if (target) {
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      setSuggestionsDivStyle({
        top: `${rect.top - boundingBox.top + 24}px`,
        left: `${rect.left - boundingBox.left}px`,
      });
    }
  }, [editor, index, search, target])

  useEffect(() => {
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const wordBefore = Editor.before(editor, start, { unit: 'word' })
      const before = wordBefore && Editor.before(editor, wordBefore)
      const beforeRange = before && Editor.range(editor, before, start)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^{(\w+)$/)
      const after = Editor.after(editor, start)
      const afterRange = Editor.range(editor, start, after)
      const afterText = Editor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[1]);
        setIndex(0);
        return;
      }
    }

    setTarget(null);
  }, [value, selection]);

  return (
    <>
      {target && variables.length > 0 && (
        <div
          style={{
            top: '-9999px',
            left: '-9999px',
            position: 'absolute',
            zIndex: 1,
            padding: '3px',
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            ...suggestionsDivStyle,
          }}
          className="d-flex flex-column"
        >
          {variables.map((variable, index) => (
            <Button
              key={variable}
              style={{
                padding: '1px 3px',
                borderRadius: '3px',
              }}
              variant="link"
              className={cx('py-2', { 'border-bottom': index !== variables.length - 1})}
              onClick={() => { insertVariable(editor, variable, target); }}
            >
              {variable}
            </Button>
          ))}
        </div>
      )}
    </>
  );
};

export default VariableSuggestions;
