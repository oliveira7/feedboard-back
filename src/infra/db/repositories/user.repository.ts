import { IUserRepository } from '../../../domain/interfaces/user.repo.interface';
import { User } from '../../../domain/entities/user.entity';
import { UserModel, UserDocument } from '../models/user.model';

export class UserRepository implements IUserRepository {
  async findById(userId: string): Promise<User> {
    const userDoc: UserDocument = await UserModel.findById(userId).exec();
    
    return new User(
      userDoc.id,
      userDoc.name,
      userDoc.email,
      userDoc.role,
      userDoc.avatar_url,
      userDoc.password_hash,
      userDoc.created_at,
      userDoc.updated_at,
      userDoc.deleted_at
    );
  }

  async save(user: User): Promise<User> {
    const userDoc: UserDocument = await UserModel.create({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt
    });

    return new User(
      userDoc.id,
      userDoc.name,
      userDoc.email,
      userDoc.role,
      userDoc.avatar_url,
      userDoc.password_hash,
      userDoc.created_at,
      userDoc.updated_at,
      userDoc.deleted_at
    );
  }

  async update(user: User): Promise<User> {
    const userDoc: UserDocument = await UserModel.findByIdAndUpdate
    (user.id, {
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatarUrl,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt
    }).exec();

    return new User(
      userDoc.id,
      userDoc.name,
      userDoc.email,
      userDoc.role,
      userDoc.avatar_url,
      userDoc.password_hash,
      userDoc.created_at,
      userDoc.updated_at,
      userDoc.deleted_at
    );
  }

  async delete(userId: string): Promise<void> {
    await UserModel
      .findByIdAndDelete(userId)
      .exec();  

    return;
  }
}