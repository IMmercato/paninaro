# Paninaro

**Paninaro** started as a school cafeteria ordering system—but it has grown into a modern, cloud-based SaaS platform for restaurants. Whether you're running a cozy local café or a large restaurant chain, Paninaro helps you manage orders, bookings, and customer interactions with ease.

## 🧠 Project Evolution

Originally built for students to order lunch at school, Paninaro has evolved into a **restaurant-focused web application**. It now serves as a flexible tool for food service businesses to digitize their operations and improve customer experience.

## 🍽️ What Paninaro Offers

- 📋 **Menu Management**: Create and update dynamic menus
- 🛒 **Order System**: Customers can place orders directly from the web interface
- 📆 **Booking System**: Manage table reservations with ease
- 🔐 **User Authentication**: Secure login and registration via Firebase
- 📊 **Analytics Dashboard** *(coming soon)*: Visualize performance and trends
- ⚡ **Real-time Firestore Integration**: Seamless data updates across the app

## ⚙️ How It Works

Paninaro is built with a modern full-stack architecture and hosted in the cloud for easy access and scalability.

### 🧪 Architecture & Workflow

- 🌐 **Hosting**: Deployed on [Render](https://render.com), a cloud web service  
  > _Note: If Paninaro hasn't been accessed recently, it may take up to a minute to "wake up" due to Render's free tier limitations._

- 🧠 **Backend**: Node.js + Express handles routing and API endpoints

- 🔐 **Authentication**: Firebase Auth manages secure user login and registration

- 💾 **Database**: Firebase Firestore stores all app data with real-time syncing

- 📡 **Admin API**: A custom service layer (`firebase_service`) handles privileged operations like:
  - User registration
  - Order creation and updates
  - Booking management
  - Menu editing

- 🧹 **Legacy Notes**: Redis was previously used for session caching in the school version but has been removed in favor of Firebase’s native capabilities

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/IMmercato/paninaro.git
   ```
2. Install dependencies:
   ```bash
   cd paninaro
   npm install
   ```
3. Start the application:
   ```bash
   npm run start
   ```
4. Open your browser and visit: [http://localhost:3000](http://localhost:3000)

5. For the API follow this instruction: [Firebase_service](https://github.com/IMmercato/paninaro/blob/main/firebase_service/README.md)

## 🌐 Live Preview

Explore the current development version of Paninaro here:  
👉 [https://paninaro.onrender.com](https://paninaro.onrender.com)

> 🔓 **Note**: No credentials are required at this stage. The platform is in active development and open for testing.

👉 [Sitemap](https://paninaro.onrender.com/sitemap)

> **Note**: Check up here to get all pages of the website.

## 🛠️ Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Backend     | Node.js + Express  |
| Auth        | Firebase Auth      |
| Database    | Firebase Firestore |
| Hosting     | Render             |

## 🧪 Development Status

- 📈 Charting and analytics features are under development
- 🧪 Booking and ordering systems are functional and evolving
- ❌ No email domain restrictions or credential gates at this time

## 🤝 Contributing

Want to help shape Paninaro? Here’s how:

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push and open a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
