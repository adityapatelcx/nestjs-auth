import { Module } from '@nestjs/common';

import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  providers: [NftService],
  controllers: [NftController],
})
export class NftModule {}
