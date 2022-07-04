import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

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
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
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
    data.append('file', JSON.stringify(metadata), metadata.name);

    const result = await axios({
      method: 'POST',
      url,
      data,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    return result.data.IpfsHash;
  } catch (err) {
    console.log(err);
  }
};
