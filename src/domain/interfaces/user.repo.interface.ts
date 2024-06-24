import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(userId: string): Promise<User>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(userId: string): Promise<void>;
}