import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  View, Text, Image, Link,
} from '@react-pdf/renderer';
import _ from 'lodash';
import { RenderLeafProps, RenderElementProps } from 'slate-react';
import getBackgroundColor from './getBackgroundColor';
import { SlateNode, BaseElementProps, BaseLeafProps, ASCIIColor } from './SlateNode';
import AsyncFileLoad from './AsyncFileLoad';

const DEFAULT_EM_SIZE = 16;

type ParentStyles = { 
  fontSize: number, 
  backgroundColor?: ASCIIColor,
};

type ElementProps = { 
  attributes: RenderElementProps['attributes'], 
  styles: ParentStyles,
  fontRatio: number,
  children: (curStyles: ParentStyles) => (JSX.Element),
} & Omit<BaseElementProps, 'children'>;

type LeafProps = {
  attributes: RenderLeafProps['attributes'], 
  styles: ParentStyles,
  children: (curStyles: ParentStyles) => (JSX.Element),
} & Omit<BaseLeafProps, 'children'>;

const SlatePDF = ({ 
  value, options, minimalFormatting, onFileLoad,
}: {
  value: SlateNode[],
  minimalFormatting: boolean,
  onFileLoad?: (opts: { id: string }) => Promise<{ url: string }>,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number, 
  },
}) => {
  const fontRatio = options ?  DEFAULT_EM_SIZE / options.defaultFontSizePx : 1;
  const backgroundColor = getBackgroundColor(value);
  const renderSlateItems = (slateContent: SlateNode[], styles: ParentStyles) => (slateContent
    .map((metadata) => (
      metadata.type 
        ? (
          // @ts-ignore
          <SlateElement 
            key={uuidv4()} 
            styles={styles} 
            minimalFormatting={minimalFormatting} 
            element={metadata}
            fontRatio={fontRatio}
            onFileLoad={onFileLoad}
           >
            {(curStyles: ParentStyles) => (
              <>
                {renderSlateItems(metadata.children || [], curStyles)}
              </>
            )}
          </SlateElement>
        )
        : (
          <SlateLeaf 
            key={uuidv4()} 
            // @ts-ignore
            leaf={metadata} 
            minimalFormatting={minimalFormatting}
            styles={styles} 
          >
            {(curStyles: ParentStyles) => (
              <>
                {renderSlateItems(metadata.children || [], curStyles)}
              </>
            )}
          </SlateLeaf>
        )
    )));

  return (
    <View 
      style={{
        backgroundColor: backgroundColor && !minimalFormatting ? backgroundColor : undefined,
        fontWeight: 400,
        color: backgroundColor && minimalFormatting ? backgroundColor : undefined,
        fontSize: fontRatio * DEFAULT_EM_SIZE, 
      }}
    >
      {renderSlateItems(
        value, 
        { 
          fontSize: fontRatio * DEFAULT_EM_SIZE, 
        },
      )} 
    </View>
  );
}

