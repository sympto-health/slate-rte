import React, { useState, useEffect } from 'react'
import { Transforms, Range, Editor } from 'slate'
import { useSlate, ReactEditor } from 'slate-react'
import { SlateNode, SlateEditorT } from './SlateNode';
import { VariableNode } from './SlateTypes';

export const withVariables = (editor: SlateEditorT) => {
  const { isInline, isVoid } = editor

  // @ts-ignore
  editor.isInline = (element: SlateNode) => {
    // @ts-ignore
    return element.type === 'variable' ? true : isInline(element)
  }

  // @ts-ignore
  editor.isVoid = (element: SlateNode) => {
    // @ts-ignore
    return element.type === 'variable' ? true : isVoid(element)
  }

  return editor
}


// TEMPORARY export
export const insertVariable = (editor: SlateEditorT, variableName: string) => {
  // @ts-ignore
  const mention: VariableNode = {
    type: 'variable',
    variableName,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}

const chars = ['omg'];

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
    if (target && chars.length > 0) {
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      setSuggestionsDivStyle({
        top: `${rect.top - boundingBox.top + 24}px`,
        left: `${rect.left - boundingBox.left}px`,
      });    
    }
  }, [chars.length, editor, index, search, target])

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
        setTarget(beforeRange)
        setSearch(beforeMatch[1])
        setIndex(0)
        return
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
        >
          {variables.map(variable => (
            <div
              key={variable}
              style={{
                padding: '1px 3px',
                borderRadius: '3px',
              }}
            >
              {variable}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default VariableSuggestions;