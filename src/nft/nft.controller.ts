import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';

import { INft } from './nft.interface';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('/')
  async getNfts(@Req() request, @Res() response): Promise<INft[]> {
    try {
      return response.status(HttpStatus.OK).json([
        {
          name: 'Wayfarer Classic',
          description: 'created to test',
          id: '#123',
          rarity: '#9a72da',
          collectionName: 'example',
          schemaName: 'example',
          templateId: '#00700966',
          tradeId: '#00009',
          attributes: [
            'background color black',
            'eye ball white',
            'eye color pink',
          ],
        },
        {
          name: 'Swag Classic',
          description: 'created to test',
          id: '#1243',
          rarity: '#9a72ka',
          collectionName: 'example',
          schemaName: 'example',
          templateId: '#00700566',
          tradeId: '#00007',
          attributes: [
            'background color yellow',
            'eye ball silver',
            'eye color black',
          ],
        },
      ]);
    } catch (error) {
      if (!error.status)
        return response.status(500).json({ message: error.message });

      return response.status(error.status).json(error.response);
    }
  }

  @Get('/:id')
  async getNft(
    @Req() request,
    @Res() response,
    @Param('id') id,
  ): Promise<INft> {
    try {
      return response.status(HttpStatus.OK).json({
        name: 'Wayfarer Classic',
        description: 'created to test',
        id: '#123',
        rarity: '#9a72da',
        collectionName: 'example',
        schemaName: 'example',
        templateId: '#00700966',
        tradeId: '#00009',
        attributes: [
          'background color black',
          'eye ball white',
          'eye color pink',
        ],
      });
    } catch (error) {
      if (!error.status)
        return response.status(500).json({ message: error.message });

      return response.status(error.status).json(error.response);
    }
  }
}
