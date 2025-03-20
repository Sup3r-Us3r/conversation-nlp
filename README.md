# Conversation-NLP

## About the Project

Conversation-NLP is a virtual assistant that simulates banking interactions, inspired by Banco Magie. The project uses mocked data and the Gemini API as an NLP service to process messages and understand user intents.

## Technologies Used

- [Node.js](https://nodejs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Gemini API](https://aistudio.google.com)

## How to Run the Application

1. Clone the repository:
   ```sh
   $ git clone https://github.com/Sup3r-Us3r/conversation-nlp.git
   $ cd conversation-nlp
   ```
2. Install dependencies:
   ```sh
   $ npm install
   ```
3. Configure environment variables:
   ```sh
   $ cp .env.example .env
   ```
   - In the .env file, add your Gemini API key:
     ```sh
     GEMINI_API_KEY=your_api_key_here
     ```
4. Start the application in development mode:
   ```sh
   $ npm run dev
   ```

## Testing the API

The API has a `/message` endpoint that processes user messages and responds according to the detected intent.

### Base URL:
**http://localhost:3001**

### Example Requests

#### Make a PIX transfer
- **Endpoint:** `/message`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userId": "12345",
    "message": "I want to make a PIX transfer"
  }
  ```

#### Respond with more PIX details
- **Endpoint:** `/message`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userId": "12345",
    "message": "To Mayderson, in the amount of 100 reais"
  }
  ```

#### Generate a bank slip (BANK_SLIP)
- **Endpoint:** `/message`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userId": "12345",
    "message": "I need to generate a bank slip"
  }
  ```

#### Respond with more BANK_SLIP details
- **Endpoint:** `/message`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userId": "12345",
    "message": "The amount will be 130.10"
  }
  ```

#### Check account balance (BALANCE)
- **Endpoint:** `/message`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "userId": "12345",
    "message": "Do I have a lot of money?"
  }
  ```
  
