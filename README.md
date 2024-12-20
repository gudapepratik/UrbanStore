# UrbanStore - Online Shopping App

![UrbanStore](https://github.com/user-attachments/assets/2b1665e1-759a-4cd8-a028-e6bd59931050)



UrbanStore is an online shopping platform built with React and powered by Appwrite for backend services. It provides features such as user authentication, product retrieval, cart management, and order placement. The app is role-based, supporting both customer and seller functionalities. Customers can browse products and place orders, while sellers can manage products and track/cancel customer orders. The app uses Redux for state management.

## 🚀 Features

- **Role-based Access**: The app has two primary roles:
  - **Customer**: Can browse products, add to cart, and place orders.
  - **Seller**: Can add, edit, and manage products, as well as track and cancel orders placed by customers.
- **User Authentication**: Users can sign up, log in, and log out using Appwrite's authentication services.
- **Product Catalog**: Browse a variety of products with details like price, image, and description.
- **Shopping Cart**: Add, remove, and view items in your shopping cart.
- **Order Placement**: Proceed to checkout and place orders for your selected products.
- **State Management**: Redux is used for managing the app’s state, including the user session, cart, and product data.

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux, React Router, Tailwind CSS
- **Backend**: Appwrite
- **State Management**: Redux Toolkit

## 📦 Key Dependencies

Here are some important dependencies used in this project:

- **@reduxjs/toolkit**: A powerful library for managing state in React applications. It simplifies Redux usage by providing tools like `createSlice` and `configureStore` to handle actions and reducers efficiently.
- **appwrite**: The backend service used for authentication, database, and file storage. It allows easy integration with frontend applications for managing user accounts, products, and orders.
- **react-hook-form**: A library for managing form inputs in React applications, which simplifies form validation and submission handling.
- **react-notifications-component**: A library for displaying notifications in React apps, used for showing alerts, success messages, or errors to the user.
- **react-redux**: The official Redux binding for React, allowing the app to connect Redux state to React components.
- **react-router**: A routing library for React applications, used to manage navigation and page rendering.
- **swiper**: A modern mobile touch slider with responsive capabilities, used for product carousels or image sliders.

## 🎥 Video demo (Seller Side)

https://github.com/user-attachments/assets/baa85868-456a-4b6e-a887-7265ed7d9142

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Appwrite account and API key (you need appwrite account to use it's functionalities)

### Steps to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/urbanstore.git
   cd urbanstore
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add the following: Replace <your-appwrite-endpoint> and <your-appwrite-project-id> with your actual Appwrite configuration.
   ```bash
   echo "VITE_APPWRITE_ENDPOINT=<your-appwrite-endpoint>" >> .env
   echo "VITE_APP_PROJECT_ID=<your-appwrite-project-id>" >> .env
   ```

5. Start the development server:
   ```bash
   npm start
   ```
6. The application will be available at http://localhost:3000


## 📝 Personal Note
This app is entirely built by me, including all assets such as images, posters, and the app's complete logic. While the app is functional, there is always room for improvement. I aim to make it more refined and meaningful with future updates.

If you have any suggestions or feedback, feel free to share them. Your input is invaluable to me as I continue improving the app.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
