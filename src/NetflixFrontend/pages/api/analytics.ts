import { NextApiResponse, NextApiRequest } from 'next';
import AWS from 'aws-sdk';
import { getSessionId } from '../../utils/session';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.AWS_REGION) {
  console.log('\n\nAWS_REGION env var was not provided.\n\n')
}

const s3 = (process.env.AWS_REGION && process.env.AWS_S3_BUCKET) ? new AWS.S3({ region: process.env.AWS_REGION }) : null;
const sqs = (process.env.AWS_REGION && process.env.AWS_SQS_QUEUE_URL) ? new AWS.SQS({ region: process.env.AWS_REGION }) : null;
const sns = (process.env.AWS_REGION && process.env.AWS_SNS_TOPIC_ARN) ? new AWS.SNS({ region: process.env.AWS_REGION }) : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = await getSessionId(req, res);
  const timestamp = new Date().toISOString();
  const activityId = uuidv4();

  const userActivity = {
    activityId,
    sessionId,
    timestamp,
    mediaId: req.body.mediaId,
  };

  if (s3) {
      const putObjectParams = {
        Bucket: process.env.AWS_S3_BUCKET !== undefined ? process.env.AWS_S3_BUCKET : '',
        Key: `${sessionId}/${activityId}.json`,
        Body: JSON.stringify(userActivity),
        ContentType: 'application/json',
      };

      try {
        await s3.putObject(putObjectParams).promise();
        console.log('Activity object successfully stored in S3');
      } catch (error) {
        console.error('Error updating user session:', error);
        res.status(500).json({ error: 'Error updating user session' });
      }
  } else {
    console.log('S3 functionality disabled. Skipping...');
  }

  if (sqs && !sns) {
    const sqsParams = {
      QueueUrl: process.env.AWS_SQS_QUEUE_URL !== undefined ? process.env.AWS_SQS_QUEUE_URL : '',
      MessageBody: JSON.stringify(userActivity),
    };

    try {
      await sqs.sendMessage(sqsParams).promise();
      console.log('Activity successfully produces to SQS');
    } catch (error) {
      console.error('Error updating user session:', error);
      res.status(500).json({ error: 'Error updating user session' });
    }
  } else {
    console.log('SQS functionality disabled. Skipping...');
  }

  if (sns) {
    const snsParams = {
      TopicArn: process.env.AWS_SNS_TOPIC_ARN !== undefined ? process.env.AWS_SNS_TOPIC_ARN : '',
      Message: JSON.stringify(userActivity),
    };

    try {
      await sns.publish(snsParams).promise();
      console.log('Activity successfully published to SNS');
    } catch (error) {
      console.error('Error publishing activity to SNS:', error);
      res.status(500).json({ error: 'Error publishing activity to SNS' });
      return;
    }
  } else {
    console.log('SNS functionality disabled. Skipping...');
  }

  res.status(200).json(userActivity);
}
