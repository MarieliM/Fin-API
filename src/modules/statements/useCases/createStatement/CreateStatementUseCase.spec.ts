import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", ()=>{
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  })

  it("should be able to create a new deposit", async ()=> {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const userCreated = await createUserUseCase.execute(user);
    const user_id = userCreated.id

    const deposit = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    })

    expect(deposit).toHaveProperty("id")
    expect(deposit).toHaveProperty("user_id")
    expect(deposit).toHaveProperty("type", "deposit")
    expect(deposit).toHaveProperty("amount", 100)
    expect(deposit).toHaveProperty("description")
  });


  it("should not be able to make a deposit for an unexists user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      const userCreated = await createUserUseCase.execute(user);
      const user_id = "123321"
  
      await createStatementUseCase.execute({
        user_id,
        type: "deposit" as OperationType,
        amount: 100,
        description: "Deposit test",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });


  it("should be able to make a", async ()=> {
    const user: ICreateUserDTO = {
      name: "User Name",
      email: "user@user.com",
      password: "senha"
    }

    const userCreated = await createUserUseCase.execute(user);
    const user_id = userCreated.id

    const deposit = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    })

    const withdraw = await createStatementUseCase.execute({
      user_id,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "Withdraw test",
    })

    expect(withdraw).toHaveProperty("id")
    expect(withdraw).toHaveProperty("user_id")
    expect(withdraw).toHaveProperty("type", "withdraw")
    expect(withdraw).toHaveProperty("amount", 100)
    expect(withdraw).toHaveProperty("description")
  });

  it("should not be able to make a withdraw for an unexists user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      const userCreated = await createUserUseCase.execute(user);
      const user_id = "123321"
  
      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "Withdraw test",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("should not be able to make a withdraw with insufficient funds", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "User Name",
        email: "user@user.com",
        password: "senha"
      }
  
      const userCreated = await createUserUseCase.execute(user);
      const user_id = userCreated.id
  
      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "Withdraw test",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

})