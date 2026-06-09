import db from '../db.js';

/**
 * Checks if an email address is already registered in the database.
 * 
 * @param {string} email - The email address to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;
    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};

/**
 * Saves a new user to the database with a hashed password.
 * 
 * @param {string} name - The user's full name
 * @param {string} email - The user's email address
 * @param {string} hashedPassword - The bcrypt-hashed password
 * @param {number} roleId - The user's role id
 * @returns {Promise<Object>} The newly created user record (without password)
 */
const saveUser = async (name, email, hashedPassword, roleId = 1) => {
    const query = `
        INSERT INTO users (name, email, password, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role_id, created_at
    `;
    const result = await db.query(query, [name, email, hashedPassword, roleId]);
    return result.rows[0];
};

/**
 * Retrieves all registered users from the database.
 * 
 * @returns {Promise<Array>} Array of user records (without passwords)
 */
const getAllUsers = async () => {
    const query = `
        SELECT 
            users.id,
            users.name,
            users.email,
            users.created_at,
            roles.name AS role_name
        FROM users
        LEFT JOIN roles ON users.role_id = roles.id
        ORDER BY users.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

export { emailExists, saveUser, getAllUsers };