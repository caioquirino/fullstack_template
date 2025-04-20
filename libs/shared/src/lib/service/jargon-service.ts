import { JargonRepository, Jargon, CreateJargonInput, UpdateJargonInput } from '../repository/jargon-repository'
import { v4 as uuidv4 } from 'uuid'

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export type CreateJargonServiceInput = Omit<CreateJargonInput, 'id'> & {
  id?: string // Make id optional, service will generate if not provided
}

export class JargonService {
  constructor(private readonly repository: JargonRepository) {}

  /**
   * Creates a new jargon entry
   * @throws {UnauthorizedError} If user doesn't have access to the domain
   */
  async createJargon(input: CreateJargonServiceInput): Promise<Jargon> {
    const id = input.id ?? this.generateId()

    return this.repository.create({
      ...input,
      id,
    })
  }

  /**
   * Retrieves a jargon by its ID
   * @throws {NotFoundError} If jargon doesn't exist or is archived
   * @throws {UnauthorizedError} If user doesn't have access to the domain
   */
  async getJargon(id: string): Promise<Jargon> {
    const jargon = await this.repository.getById(id)

    if (!jargon) {
      throw new NotFoundError(`Jargon with id ${id} not found`)
    }

    return jargon
  }

  /**
   * Lists all active jargons
   * @throws {UnauthorizedError} If user doesn't have access to the domain
   */
  async listJargons(): Promise<Jargon[]> {
    return this.repository.list()
  }

  /**
   * Updates an existing jargon
   * @throws {NotFoundError} If jargon doesn't exist or is archived
   * @throws {UnauthorizedError} If user doesn't have access to the domain
   */
  async updateJargon(id: string, input: UpdateJargonInput): Promise<Jargon> {
    const updated = await this.repository.update(id, input)

    if (!updated) {
      throw new NotFoundError(`Jargon with id ${id} not found`)
    }

    return updated
  }

  /**
   * Soft deletes a jargon
   * @throws {NotFoundError} If jargon doesn't exist or is already archived
   * @throws {UnauthorizedError} If user doesn't have access to the domain
   */
  async deleteJargon(id: string): Promise<boolean> {
    const deleted = await this.repository.softDelete(id)

    if (!deleted) {
      throw new NotFoundError(`Jargon with id ${id} not found`)
    }
    return deleted
  }

  /**
   * Generates a unique ID for a new jargon using UUID v4
   */
  private generateId(): string {
    return uuidv4()
  }
}
