import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

export type Jargon = {
  id: string
  created_by: string
  term: string
  description: string
  archived: boolean
  created_at: string
  updated_at: string
}

export type CreateJargonInput = {
  id: string
  created_by: string
  term: string
  description: string
}

export type UpdateJargonInput = {
  term?: string
  description?: string
}

export class JargonRepository {
  private readonly docClient: DynamoDBDocumentClient
  private readonly tableName = 'jargons'

  constructor(dynamoDb: DynamoDBClient) {
    this.docClient = DynamoDBDocumentClient.from(dynamoDb)
  }

  async create(input: CreateJargonInput): Promise<Jargon> {
    const now = new Date().toISOString()
    const jargon: Jargon = {
      ...input,
      archived: false,
      created_at: now,
      updated_at: now,
    }

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: jargon,
      }),
    )

    return jargon
  }

  async getById(id: string): Promise<Jargon | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    )

    const jargon = result.Item as Jargon

    // Only return if it's not archived
    if (jargon && !jargon.archived) {
      return jargon
    }

    return null
  }

  async list(): Promise<Jargon[]> {
    const result = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'attribute_not_exists(archived) OR archived = :archived',
        ExpressionAttributeValues: {
          ':archived': false,
        },
      }),
    )
    return (result.Items || []) as Jargon[]
  }

  async update(id: string, input: UpdateJargonInput): Promise<Jargon | null> {
    // First check if the jargon exists
    const existing = await this.getById(id)
    if (!existing) {
      return null
    }

    const updateExpressions: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': new Date().toISOString(),
    }

    if (input.term !== undefined) {
      updateExpressions.push('#term = :term')
      expressionAttributeNames['#term'] = 'term'
      expressionAttributeValues[':term'] = input.term
    }

    if (input.description !== undefined) {
      updateExpressions.push('#description = :description')
      expressionAttributeNames['#description'] = 'description'
      expressionAttributeValues[':description'] = input.description
    }

    updateExpressions.push('#updated_at = :updated_at')
    expressionAttributeNames['#updated_at'] = 'updated_at'

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    )

    return result.Attributes as Jargon
  }

  async softDelete(id: string): Promise<boolean> {
    // First check if the jargon exists
    const existing = await this.getById(id)
    if (!existing) {
      return false
    }

    await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET archived = :archived, #updated_at = :updated_at',
        ExpressionAttributeNames: {
          '#updated_at': 'updated_at',
        },
        ExpressionAttributeValues: {
          ':archived': true,
          ':updated_at': new Date().toISOString(),
        },
      }),
    )

    return true
  }
}
