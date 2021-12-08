import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  View, Text, Image, Link,
} from '@react-pdf/renderer';
import _ from 'lodash';
import getBackgroundColor from './getBackgroundColor';
import { ASCIIColor } from './SlateTypes';
import { SlateNode, BaseElementProps, BaseLeafProps } from './SlateNode';
import AsyncFileLoad from './AsyncFileLoad';
import ImageSizeRender from './ImageSizeRender';

const DEFAULT_EM_SIZE = 16;

type ParentStyles = {
  fontSize: number,
  backgroundColor?: ASCIIColor,
};

type ElementProps = {
  styles: ParentStyles,
  fontRatio: number,
  children: (curStyles: ParentStyles) => (JSX.Element),
} & Omit<BaseElementProps, 'children'>;

type LeafProps = {
  styles: ParentStyles,
  children: (curStyles: ParentStyles) => (JSX.Element),
  variables: { [variableName: string]: string },
} & Omit<BaseLeafProps, 'children'>;

type Props = {
  value: SlateNode[],
  minimalFormatting: boolean,
  onFileLoad: (opts: { id: string }) => Promise<{ url: string }>,
  options?: {
    // effectively specifies what 1em is equal to, based on the font-size
    // optional, defaults 1em = 16px
    defaultFontSizePx: number,
  },
  variables: { [variableName: string]: string },
};

const SlatePDF = ({
  value, options, minimalFormatting, onFileLoad, variables,
}: Props): JSX.Element => {
  const fontRatio = options ?  DEFAULT_EM_SIZE / options.defaultFontSizePx : 1;
  const backgroundColor = getBackgroundColor(value);
  const renderSlateItems = (slateContent: SlateNode[], styles: ParentStyles) => (slateContent
    .map((metadata) => (
      metadata.type
        ? (
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
            leaf={metadata}
            minimalFormatting={minimalFormatting}
            styles={styles}
            variables={variables}
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

const INLINE_STYLE: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' } = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const SlateElement = ({
  minimalFormatting, children, element, styles, fontRatio, onFileLoad,
}: ElementProps): JSX.Element => {
  const childComponents = (curStyles: ParentStyles) => (_.compact([
    element.text && element.text.length > 0 ? <Text key={uuidv4()}>{element.text}</Text> : null,
    <View style={INLINE_STYLE} key={uuidv4()}>{children(curStyles)}</View>,
  ]));

  switch (element.type) {
    case 'block-quote':
      return (
        <View
          style={{
            ...INLINE_STYLE,
            borderLeft: '2px solid #ddd',
            marginLeft: 0,
            marginRight: 0,
            paddingLeft: 10,
            marginBottom: 10,
            color: '#aaa',
          }}
        >
          {childComponents(styles)}
        </View>
      );
    case 'bulleted-list':
      return <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>{childComponents}</View>
    case 'heading-one':
      return <View style={{ ...INLINE_STYLE, fontSize: 40 * fontRatio }}>{childComponents({ ...styles, fontSize: 40 * fontRatio })}</View>;
    case 'heading-two':
      return <View style={{ ...INLINE_STYLE, fontSize: 28 * fontRatio }}>{childComponents({ ...styles, fontSize: 28 * fontRatio })}</View>;
    case 'list-item': case 'numbered-list':
      return (
        <View
          style={INLINE_STYLE}
        >
          {[<Text key={uuidv4()}> • </Text>, ...childComponents(styles)]}
        </View>
      );
    case 'left-align':
      return (
        <View style={{ ...INLINE_STYLE, textAlign: !minimalFormatting ? 'left' : undefined }}>
          {childComponents(styles)}
        </View>
      );
    case 'right-align':
      return (
        <View style={{ textAlign: !minimalFormatting ? 'right' : undefined, ...INLINE_STYLE }}>
          {childComponents(styles)}
        </View>
      );
    case 'center-align':
      return (
        <View style={{ textAlign: !minimalFormatting ? 'center' : undefined, ...INLINE_STYLE }}>
          {childComponents(styles)}
        </View>
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
        <View style={INLINE_STYLE}>
          <View style={INLINE_STYLE}>
            <AsyncFileLoad onFileLoad={onFileLoad} nodeData={element}>
              {(imageData) => (
                <>
                  {imageData && (
                    <ImageSizeRender imageURL={imageData.url}>
                      {({ width, height }) => (
                        <Image 
                          cache 
                          style={{ ...INLINE_STYLE, width, height, objectFit: 'contain' }} 
                          src={imageData.url} 
                        />
                      )}
                    </ImageSizeRender>
                  )}
                </>
              )}
            </AsyncFileLoad>
          </View>
          {childComponents(styles)}
        </View>
      )
    case 'background-color':
      return (<View style={{ backgroundColor: element.color }} />);
    case 'variable':
      // variable handled by leaf
      return (
        <View style={INLINE_STYLE}>
          {childComponents(styles)}
        </View>
      );
    default:
      return (
        <View style={element.noPadding ? { ...INLINE_STYLE, paddingBottom: 1 } : { ...INLINE_STYLE, paddingBottom: 10 }}>
          {childComponents(styles)}
        </View>
      );
  }
}


const SlateLeaf = ({
  children, leaf, minimalFormatting, styles, variables,
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

  // if variable type leaf, then child must include variable name
  const baseChild = _.compact([
    leaf.variable ? variables[leaf.variable.variableName] : null,
    children({ backgroundColor: finalBackgroundColor, fontSize: finalFontSize }),
  ]);
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
          {baseChild}
        </Text>,
      ])}
    </>
  );

  const styledContent: JSX.Element = newStyles.reduce((currentChild: JSX.Element, { type, ...currentStyle }) => (
    type === 'Text'
      ? <Text key={uuidv4()} style={currentStyle}>{currentChild}</Text>
      : <View key={uuidv4()} style={currentStyle}>{currentChild}</View>
  ), baseChildComponents);

  return styledContent;
}

export default SlatePDF;
