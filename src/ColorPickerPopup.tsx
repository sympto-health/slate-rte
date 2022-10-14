import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Color from 'color';
import React, { useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { ChromePicker } from 'react-color';

type Props = {
  currentColor: null | string,
  setColor: (newColor: string) => void,
  colorPickerId: string,
  icon: IconDefinition,
};

const PopupColorPicker = ({ icon, currentColor, setColor, colorPickerId }: Props) => {
  const [shouldShowColorPicker, toggleColorPicker] = useState(false);
  const colorRef = useRef<any>();
  const [newColor, setNewColor] = useState<string | null>(null);
  return (
    <>
      <Button
        ref={colorRef}
        variant="link"
        onClick={() => {
          toggleColorPicker(!shouldShowColorPicker);
        }}
        className={cx({
          'text-dark': currentColor == null,
        })}
        style={currentColor != null
          ? {
            color: Color(currentColor).isDark()
              ? currentColor
              : Color(currentColor).darken(0.2).hex(),
          }
          : {}}
      >
        <FontAwesomeIcon icon={(icon as IconProp)} />
      </Button>
      <Overlay
        placement="auto"
        onHide={() => {
          toggleColorPicker(false);
          if (newColor) {
            setColor(newColor);
          }
        }}
        show={shouldShowColorPicker}
        rootClose
        target={colorRef}
      >
        <Popover id={colorPickerId}>
          <ChromePicker
            color={newColor ? newColor : (currentColor || '#ffffff00')}
            onChangeComplete={(newCol) => {
              setNewColor(Color(newCol.hex).alpha(newCol.rgb.a == null ? 1 : newCol.rgb.a).toString());
            }}
          />
        </Popover>
      </Overlay>
    </>
  );
};

export default PopupColorPicker;
