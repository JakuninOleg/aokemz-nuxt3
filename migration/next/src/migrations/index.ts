import * as migration_20261007_221720_initial from './20261007_221720_initial';
import * as migration_20261008_105450_leads from './20261008_105450_leads';

export const migrations = [
  {
    up: migration_20261007_221720_initial.up,
    down: migration_20261007_221720_initial.down,
    name: '20261007_221720_initial',
  },
  {
    up: migration_20261008_105450_leads.up,
    down: migration_20261008_105450_leads.down,
    name: '20261008_105450_leads'
  },
];
