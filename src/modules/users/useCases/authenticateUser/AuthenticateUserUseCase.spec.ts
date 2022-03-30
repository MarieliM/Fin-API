import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUseCase.execute({
      email:user.email,
      password:user.password
    })

    expect(result).toHaveProperty("token");

  })

  it("should not be able to authenticate an user with wrong email", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      await createUserUseCase.execute(user);
  
      const result = await authenticateUseCase.execute({
        email:'wrong@email.com',
        password:user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate an user with wrong password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      await createUserUseCase.execute(user);
  
      const result = await authenticateUseCase.execute({
        email:user.email,
        password:'wrongPassword'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})