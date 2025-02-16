# Task

Task: Build a chatbot app where the user engages as a buyer of antique goods. The chatbot should act as an antique goods seller, answering product-related questions, negotiating prices, and attempting to close deals. Users should also be able to upload images of antiques for potential discussion. Requirements: Develop a single-page application (SPA) using React (or a similar modern frontend framework). Build a Node.js backend that integrates with an LLM for chat interactions. Implement price negotiation logic, either through the LLM or with additional business rules. Allow users to upload images, with optional image analysis (e.g., using a vision model). Provide clear instructions on setting up and running the application. Notes: Developer accounts for most LLM providers are free. You may use OpenAI, Anthropic, or open-source models. Please save your work in the shared location and include link here

## TODO

- Negotiate the price
- View product and bot should describe the product in detail
- Special case for offering 30% off, when user compliments the seller
- Change tone
- If user provides an image bot should evaluate it as antique shop owner telling if the product on the image is antique or not, should give some price to it
