
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import {ICreateUserDTO} from "./ICreateUserDTO"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserError } from "./CreateUserError";

let userRepositoryInMemory:  InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  })

  it("should not be able to create a new user with an exists email", async () => {
    expect(async () => {
      const user1: ICreateUserDTO = {
        name: "Name",
        email: "user@user.com",
        password: "pass"
      }

      const user2: ICreateUserDTO = {
        name: "User",
        email: "user@user.com",
        password: "senha"
      }
  
      await createUserUseCase.execute(user1);
      await createUserUseCase.execute(user2);

    }).rejects.toBeInstanceOf(CreateUserError)
    
  })
})