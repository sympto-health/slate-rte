import React from 'react'
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import CSS from 'csstype';
import './FormatButton.css'

const FormatButton = ({ icon, isActive, onClick, className, style }: {
  icon: IconDefinition,
  isActive: boolean,
  className?: string,
  style?: CSS.Properties,
  onClick: () => void,
}) => (
  <Button 
    variant="link"
    style={style}
    className={cx(className, 'SlateRTE-button mx-1', {
      'text-dark': !isActive,
      'text-primary': isActive,
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
};

export default FormatButton
