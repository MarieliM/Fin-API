import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementsUseCase: CreateStatementUseCase;
let userRepositoryInMemory:  InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository()

    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory)
    createStatementsUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
  });


  it("should be able to get ballance", async () => {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const userCreated = await createUserUseCase.execute(user);
    const user_id = userCreated.id

    await createStatementsUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    })

    const ballance = await getBalanceUseCase.execute({user_id})
    expect(ballance).toHaveProperty("balance", 100)
    expect(ballance).toHaveProperty("statement")
  })


  it("should not be able to get ballance for an unexists user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      const userCreated = await createUserUseCase.execute(user);
      const user_id = "123321"
  
     await getBalanceUseCase.execute({user_id})
    }).rejects.toBeInstanceOf(GetBalanceError)
    
  })

})