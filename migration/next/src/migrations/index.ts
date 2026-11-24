import * as migration_20261007_221720_initial from './20261007_221720_initial';
import * as migration_20261008_105450_leads from './20261008_105450_leads';
import * as migration_20261124_120810_contacts from './20261124_120810_contacts';

export const migrations = [
  {
    up: migration_20261007_221720_initial.up,
    down: migration_20261007_221720_initial.down,
    name: '20261007_221720_initial',
  },
  {
    up: migration_20261008_105450_leads.up,
    down: migration_20261008_105450_leads.down,
    name: '20261008_105450_leads',
  },
  {
    up: migration_20261124_120810_contacts.up,
    down: migration_20261124_120810_contacts.down,
    name: '20261124_120810_contacts'
  },
];
