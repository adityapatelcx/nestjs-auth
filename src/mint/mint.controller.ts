import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { mintDTO } from './dto/mint.dto';
import { pinFileToIPFS, pinMetadataToIPFS } from 'src/utils/pinToIPFS';

@Controller('mint')
export class MintController {
  @Post()
  @UseInterceptors(FilesInterceptor('image', 7))
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Body() { NFTdescription }: mintDTO,
  ) {
    const images: string[] = [];

    for (const file of files) {
      const result = await pinFileToIPFS(file);
      images.push(result.data.IpfsHash);
    }

    const metadata = { ...JSON.parse(NFTdescription), images };

    pinMetadataToIPFS(metadata);
  }
}
