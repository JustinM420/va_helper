CREATE TABLE IF NOT EXISTS "deployments" (
	"deployment_id" serial PRIMARY KEY NOT NULL,
	"service_history_id" integer NOT NULL,
	"location" varchar(256) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"operation_name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "disabilities" (
	"disability_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"diagnostic_code" varchar(256),
	"disability_rating" integer NOT NULL,
	"effective_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_histories" (
	"service_history_id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"branch_of_service" varchar(256) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"discharge_status" varchar(256),
	"rank_at_discharge" varchar(256),
	"mos" varchar(256)
);
--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "service_history_id" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "combined_disability_rating" integer;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "discharge_status" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deployments" ADD CONSTRAINT "deployments_service_history_id_service_histories_service_history_id_fk" FOREIGN KEY ("service_history_id") REFERENCES "public"."service_histories"("service_history_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "disabilities" ADD CONSTRAINT "disabilities_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_histories" ADD CONSTRAINT "service_histories_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claims" ADD CONSTRAINT "claims_service_history_id_service_histories_service_history_id_fk" FOREIGN KEY ("service_history_id") REFERENCES "public"."service_histories"("service_history_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_profiles" DROP COLUMN IF EXISTS "disability_rating";