import React from 'react'
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap'
import './FormatButton.css'

const FormatButton = ({ icon, isActive, onClick }: {
  icon: IconDefinition,
  isActive: boolean,
  onClick: () => void,
}) => (
  <Button 
    variant="link"
    className={cx('SlateRTE-button mx-1', {
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


export default FormatButton
