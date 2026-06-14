import type { ReactNode } from 'react';

import { Grid } from '@/components/layouts';
import type { Cols } from '@/components/layouts/types';
import { Card } from '@/components/ui';

import styles from './feature-grid.module.css';

interface Feature {
  icon?: ReactNode;
  title: string;
  description: ReactNode;
}

interface FeatureGridProps {
  features: Feature[];
  cols?: Cols;
  className?: string;
}

/** Responsive grid of feature cards (Grid + Card). */
export function FeatureGrid({
  features,
  cols = 3,
  className,
}: FeatureGridProps) {
  return (
    <Grid cols={cols} className={className}>
      {features.map(feature => (
        <Card key={feature.title}>
          {feature.icon && <div className={styles.icon}>{feature.icon}</div>}
          <h3 className={styles.title}>{feature.title}</h3>
          <p className={styles.description}>{feature.description}</p>
        </Card>
      ))}
    </Grid>
  );
}
