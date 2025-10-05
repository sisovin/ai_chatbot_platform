# AI Chatbot Platform

**A comprehensive, full-stack AI chatbot application built with the MERN stack, integrating Local Ollama for text generation and ImageKit for image generation. Includes a robust credit-based access system, secure authentication, advanced analytics, and seamless payment integration.**

---

## 🚀 Overview

Welcome to the AI Chatbot Platform! This project enables developers and businesses to deploy a scalable, secure, and feature-rich AI chatbot solution. Users can generate text with multiple Ollama models, create images with ImageKit, and manage access via a flexible credit system. The platform is designed for rapid deployment, extensibility, and a premium user experience.

---

## 🧑‍💻 Tech Stack

- **Frontend:** Next.js 15.5.2, React 19, TypeScript, Shadcn UI, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **AI Integrations:** Local Ollama (multi-model), ImageKit
- **Authentication:** JWT (Signup/Login, Account Management)
- **Payments:** ABA PayWay (Card & QR code)
- **Design:** Responsive UI, modern gradients, card layouts, professional color scheme

---

## 🌟 Landing Page Structure

The landing page is thoughtfully designed to maximize conversions and inform users about all platform capabilities.

### 1. Header
- Navigation links (Home, Features, Pricing, Dashboard)
- Authentication buttons (Login, Sign Up)

### 2. Hero Section
- Catchy headline (e.g., "Empower Your Conversations with AI")
- Description of platform value
- Primary CTA buttons (Get Started, View Dashboard)

### 3. Features Section
Showcases the **6 main capabilities** in a card-based layout:
- **Text Generation:** Multi-model support via Local Ollama
- **Image Generation:** Powered by ImageKit
- **Credit System:** Flexible packages, pay-as-you-go
- **Secure Authentication:** JWT-backed signup/login, account management
- **Usage Analytics:** Track usage, credits, and transaction history
- **Responsive Design:** Works perfectly on all devices

### 4. How It Works
A simple 3-step process:
1. **Sign Up & Choose a Plan**  
2. **Access Dashboard & Use AI Tools**  
3. **Manage Credits & Payments**

### 5. Pricing
Credit packages to suit every need:
- **Starter:** For individuals and testers
- **Professional:** For regular users
- **Enterprise:** For heavy usage and teams  
Details of each package, pricing, and purchase CTA.

### 6. Call-to-Action
Encourages sign-up or dashboard visit.

### 7. Footer
- Links to documentation, company info, privacy policy, contact

---

## 🎨 Design Features

- **Responsive:** Built with Tailwind CSS and Shadcn UI components for consistency
- **Modern Effects:** Gradient text, smooth transitions, hover effects
- **Card Layouts:** Feature highlights in professional cards
- **Color Scheme:** Uses CSS variables for easy theming
- **Routing:** Navigation to `/dashboard` and `/auth`, ready for production

---

## 🔒 Authentication & User Management

- JWT-based authentication with signup and login flows
- Account management features (profile, password reset, etc.)
- Secure session handling

---

## 💳 Credit System & Payments

- Credit-based access to AI features
- ABA PayWay integration for card payments
- QR code payments for local currency
- MongoDB tracks user credits, usage logs, transaction history

---

## 🤖 AI Capabilities

- **Text Generation:**  
  - Multiple models via Local Ollama
  - Fast, local inference
  - Select model per request

- **Image Generation:**  
  - Powered by ImageKit
  - Supports custom prompts and styles

---

## 📊 Usage Analytics

- Dashboard shows usage history, credit logs, transaction details
- Admin features for monitoring and reporting

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js & npm
- MongoDB instance
- Local Ollama (for text generation)
- ImageKit account/API keys
- ABA PayWay account (for payments)

### Installation

```bash
git clone https://github.com/sisovin/ai_chatbot_platform.git
cd ai_chatbot_platform
npm install
```

### Environment Variables

Create a `.env` file with the following (sample):

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OLLAMA_API_URL=http://localhost:port
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
ABA_PAYWAY_API_KEY=your_aba_api_key
```

### Running the App

```bash
npm run dev
```

---

## 📂 Project Structure

```
ai_chatbot_platform/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── index.tsx        # Landing Page
│   │   ├── dashboard.tsx    # User Dashboard
│   │   ├── auth.tsx         # Auth Flows
│   ├── utils/
│   └── styles/
├── public/
├── package.json
├── README.md
```

---

## 🚦 Routing

- `/` – Landing page
- `/dashboard` – Protected dashboard for authenticated users
- `/auth` – Login/Signup forms

---

## 📣 Contributing

We welcome contributions! Please open issues and pull requests to help improve the platform.

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 📬 Contact & Support

- [GitHub Issues](https://github.com/sisovin/ai_chatbot_platform/issues)
- Email: [your@email.com](mailto:your@email.com)

---

## 🙏 Acknowledgements

- [Local Ollama](https://ollama.com/)
- [ImageKit](https://imagekit.io/)
- [ABA PayWay](https://www.abapayway.com/)

---

**Start building with AI today! 🚀**
