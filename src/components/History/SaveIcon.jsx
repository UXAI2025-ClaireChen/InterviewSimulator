import React from 'react';
import { Icon } from '@chakra-ui/react';

/**
 * Save icon component
 */
const SaveIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6V6z"
    />
  </Icon>
);

export default SaveIcon;