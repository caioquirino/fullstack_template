import { Module } from '@nestjs/common'
import { JargonResolver } from './jargon.resolver'
import { JargonService } from '@fullstack-template/shared'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { JargonRepository } from '@fullstack-template/shared'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [
    JargonResolver,
    {
      provide: JargonService,
      useFactory: () => {
        return new JargonService(
          new JargonRepository(
            new DynamoDBClient({
              region: process.env.AWS_REGION || 'eu-central-1',
            }),
          ),
        )
      },
    },
  ],
  exports: [JargonService],
})
export class JargonModule {}
