import { IconBase } from '../icon-base';
import type { IconComponent } from '../types';

export const CloseIcon: IconComponent = props => (
  <IconBase {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
);
