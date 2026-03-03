import { BoardsRepository } from "./repository";
import { CreateBoardDto, UpdateBoardDto } from "./types";

export const BoardsService = {
  async getAll() {
    return BoardsRepository.findAll();
  },

  async getById(id: number) {
    const board = await BoardsRepository.findById(id);

    if (!board) {
      throw new Error("Board not found");
    }

    return board;
  },

  async create(data: CreateBoardDto) {
    return BoardsRepository.create(data);
  },

  async update(id: number, data: UpdateBoardDto) {
    const board = await BoardsRepository.update(id, data);

    if (!board) {
      throw new Error("Board not found");
    }

    return board;
  },

  async delete(id: number) {
    const board = await BoardsRepository.delete(id);

    if (!board) {
      throw new Error("Board not found");
    }

    return board;
  }
};