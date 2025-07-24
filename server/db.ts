import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './db/schema';
import postgres from 'postgres';
import { neonConfig } from '@neondatabase/serverless';
// Remove unused ws import

neonConfig.webSocketConstructor = WebSocket;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/resume_builder';

// Create the connection
const client = postgres(connectionString, {
  // redacted
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Test database connection
export async function testConnection() {
  // redacted
}

// Initialize database (create tables if they don't exist)
export async function initializeDatabase() {
  // redacted
}