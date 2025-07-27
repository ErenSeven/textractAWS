# textractAWS
    This project is a serverless application that allows users to upload a file (PDF or image) and receive the extracted text in real-time via WebSocket. The system is powered by AWS Lambda, Amazon Textract, Amazon S3, API Gateway (WebSocket + REST), and DynamoDB, with a user interface built using React.

✅ Key Features:

    Upload PDF/image files from the frontend (React)

    Store files in Amazon S3 using a presigned URL

    Automatically trigger AWS Textract via Lambda

    Deliver extracted text in real-time via WebSocket

    Store connection information in DynamoDB

    Fully serverless and scalable architecture

🛠 Technologies Used:

    Frontend: React

    Backend: AWS Lambda (Node.js), API Gateway (WebSocket + REST)

    Cloud Services: Amazon S3, Textract, DynamoDB

    Communication: WebSocket (real-time updates)

