export interface UsersRepository {
    findUserById(id: string): Promise<any>;
    createUser(createUserDto: any): Promise<any>;
}