import { IconBase } from '../icon-base';
import type { IconComponent } from '../types';

export const CloseAltIcon: IconComponent = props => (
  <IconBase {...props}>
    <line x1="2" y1="2" x2="22" y2="22" />
    <line x1="22" y1="2" x2="2" y2="22" />
  </IconBase>
);
