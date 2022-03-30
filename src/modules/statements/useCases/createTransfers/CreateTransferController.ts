
import { Request, Response } from "express"
import { container } from "tsyringe"
import { CreateTransfersUseCase } from "./CreateTransfersUseCase"

class CreateTransfersController {
  async handle(request: Request, response: Response) {

    const { id: sender_id } = request.user
    const { receiver_id } = request.params
    const { amount, description } = request.body

    const createTransferUseCase = container.resolve(CreateTransfersUseCase)

    const transfer = await createTransferUseCase.execute({
        sender_id,
        receiver_id,
        type: "transfer",
        amount,
        description
    })

    return response.status(201).json(transfer)
  }
}

export { CreateTransfersController }