import { pool } from "../db";
import { CreateBoardDto, UpdateBoardDto } from "./types";

export const BoardsRepository = {
  async findAll() {
    const result = await pool.query("SELECT * FROM boards ORDER BY id");
    return result.rows;
  },

  async findById(id: number) {
    const result = await pool.query(
      "SELECT * FROM boards WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  async create(data: CreateBoardDto) {
    const { name, user_id } = data;

    const result = await pool.query(
      `INSERT INTO boards (name, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, user_id]
    );

    return result.rows[0];
  },

  async update(id: number, data: UpdateBoardDto) {
    const { name } = data;

    const result = await pool.query(
      `UPDATE boards
       SET name = $1
       WHERE id = $2
       RETURNING *`,
      [name, id]
    );

    return result.rows[0];
  },

  async delete(id: number) {
    const result = await pool.query(
      `DELETE FROM boards WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  }
};