import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

// Check for required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function runMigration(filePath: string): Promise<void> {
  try {
    const fileName = path.basename(filePath);
    console.log(`📦 Processing migration: ${fileName}`);

    // Read and split SQL file into individual statements
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(
      `⚠️ For migration ${fileName}, please execute the SQL directly in the Supabase SQL Editor`
    );
    console.log(`SQL contents for ${fileName}:`);
    console.log("-------------------------------------");
    console.log(sql);
    console.log("-------------------------------------");
    console.log("");
  } catch (err) {
    console.error(
      `❌ Failed to process migration ${path.basename(filePath)}:`,
      err
    );
    throw err;
  }
}

async function main() {
  console.log("🚀 Starting database setup...");
  console.log(
    "⚠️ Note: You will need to manually run these SQL scripts in the Supabase SQL Editor."
  );
  console.log("�� Instructions:");
  console.log("  1. Go to your Supabase project dashboard");
  console.log('  2. Click on "SQL Editor" in the left sidebar');
  console.log("  3. Create a new query");
  console.log("  4. Copy-paste the SQL content for each migration");
  console.log("  5. Run each SQL script in order");
  console.log("");

  try {
    // Get all migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Run them in order by filename

    console.log(`Found ${migrationFiles.length} migration files to process`);

    // Process migrations sequentially
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      await runMigration(filePath);
    }

    console.log("✅ All migrations processed successfully");
    console.log(
      "⚠️ Please run these SQL scripts manually in the Supabase SQL Editor"
    );
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log("🏁 Database setup process complete");
  });
