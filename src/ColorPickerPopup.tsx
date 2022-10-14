import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import Color from 'color';
import React, { useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { ChromePicker } from 'react-color';

type Props = {
  currentColor: string,
  setColor: (newColor: string) => void,
  colorPickerId: string,
  onBeforeToggleColorPicker: () => void,
  icon: IconDefinition,
};

const PopupColorPicker = ({ onBeforeToggleColorPicker, icon, currentColor, setColor, colorPickerId }: Props) => {
  const [shouldShowColorPicker, toggleColorPicker] = useState(false);
  const colorRef = useRef<any>();
  const [newColor, setNewColor] = useState<string>(currentColor);
  return (
    <>
      <Button
        ref={colorRef}
        variant="link"
        onClick={() => {
          onBeforeToggleColorPicker();
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
          setColor(newColor);
        }}
        show={shouldShowColorPicker}
        rootClose
        target={colorRef}
      >
        <Popover id={colorPickerId}>
          <ChromePicker
            color={newColor != null ? newColor : currentColor}
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
