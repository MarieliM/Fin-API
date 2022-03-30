import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let userRepositoryInMemory:  InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  });

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const userCreated = await createUserUseCase.execute(user);

    const profile = await showUserProfileUseCase.execute(userCreated.id)
    
    expect(profile).toHaveProperty('id')
    expect(profile).toHaveProperty('email')
    expect(profile).toHaveProperty('name')
    expect(profile).toHaveProperty('password')
  })


  it("should not be able to show user profile for an unexists user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      await createUserUseCase.execute(user);
  
      await showUserProfileUseCase.execute("123321")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
    
  
  })

})