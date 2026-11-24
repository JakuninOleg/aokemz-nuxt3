import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { CONTACTS_ADDRESS, CONTACTS_LIST } from '../lib/contacts-content'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contacts_departments_icon" AS ENUM('reception', 'sales', 'supply', 'otk', 'quality', 'hr');
  CREATE TABLE "contacts_departments_phones" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "number" varchar NOT NULL
  );

  CREATE TABLE "contacts_departments" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "position" varchar NOT NULL,
    "person" varchar,
    "email" varchar,
    "icon" "enum_contacts_departments_icon" DEFAULT 'reception' NOT NULL
  );

  CREATE TABLE "contacts" (
    "id" serial PRIMARY KEY NOT NULL,
    "address" varchar DEFAULT '624930, Свердловская область,
г. Карпинск, ул. Карпинского, 1' NOT NULL,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "contacts_departments_phones" ADD CONSTRAINT "contacts_departments_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_departments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_departments" ADD CONSTRAINT "contacts_departments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contacts_departments_phones_order_idx" ON "contacts_departments_phones" USING btree ("_order");
  CREATE INDEX "contacts_departments_phones_parent_id_idx" ON "contacts_departments_phones" USING btree ("_parent_id");
  CREATE INDEX "contacts_departments_order_idx" ON "contacts_departments" USING btree ("_order");
  CREATE INDEX "contacts_departments_parent_id_idx" ON "contacts_departments" USING btree ("_parent_id");`)

  await payload.updateGlobal({
    slug: 'contacts',
    req,
    data: { address: CONTACTS_ADDRESS.lines.join('\n'), departments: CONTACTS_LIST },
  })
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contacts_departments_phones" CASCADE;
  DROP TABLE "contacts_departments" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TYPE "public"."enum_contacts_departments_icon";`)
}
