import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { inspections, fieldRegistrations } from "./src/models/schema.js";

async function run() {
  const connection = await mysql.createConnection('mysql://root:Satish@435@127.0.0.1:3306/SeedInspection_DB');
  const db = drizzle(connection);
  const fields = await db.select().from(fieldRegistrations);
  const data = fields.map(r => ({ id: r.id, inspectionId: r.inspectionId, url: r.fieldImageUrl ? r.fieldImageUrl.substring(0, 80) : null }));
  console.dir(data, { depth: null });
  process.exit(0);
}
run();
