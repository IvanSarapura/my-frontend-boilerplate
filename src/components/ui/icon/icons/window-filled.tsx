import { IconBase } from '../icon-base';
import type { IconComponent } from '../types';

export const WindowFilledIcon: IconComponent = props => (
  <IconBase {...props}>
    <path
      fill="currentColor"
      stroke="none"
      d="M11 11V3H5C3.9 3 3 3.9 3 5V11H11ZM13 11H21V5C21 3.9 20.1 3 19 3H13V11ZM11 13H3V19C3 20.1 3.9 21 5 21H11V13ZM13 13V21H19C20.1 21 21 20.1 21 19V13H13Z"
    />
  </IconBase>
);
