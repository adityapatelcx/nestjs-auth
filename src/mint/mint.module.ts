import { Module } from '@nestjs/common';
import { MintController } from './mint.controller';
import { MintService } from './mint.service';

@Module({
  controllers: [MintController],
  providers: [MintService],
})
export class MintModule {}
