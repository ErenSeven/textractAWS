const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const method = event.httpMethod || (event.requestContext?.http?.method);

    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Max-Age": "86400",
        },
        body: "",
      };
    }

    let body = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (err) {
        console.error("JSON parse hatası:", err);
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "Geçersiz JSON formatı" }),
        };
      }
    }

    const { fileName, fileContentBase64, fileType } = body;

    if (!fileName || !fileContentBase64 || !fileType) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "fileName, fileContentBase64 ve fileType gerekli." }),
      };
    }

    const buffer = Buffer.from(fileContentBase64, "base64");

    const params = {
      Bucket: "your-bucket-name", // S3 bucket adınızı buraya girin
      Key: `${Date.now()}-${fileName}`,
      Body: buffer,
      ContentType: fileType,
    };

    await s3.putObject(params).promise();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Dosya başarıyla yüklendi." }),
    };
  } catch (error) {
    console.error("Hata:", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Sunucu hatası." }),
    };
  }
};
