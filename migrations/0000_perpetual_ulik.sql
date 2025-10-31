CREATE TABLE "actions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"category" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"quantity" numeric(10, 2),
	"unit" varchar,
	"co2_reduced" numeric(10, 2) NOT NULL,
	"water_saved" numeric(10, 2) NOT NULL,
	"waste_diverted" numeric(10, 2) NOT NULL,
	"points_earned" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"proof_url" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"account_type" varchar DEFAULT 'individual' NOT NULL,
	"company_name" varchar,
	"eco_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_actions_user_id" ON "actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_actions_created_at" ON "actions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");