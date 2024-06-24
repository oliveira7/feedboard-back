import { User } from '../entities/user.entity';

export interface IUserService {
  createUser(user: User): Promise<User>;
  getUserById(userId: string): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}