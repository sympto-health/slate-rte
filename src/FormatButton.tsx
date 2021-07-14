import React from 'react'
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Dropdown } from 'react-bootstrap'
import styled from 'styled-components'
import './FormatButton.css'

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  ::after {
    display: none;
  }
`;

const FormatButton = ({ icon, isActive, onClick, className, itemColor, type }: {
  icon: IconDefinition,
  isActive: boolean,
  className?: string,
  itemColor?: null | string, // color of item (overrides default colors)
  onClick?: null | (() => void),
  type: 'button' | 'dropdown',
}) => {
  const ComponentItem = type === 'button' ? Button : StyledDropdownToggle;
  return (
    // @ts-ignore
    <ComponentItem
      style={itemColor ? { color: itemColor } : {}}
      className={cx(className, 'SlateRTE-button mx-1', {
        'text-dark': !isActive && itemColor == null,
        'text-primary': isActive && itemColor == null,
      })}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      variant="link"
    >
      <FontAwesomeIcon icon={icon} />
    </ComponentItem>
  );
};

FormatButton.defaultProps = {
  className: '',
  style: {},
  itemColor: null,
  type: 'button',
  onClick: null,
};

export default FormatButton
