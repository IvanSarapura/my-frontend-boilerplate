import { IconBase } from '../icon-base';
import type { IconComponent } from '../types';

export const MinusIcon: IconComponent = props => (
  <IconBase {...props}>
    <path
      fill="currentColor"
      stroke="none"
      d="M7 11H17C17.55 11 18 11.45 18 12C18 12.55 17.55 13 17 13H7C6.45 13 6 12.55 6 12C6 11.45 6.45 11 7 11Z"
    />
  </IconBase>
);
