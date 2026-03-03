import { pool } from "../db";
import { CreateUserDto, UpdateUserDto } from "./types";

export const UsersRepository = {
  async findAll() {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    return result.rows;
  },

  async findById(id: number) {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  async create(data: CreateUserDto) {
    const { name, email, password } = data;

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, password]
    );

    return result.rows[0];
  },

  async update(id: number, data: UpdateUserDto) {
    const { name, email, password } = data;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, password = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, password, id]
    );

    return result.rows[0];
  },

  async delete(id: number) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
};