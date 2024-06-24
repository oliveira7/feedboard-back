import { IUserRepository } from '../../domain/interfaces/user.repo.interface';
import { User } from '../../domain/entities/user.entity';
import { UserModel } from '../../infra/db/models/user.model';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User> {
    const doc = await UserModel.findById(id).exec();
    if (!doc) {
      throw new Error('User not found');
    }
    return new User(doc.id, doc.name, doc.email, doc.role, doc.avatar_url, doc.password_hash, doc.created_at, doc.updated_at, doc.deleted_at);
  }

  async save(user: User): Promise<User> {
    const doc = await UserModel.create({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt
    });
    return new User(doc.id, doc.name, doc.email, doc.role, doc.avatar_url, doc.password_hash, doc.created_at, doc.updated_at, doc.deleted_at);
  }

  async update(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(user.id, {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt
    }).exec();

    if (!doc) {
      throw new Error('User not found');
    }

    return new User(doc.id, doc.name, doc.email, doc.role, doc.avatar_url, doc.password_hash, doc.created_at, doc.updated_at, doc.deleted_at);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }
}
