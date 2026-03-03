import { UsersRepository } from "./repository";

export const UsersService = {
  async getAll() {
    return UsersRepository.findAll();
  },

  async getById(id: number) {
    const user = await UsersRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async create(data: any) {
    return UsersRepository.create(data);
  },

  async update(id: number, data: any) {
    const user = await UsersRepository.update(id, data);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  async delete(id: number) {
    const user = await UsersRepository.delete(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
};