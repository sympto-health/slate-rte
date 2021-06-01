import { Node } from 'slate';
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  View, Text,
} from '@react-pdf/renderer';
import { RenderLeafProps, RenderElementProps } from 'slate-react';
import getBackgroundColor from './getBackgroundColor';

const DEFAULT_EM_SIZE = 16;

const SlatePDF = ({ 
  value, options, minimalFormatting,
}: {
  value: Node[],
  minimalFormatting: boolean,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number, 
  },
}) => {
  const fontRatio = options ?  DEFAULT_EM_SIZE / options.defaultFontSizePx : 1;
  const backgroundColor = getBackgroundColor(value);
  const renderSlateItems = (slateContent: Node[]) => (slateContent.map(({ children, ...metadata }) => (
    metadata.type 
      ? (
        // @ts-ignore
        <Element key={uuidv4()} fontRatio={fontRatio} minimalFormatting={minimalFormatting} element={metadata}>
          {children 
            // @ts-ignore
            && renderSlateItems(children)}
        </Element>
      )
      : (
        // @ts-ignore
        <Leaf key={uuidv4()} fontRatio={fontRatio} leaf={metadata} minimalFormatting={minimalFormatting}>
          {children 
            // @ts-ignore
            && renderSlateItems(children)}
        </Leaf>
      )
  )));
  return (
    <View 
      style={{
        color: backgroundColor && minimalFormatting ? backgroundColor : undefined,
        backgroundColor: backgroundColor && !minimalFormatting ? backgroundColor : undefined,

        fontSize: fontRatio * DEFAULT_EM_SIZE,
      }}
    >
      {renderSlateItems(value)} 
    </View>
  );
}

const Element = ({ minimalFormatting, children, element }: RenderElementProps & { fontRatio: number, minimalFormatting: boolean }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <Text
          style={{
            borderLeft: '2px solid #ddd',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: 10,
            marginBottom: 10,
            color: '#aaa',
          }}
        >
          {children}
        </Text>
      );
    case 'bulleted-list':
      return <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>{children}</View>
    case 'heading-one':
      return <Text style={{ fontSize: 40 }}>{children}</Text>
    case 'heading-two':
      return <Text style={{ fontSize: 28 }}>{children}</Text>
    case 'list-item':
      return (
        <View>
          <View 
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              flex: 1
            }}
          >
            <View style={{ width: 10 }}>
                <Text>{`\u2022 `}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {children}
            </View>
          </View>
        </View>
      );
    case 'numbered-list':
      return <ol>{children}</ol>
    case 'left-align':
      return minimalFormatting 
        ? <Text>{children}</Text> 
        : <Text style={{ textAlign: 'left' }}>{children}</Text>
    case 'right-align':
      return minimalFormatting 
        ? <Text>{children}</Text>
        : <Text style={{ textAlign: 'right' }}>{children}</Text>
    case 'center-align':
      return minimalFormatting
        ? <Text>{children}</Text> 
        : <Text style={{ textAlign: 'center' }}>{children}</Text>
    case 'horizontal-line': 
      return minimalFormatting
        ? <Text>{children}</Text> 
        : (
          <View>
            <View 
              style={{ 
                marginVertical: 10,
                borderTop: '1px solid rgba(0,0,0,.1)',
              }}
            />
            {children}
          </View>
        )
    case 'link':
      return (
        <a target="_blank" href={String(element.url) || ''}>
          {children}
        </a>
      )
    case 'image':
      return (
        <div className="d-inline-block">
          <div className="d-inline-block" contentEditable={false}>
            <img alt="Uploaded Image" src={String(element.url) || ''} className="image-item" />
          </div>
          {children}
        </div>
      )
    case 'background-color':
      return (<View style={{ backgroundColor: String(element.color) }} />);
    default:
      return (
        <Text 
          style={element.noPadding ? { paddingBottom: 1 } : { paddingBottom: 10 }} 
        >
          {children}
        </Text>
      );
  }
}

const Leaf = ({ children, leaf, minimalFormatting, fontRatio }: RenderLeafProps & { minimalFormatting: boolean, fontRatio: number }) => {
  const childComponents = [leaf.text || '', ...(children || [])];
  if (leaf.bold) {
    return (<Text style={{ fontWeight: 700 }}>{childComponents}</Text>);
  }

  if (leaf.code) {
    return (
      <Text 
        style={{ 
          fontFamily: 'monospace',
          fontSize: fontRatio * DEFAULT_EM_SIZE * 0.875,
          color: '#e83e8c',
        }}
      >
        {childComponents}
      </Text>
    )
  }

  if (leaf.italic) {
    return (<Text style={{ fontStyle: 'italic' }}>{childComponents}</Text>)
  }

  if (leaf.underline) {
    return (<Text style={{ textDecoration: 'underline' }}>{childComponents}</Text>)
  }

  if (leaf['font-size']) {
    // @ts-ignore
    const { value: fontSize } = leaf['font-size'];
    // note that em is relative, so base em size will still be relevant here
    return <Text style={{ fontSize: fontRatio * fontSize }} >{childComponents}</Text>
  }
  if (leaf['font-weight']) {
    // @ts-ignore
    const { value: fontWeight } = leaf['font-weight'];
    return <Text style={{ fontWeight }} >{childComponents}</Text>
  }
  if (leaf['text-color']) {
    // @ts-ignore
    const { color } = leaf['text-color'];
    return (<Text style={minimalFormatting ? {} : { color }} >{childComponents}</Text>)
  }
  if (leaf['highlight-color']) {
    // @ts-ignore
    const highlightBackgroundColor = leaf['highlight-color'].color;
    return (
      <Text style={{ backgroundColor: highlightBackgroundColor }} >
        {childComponents}
      </Text>
    );
  }


  return <Text>{childComponents}</Text>
}

export default SlatePDF;