const SlateElement = ({ 
  minimalFormatting, children, element, styles, fontRatio, onFileLoad,
}: ElementProps): JSX.Element => {
  const childComponents = (curStyles: ParentStyles) => (_.compact([
    element.text ? <Text key={uuidv4()}>{element.text}</Text> : null,
    <Text key={uuidv4()}>{children(curStyles)}</Text>,
  ]));

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
            color: '#aaa'
          }}
        >
          {childComponents(styles)}
        </Text>
      );
    case 'bulleted-list':
      return <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>{childComponents}</View>
    case 'heading-one':
      return <Text style={{ fontSize: 40 * fontRatio }}>{childComponents({ ...styles, fontSize: 40 * fontRatio })}</Text>;
    case 'heading-two':
      return <Text style={{ fontSize: 28 * fontRatio }}>{childComponents({ ...styles, fontSize: 28 * fontRatio })}</Text>;
    case 'list-item': case 'numbered-list':
      return (
        <Text style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          {[<Text key={uuidv4()}> • </Text>, ...childComponents(styles)]}
        </Text>
      );
    case 'left-align':
      return (
        <Text style={{ textAlign: !minimalFormatting ? 'left' : undefined }}>
          {childComponents(styles)}
        </Text>
      );
    case 'right-align':
      return (
        <Text style={{ textAlign: !minimalFormatting ? 'right' : undefined }}>
          {childComponents(styles)}
        </Text>
      );
    case 'center-align':
      return (
        <Text style={{ textAlign: !minimalFormatting ? 'center' : undefined }}>
          {childComponents(styles)}
        </Text>
      );
    case 'horizontal-line': 
      return minimalFormatting
        ? <>{childComponents(styles)}</>
        : (
          <View>
            <View 
              style={{ 
                marginVertical: 10,
                borderTop: '1px solid rgba(0,0,0,.1)',
              }}
            />
            {childComponents(styles)}
          </View>
        )
    case 'link':
      return (
        <Link src={element.url}>
          {childComponents(styles)}
        </Link>
      )
    case 'image': case 'video':
      return (
        <View>
          <View style={{ width: '100%', height: '100%' }}>
            <AsyncFileLoad onFileLoad={onFileLoad} nodeData={element}>
              {({ url }) => (
                <Image style={{ width: '50vw', objectFit: 'cover' }} src={url} />
              )}
            </AsyncFileLoad>
          </View>
          {childComponents(styles)}
        </View>
      )
    case 'background-color':
      return (<View style={{ backgroundColor: element.color }} />);
    default:
      return (
        <Text 
          style={element.noPadding ? { paddingBottom: 1 } : { paddingBottom: 10 }} 
        >
          {childComponents(styles)}
        </Text>
      );
  }
}


const SlateLeaf = ({ 
  children, leaf, minimalFormatting, styles, 
}: LeafProps): JSX.Element => {
  const newStyles = _.compact([
    // bold
    leaf.bold ? { fontWeight: 700, type: 'Text' } : null,

    // code
    leaf.code ? {  
      color: '#e83e8c', fontFamily: 'monospace', fontSize: styles.fontSize * 0.875, type: 'Text'
    } : null,

    // italic
    leaf.italic ? { fontStyle: 'italic', type: 'Text' } : null,

    // underline
    leaf.underline ? ({ textDecoration: 'underline', type: 'Text' } as any) : null,

    // font-size
    leaf['font-size'] ? { type: 'Text', fontSize: styles.fontSize * (leaf['font-size'].value / DEFAULT_EM_SIZE) } : null,

    // font-weight
    leaf['font-weight'] ? { type: 'Text', fontWeight: leaf['font-weight'].value } : null,

    // text-color
    leaf['text-color'] ? { type: 'Text', color: minimalFormatting ? undefined : leaf['text-color'].color } : null,

    // highlight-color
    leaf['highlight-color'] ? { type: 'View', backgroundColor: leaf['highlight-color'].color } : null,
  ]);
  const finalFontSize: number = newStyles.reduce(
    (fontSize, currentStyle) => (currentStyle.fontSize != null ? currentStyle.fontSize : fontSize), 
    styles.fontSize,
  );
  const finalBackgroundColor: undefined | string = newStyles.reduce(
    (backgroundColor, currentStyle) => (currentStyle.backgroundColor != null ? currentStyle.backgroundColor : backgroundColor), 
    styles.backgroundColor,
  );

  const baseChildComponents = (
    <>
      {_.compact([
        leaf.text 
        ? (
          <Text 
            style={{ backgroundColor: finalBackgroundColor }} 
            key={uuidv4()}
          >
            {leaf.text}
          </Text> 
        )
        : null,
        <Text 
          style={{ backgroundColor: finalBackgroundColor }} 
          key={uuidv4()}
        >
          {children({ backgroundColor: finalBackgroundColor, fontSize: finalFontSize })}
        </Text>,
      ])}
    </>
  );

  const styledContent: JSX.Element = newStyles.reduce((currentChild: JSX.Element, { type, ...currentStyle }) => (
    type === 'Text' 
      ? <Text style={currentStyle}>{currentChild}</Text>
      : <View style={currentStyle}>{currentChild}</View>
  ), baseChildComponents);

  return styledContent;
}

export default SlatePDF;
