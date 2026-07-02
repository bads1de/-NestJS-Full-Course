import { Global, Module } from '@nestjs/common';
import { AuthFactoryService } from './auth-factory.service';

@Global()
@Module({
  providers: [AuthFactoryService],
  exports: [AuthFactoryService],
})
export class AuthModule {}
