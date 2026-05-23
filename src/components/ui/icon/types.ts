import type { ReactNode, SVGAttributes } from 'react';

export type IconBaseProps = {
  size?: number | undefined;
  className?: string | undefined;
  'aria-label'?: string | undefined;
  children?: ReactNode;
} & Omit<SVGAttributes<SVGSVGElement>, 'size' | 'children'>;

export type IconComponent = (
  props: Omit<IconBaseProps, 'children'>,
) => ReactNode;
