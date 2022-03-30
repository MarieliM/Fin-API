import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let createUserUseCase: CreateUserUseCase;
let createStatementsUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let userRepositoryInMemory:  InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository()

    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    createStatementsUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
  })

  it("should be able to get infos about an existent operation", async () => {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const userCreated = await createUserUseCase.execute(user);
    const user_id = userCreated.id

    const deposit = await createStatementsUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    });
    
    const statement_id = deposit.id

    const returnedStatement = await getStatementOperationUseCase.execute({user_id, statement_id})

    expect(returnedStatement).toBeInstanceOf(Statement);
    expect(returnedStatement).toHaveProperty("id");
    expect(returnedStatement).toHaveProperty("type", "deposit");
    expect(returnedStatement).toHaveProperty("amount", 100);

  });

  it("should not be able to get operation for an unexists user", async () => {
    expect(async () => {
      
      const user_id = "123321"
      const statement_id = "123321"
  
      await getStatementOperationUseCase.execute({user_id, statement_id})
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it("should not be able to get an unexists operation", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      const userCreated = await createUserUseCase.execute(user);
      const user_id = userCreated.id
      
      const statement_id = "123321"
  
      await getStatementOperationUseCase.execute({user_id, statement_id})
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
})