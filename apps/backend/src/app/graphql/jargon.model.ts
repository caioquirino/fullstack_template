import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'A jargon term' })
export class Jargon {
  @Field(() => ID)
  id!: string

  @Field()
  term!: string

  @Field()
  description!: string
}
