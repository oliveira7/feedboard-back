import { UserLeanDocument } from 'src/schemas';

export interface UsersServiceInterface {
  getAllStudents(): Promise<UserLeanDocument[]>;
  getUserByEmail(email: string): Promise<any>;
}
