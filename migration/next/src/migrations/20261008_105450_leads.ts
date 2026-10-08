import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'in_progress', 'closed', 'spam');
  CREATE TYPE "public"."enum_leads_mail_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"notes" varchar,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"technical_equipment" varchar,
  	"technical_machine" varchar,
  	"technical_power" varchar,
  	"technical_company" varchar,
  	"source_path" varchar,
  	"consent_at" timestamp(3) with time zone NOT NULL,
  	"consent_version" varchar NOT NULL,
  	"mail_status" "enum_leads_mail_status" DEFAULT 'pending' NOT NULL,
  	"mail_sent_at" timestamp(3) with time zone,
  	"request_id" varchar NOT NULL,
  	"request_hash" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_mail_status_idx" ON "leads" USING btree ("mail_status");
  CREATE UNIQUE INDEX "leads_request_id_idx" ON "leads" USING btree ("request_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  DROP TABLE "leads";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_mail_status";`)
}
