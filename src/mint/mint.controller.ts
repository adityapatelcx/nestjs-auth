import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { mintDTO } from './dto/mint.dto';
import { pinFileToIPFS, pinMetadataToIPFS } from 'src/utils/pinToIPFS';
import { Response } from 'express';

@Controller('mint')
export class MintController {
  @Post('/')
  @UseInterceptors(FilesInterceptor('image', 7))
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Body() { metadata }: mintDTO,
    @Res() response: Response,
  ) {
    const images: string[] = [];
    const IpfsHash = [];

    for (const file of files) {
      const result = await pinFileToIPFS(file);
      images.push(`ipfs://${result.data.IpfsHash}`);
    }

    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const data = { ...JSON.parse(metadata), image };
      const generateIpfsHash = await pinMetadataToIPFS(data);
      IpfsHash.push(generateIpfsHash);
    }
    return response.json(IpfsHash);
  }
}
