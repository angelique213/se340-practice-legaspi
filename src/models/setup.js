import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up role-based access control tables and columns.
 */
const setupRoles = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS roles (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT
        );

        INSERT INTO roles (id, name, description)
        VALUES
            (1, 'user', 'Standard user with basic access'),
            (2, 'admin', 'Administrator with full system access')
        ON CONFLICT (id) DO NOTHING;

        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role_id INTEGER;

        UPDATE users
        SET role_id = 1
        WHERE role_id IS NULL;

        ALTER TABLE users
        ALTER COLUMN role_id SET DEFAULT 1;

        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'users_role_id_fkey'
            ) THEN
                ALTER TABLE users
                ADD CONSTRAINT users_role_id_fkey
                FOREIGN KEY (role_id)
                REFERENCES roles(id);
            END IF;
        END $$;
    `);

    console.log('Roles initialized successfully');
};

/**
 * Sets up the database by running the seed.sql file if needed.
 * Checks if faculty table has data - if not, runs a full re-seed.
 */
const setupDatabase = async () => {
    let hasData = false;

    try {
        const result = await db.query(
            "SELECT EXISTS (SELECT 1 FROM faculty LIMIT 1) as has_data"
        );
        hasData = result.rows[0]?.has_data || false;
    } catch (error) {
        hasData = false;
    }

    if (hasData) {
        console.log('Database already seeded');
        await setupRoles();
        return true;
    }

    console.log('Seeding database...');
    const seedPath = join(__dirname, 'sql', 'seed.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    await db.query(seedSQL);

    const practicePath = join(__dirname, 'sql', 'practice.sql');

    if (fs.existsSync(practicePath)) {
        const practiceSQL = fs.readFileSync(practicePath, 'utf8');
        await db.query(practiceSQL);
        console.log('Practice database tables initialized');
    }

    await setupRoles();

    console.log('Database seeded successfully');

    return true;
};

/**
 * Tests the database connection by executing a simple query.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
};

export { setupDatabase, testConnection };