import axios from 'axios';
const FormData = require('form-data');

export const pinFileToIPFS = async (file:any) => {

    try{
     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; 
       const bufferImage =  Buffer.from(file.buffer);
       let data = new FormData();
       data.append("file",bufferImage, file.originalname)
       const result= await axios({
         method: 'POST',
         url,
         data,
         headers: {
             pinata_api_key: "83ae2edcb3432714c6f4",
             pinata_secret_api_key: "2f702fd98b2fbdda54d2fa6f60375a3db5b33878220a1b605ce9383a865259c0"
         },
     })
    console.log(result.data)     
    }catch(err){
     console.log(err)
   }
 }