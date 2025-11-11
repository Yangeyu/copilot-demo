import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;

export const getDb = async () => {
  if (db) return db
  const client = postgres(process.env.DATABASE_URL!);
  db = drizzle(client, { schema });
  return db
}


