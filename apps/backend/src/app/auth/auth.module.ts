import { Module } from '@nestjs/common'
import { AuthService } from '@fullstack-template/shared'
import { AuthGuard } from './auth.guard'

@Module({
  providers: [
    {
      provide: AuthService,
      useFactory: () => new AuthService(),
    },
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
