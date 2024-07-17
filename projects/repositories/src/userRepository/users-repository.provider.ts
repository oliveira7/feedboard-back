import { Provider } from "@nestjs/common";
import { USERS_REPOSITORY_PROVIDER } from "@app/core/consts";
import { MongoUsersRepository } from "./users.repository";

export const UsersRepositoryProvider: Provider = {
    provide: USERS_REPOSITORY_PROVIDER,
    useClass: MongoUsersRepository
}