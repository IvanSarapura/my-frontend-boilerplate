import { IconBase } from '../icon-base';
import type { IconComponent } from '../types';

export const LabelIcon: IconComponent = props => (
  <IconBase {...props}>
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.6113 5C16.2813 5 16.8813 5.33 17.2413 5.84L21.2013 11.42C21.4513 11.77 21.4513 12.23 21.2013 12.58L17.2413 18.16C16.8813 18.67 16.2813 19 15.6113 19L4.61127 18.99C3.51127 18.99 2.61127 18.1 2.61127 17V7C2.61127 5.9 3.51127 5.01 4.61127 5.01L15.6113 5ZM4.5 17H15.5L19.05 12L15.5 7H4.5V17Z"
    />
  </IconBase>
);
