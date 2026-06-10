import db from '../db.js';

/**
 * Checks if an email address is already registered.
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists
    `;

    const result = await db.query(query, [email]);
    return result.rows[0].exists;
};

/**
 * Saves a new user with a default role.
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
 * Retrieves all registered users with role information.
 */
const getAllUsers = async () => {
    const query = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.created_at,
            roles.name AS "roleName"
        FROM users
        LEFT JOIN roles
            ON users.role_id = roles.id
        ORDER BY users.created_at DESC
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves one user by ID with role information.
 */
const getUserById = async (id) => {
    const query = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.created_at,
            roles.name AS "roleName"
        FROM users
        INNER JOIN roles
            ON users.role_id = roles.id
        WHERE users.id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] || null;
};

/**
 * Updates a user's name and email.
 */
const updateUser = async (id, name, email) => {
    const query = `
        UPDATE users
        SET name = $1,
            email = $2
        WHERE id = $3
        RETURNING id, name, email
    `;

    const result = await db.query(query, [name, email, id]);
    return result.rows[0] || null;
};

/**
 * Deletes a user account.
 */
const deleteUser = async (id) => {
    const query = `
        DELETE FROM users
        WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rowCount > 0;
};

export {
    emailExists,
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};