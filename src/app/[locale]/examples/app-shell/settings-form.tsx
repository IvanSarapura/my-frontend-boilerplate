'use client';

import { Cluster, Stack } from '@/components/layouts';
import { Avatar, Button, Card, Input, ToggleSwitch } from '@/components/ui';

import styles from './app-shell.module.css';

interface SettingsFormLabels {
  profileTitle: string;
  nameLabel: string;
  nameValue: string;
  emailLabel: string;
  emailValue: string;
  prefsTitle: string;
  notif1: string;
  notif2: string;
  saveAction: string;
}

/** Interactive island for the app-shell preset — the form controls (`Input`,
 * `ToggleSwitch`) need a client boundary. Wireframe stub: no submit handler. */
export function SettingsForm({ labels }: { labels: SettingsFormLabels }) {
  return (
    <Stack gap={6}>
      <Card variant="outlined">
        <Stack gap={4}>
          <Cluster gap={4}>
            <Avatar name={labels.nameValue} alt={labels.nameValue} size="lg" />
            <h2 className={styles.panelTitle}>{labels.profileTitle}</h2>
          </Cluster>
          <Input
            label={labels.nameLabel}
            name="name"
            defaultValue={labels.nameValue}
          />
          <Input
            label={labels.emailLabel}
            name="email"
            type="email"
            defaultValue={labels.emailValue}
          />
        </Stack>
      </Card>

      <Card variant="outlined">
        <Stack gap={4}>
          <h2 className={styles.panelTitle}>{labels.prefsTitle}</h2>
          <ToggleSwitch label={labels.notif1} name="notif1" defaultChecked />
          <ToggleSwitch label={labels.notif2} name="notif2" />
        </Stack>
      </Card>

      <Cluster className={styles.actions}>
        <Button type="button" variant="primary">
          {labels.saveAction}
        </Button>
      </Cluster>
    </Stack>
  );
}
