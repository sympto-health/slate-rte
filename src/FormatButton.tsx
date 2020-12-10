import React from 'react'
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import './FormatButton.css'

const FormatButton = ({ icon, isActive, onClick, className, itemColor }: {
  icon: IconDefinition,
  isActive: boolean,
  className?: string,
  itemColor?: null | string, // color of item (overrides default colors)
  onClick: () => void,
}) => (
  <Button 
    variant="link"
    style={itemColor ? { color: itemColor } : {}}
    className={cx(className, 'SlateRTE-button mx-1', {
      'text-dark': !isActive && itemColor == null,
      'text-primary': isActive && itemColor == null,
    })}
    onMouseDown={event => {
      event.preventDefault()
      onClick();
    }}
  >
    <FontAwesomeIcon icon={icon} />
  </Button>
);

FormatButton.defaultProps = {
  className: '',
  style: {},
  itemColor: null,
};

export default FormatButton
