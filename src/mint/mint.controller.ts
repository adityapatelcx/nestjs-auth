import { Controller,Post,Body,  UseInterceptors, UploadedFiles} from '@nestjs/common';
import {  FilesInterceptor } from '@nestjs/platform-express';
import {mintDTO} from './dto/mint.dto'
import { pinFileToIPFS } from 'src/utils/uploadToPinata';

@Controller('mint')
export class MintController {

    @Post()
   
    @UseInterceptors(
      FilesInterceptor('image', 7)
    )
    async uploadMultipleFiles(@UploadedFiles() files,@Body() {NFTdescription}: mintDTO) {
   for(let file of files){
    pinFileToIPFS(file)
   }
   console.log(NFTdescription)
    }
}

