import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor, EXPERIMENTAL_TableFeature, FixedToolbarFeature } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { buildConfig } from 'payload';
import { ru } from '@payloadcms/translations/languages/ru';
import sharp from 'sharp';
import { Users, Media, Categories, Products, News, Documents } from './collections';
import { cmsEmailAdapter } from './lib/mail-transport';
import { MAX_DOCUMENT_BYTES } from './lib/media-policy';
import { Leads } from './collections/Leads';
import { analyticsEndpoint } from './lib/metrika';
import { adminSearchEndpoint } from './lib/admin-search';
import { databasePool } from './lib/database-pool';

const directory = path.dirname(fileURLToPath(import.meta.url));
const secret = process.env.PAYLOAD_SECRET;
if (!secret || secret.length < 32) throw new Error('PAYLOAD_SECRET must contain at least 32 characters');
export default buildConfig({
  routes: { admin: '/admin' },
  serverURL: process.env.PUBLIC_SITE_URL || 'http://127.0.0.1:3100',
  email: cmsEmailAdapter,
  i18n: { supportedLanguages: { ru }, fallbackLanguage: 'ru' },
  admin: { user: 'users', theme: 'light', dateFormat: 'dd.MM.yyyy, HH:mm', meta: { titleSuffix: ' · КЭМЗ / OJ CMS', icons: { icon: '/favicon.ico', shortcut: '/favicon.ico' } }, importMap: { baseDir: directory }, components: {
    beforeLogin: ['/components/cms/OJLoginIntro'],
    afterLogin: ['/components/cms/OJLoginCredit'],
    Nav: '/components/cms/OJNav',
    header: ['/components/cms/OJHeader'],
    views: { dashboard: { Component: '/components/cms/OJDashboard' } },
    graphics: { Logo: '/components/cms/OJBrand', Icon: '/components/cms/OJBrand' },
  } },
  collections: [Users, Media, Categories, Products, News, Documents, Leads],
  endpoints: [analyticsEndpoint, adminSearchEndpoint],
  editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature(), EXPERIMENTAL_TableFeature()] }),
  secret,
  db: postgresAdapter({ pool: databasePool() }),
  typescript: { outputFile: path.resolve(directory, 'payload-types.ts') },
  sharp,
  upload: {
    limits: { fileSize: MAX_DOCUMENT_BYTES, files: 1 },
    requestSizeLimit: MAX_DOCUMENT_BYTES + 2 * 1024 * 1024,
    abortOnLimit: true,
    responseOnLimit: 'Файл слишком большой. Фото: до 10 МБ; PDF и DOCX: до 20 МБ.',
  },
  plugins: process.env.S3_BUCKET ? [s3Storage({
    bucket: process.env.S3_BUCKET,
    collections: { media: { prefix: 'kemz/media' } },
    config: { endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION,
      credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' } },
  })] : [],
});
