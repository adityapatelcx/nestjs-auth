import { SES } from 'aws-sdk';

export type MailParams = {
  to: string;
  subject: string;
  body: string;
};

const ses = new SES({
  region: 'ap-south-1',
});

export const sendMail = async (mailParams: MailParams): Promise<any> => {
  const params = {
    Destination: {
      ToAddresses: [mailParams.to],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: mailParams.body,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: mailParams.subject,
      },
    },
    Source: process.env.AWS_SES_SOURCE,
  };

  return ses.sendEmail(params).promise();
};
