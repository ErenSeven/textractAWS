const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const textract = new AWS.Textract();

exports.handler = async (event) => {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
  const size = record.s3.object.size;

  try {
    const headResult = await s3.headObject({ Bucket: bucket, Key: key }).promise();

    const metadata = {
      fileName: key,
      contentType: headResult.ContentType || 'unknown',
      size: size || headResult.ContentLength || 0,
      uploadedAt: new Date().toISOString(),
      textractJobId: null,
      ocrStatus: "STARTED",
      ocrText: null
    };

    console.log("Bucket:", bucket);
    console.log("Key:", key);
    // Textract async job başlat
    const textractParams = {
      DocumentLocation: {
        S3Object: {
          Bucket: bucket,
          Name: key,
        },
      },
      NotificationChannel: {
        // Buraya SNS Role ARN ve Topic ARN koyacaksın
        RoleArn: "YOUR-ARL-ARN-HERE",
        SNSTopicArn: "YOUR-SNS-TOPIC-ARN-HERE",
      },
    };

    

    const startJobResult = await textract.startDocumentTextDetection(textractParams).promise();

    metadata.textractJobId = startJobResult.JobId;

    // Metadata'yı DynamoDB'ye kaydet
    await dynamodb.put({
      TableName: "YourDynamoDBTableName",
      Item: metadata,
    }).promise();

    console.log("Metadata and Textract job started:", metadata);

    return { status: 'success' };
  } catch (err) {
    console.error("Error:", err);
    return { status: 'error', error: err };
  }
};
