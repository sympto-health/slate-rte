import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  View, Text, Image, Link,
} from '@react-pdf/renderer';
import { RenderLeafProps, RenderElementProps } from 'slate-react';
import getBackgroundColor from './getBackgroundColor';
import { SlateNode, BaseElementProps, BaseLeafProps } from './SlateNode';

const DEFAULT_EM_SIZE = 16;

type ElementProps = { 
  attributes: RenderElementProps['attributes'], 
  fontRatio: number,
} & BaseElementProps;

type LeafProps = {
  attributes: RenderLeafProps['attributes'], 
  fontRatio: number,
} & BaseLeafProps;

const SlatePDF = ({ 
  value, options, minimalFormatting,
}: {
  value: SlateNode[],
  minimalFormatting: boolean,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number, 
  },
}) => {
  console.log(value);
  const fontRatio = options ?  DEFAULT_EM_SIZE / options.defaultFontSizePx : 1;
  const backgroundColor = getBackgroundColor(value);
  const renderSlateItems = (slateContent: SlateNode[]) => (slateContent.map(({ children, ...metadata }) => (
    metadata.type 
      ? (
        // @ts-ignore
        <Element key={uuidv4()} fontRatio={fontRatio} minimalFormatting={minimalFormatting} element={metadata}>
          <>{children  && renderSlateItems(children)}</>
        </Element>
      )
      : (
        // @ts-ignore
        <Leaf key={uuidv4()} fontRatio={fontRatio} leaf={metadata} minimalFormatting={minimalFormatting}>
          <>{children && renderSlateItems(children)}</>
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

const Element = ({ minimalFormatting, children, element }: ElementProps) => {
  const childComponents = [
    <Text>{element.text}</Text>, 
    <View>{children}</View>,
  ];
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
          {childComponents}
        </Text>
      );
    case 'bulleted-list':
      return <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>{childComponents}</View>
    case 'heading-one':
      return <Text style={{ fontSize: 40 }}>{childComponents}</Text>
    case 'heading-two':
      return <Text style={{ fontSize: 28 }}>{childComponents}</Text>
    case 'list-item': case 'numbered-list':
      return (
        <Text style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          {[<Text>•</Text>, ...childComponents]}
        </Text>
      );
        case 'left-align':
      return minimalFormatting 
        ? <Text>{childComponents}</Text> 
        : <Text style={{ textAlign: 'left' }}>{childComponents}</Text>
    case 'right-align':
      return minimalFormatting 
        ? <Text>{childComponents}</Text>
        : <Text style={{ textAlign: 'right' }}>{childComponents}</Text>
    case 'center-align':
      return minimalFormatting
        ? <Text>{childComponents}</Text> 
        : <Text style={{ textAlign: 'center' }}>{childComponents}</Text>
    case 'horizontal-line': 
      return minimalFormatting
        ? <Text>{childComponents}</Text> 
        : (
          <View>
            <View 
              style={{ 
                marginVertical: 10,
                borderTop: '1px solid rgba(0,0,0,.1)',
              }}
            />
            {childComponents}
          </View>
        )
    case 'link':
      return (
        <Link src={element.url}>
          {childComponents}
        </Link>
      )
    case 'image': case 'video':
      return (
        <View >
          <Image style={{ width: '100%' }} src={element.url} />
          {childComponents}
        </View>
      )
    case 'background-color':
      return (<View style={{ backgroundColor: element.color }} />);
    default:
      return (
        <Text 
          style={element.noPadding ? { paddingBottom: 1 } : { paddingBottom: 10 }} 
        >
          {childComponents}
        </Text>
      );
  }
}

const Leaf = ({ children, leaf, minimalFormatting, fontRatio }: LeafProps) => {
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
