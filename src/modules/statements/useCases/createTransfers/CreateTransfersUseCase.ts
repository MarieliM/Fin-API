import { inject, injectable } from "tsyringe"
import { AppError } from "../../../../shared/errors/AppError"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { OperationType } from "../../entities/Statement"

interface ICreateTransfers {
  receiver_id: string;
  sender_id: string;
  amount: number;
  type: string,
  description: string;
}

@injectable()
class CreateTransfersUseCase {
    constructor(
      @inject("UserRepository")
      private userRepository: IUsersRepository,

      @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
    ) {}

  async execute({ receiver_id, sender_id, type, amount, description }: ICreateTransfers) {
    
    const senderUser = this.userRepository.findById(sender_id)

    if(!senderUser){
      throw new AppError("Sender user not found.")
    }

    const receiverUser = this.userRepository.findById(receiver_id)

    if(!receiverUser){
      throw new AppError("Receiver user not found.")
    }
    
    if(amount<0){
      throw new AppError("Amount must be greater than 0")
    }

    if(type === "transfer"){
      const user_id = sender_id
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if(balance<amount){
        throw new AppError("Insufficient funds")
      }

      await this.statementsRepository.create({
        user_id: sender_id,
        receiver_id: receiver_id,
        description,
        amount,
        type: OperationType.TRANSFER
      });
  
      await this.statementsRepository.create({
        user_id: receiver_id,
        sender_id: sender_id,
        description,
        amount,
        type: OperationType.TRANSFER
      });

    }

  }
}

export {CreateTransfersUseCase}