import dotenv from "dotenv";
import fs from "fs";

export function loadEnv() {
  if (fs.existsSync(`.env`)) {
    dotenv.config({ path: ".env" });
  }
  const env = process.env.ENV ?? "local";
  if (fs.existsSync(`.env.${env}`)) {
    dotenv.config({ path: `.env.${env}`, override: true });
  }
}