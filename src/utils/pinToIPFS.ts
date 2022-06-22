import axios from 'axios';
// const FormData = require('form-data');
import FormData from 'form-data';
//This import statements gives error but is included to fix eslint error. Please comment this and uncomment the above
//require statement while running the app

export const pinFileToIPFS = async (file: any) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const bufferImage = Buffer.from(file.buffer);
    const data = new FormData();
    data.append('file', bufferImage, file.originalname);
    return axios({
      method: 'POST',
      url,
      data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: '83ae2edcb3432714c6f4',
        pinata_secret_api_key:
          '2f702fd98b2fbdda54d2fa6f60375a3db5b33878220a1b605ce9383a865259c0',
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const pinMetadataToIPFS = async (metadata: any) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', JSON.stringify(metadata), metadata.NFTname);

    const result = await axios({
      method: 'POST',
      url,
      data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: process.env.Pinata_api_key,
        pinata_secret_api_key: process.env.Pinata_secret_api_key,
      },
    });

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
