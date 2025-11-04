# MetaCrown

**A comprehensive Clash Royale analytics platform for deck building, player stats tracking, and competitive analysis.**

🌐 **Live Site**: [metacrown.co.za](https://metacrown.co.za)

## 🎯 Overview

MetaCrown is a full-stack web application that provides Clash Royale players with advanced tools for deck analysis, player statistics tracking, and competitive insights. Built with React and Node.js, it integrates with the official Clash Royale API to deliver real-time data and analytics.

## ✨ Key Features

### 🃏 Deck Management System
- **Deck Builder**: Interactive deck creation with 8-card validation
- **Deck Library**: Save, organize, and manage multiple deck builds
- **Deck Analytics**: Attack, defense, and F2P rating calculations
- **Card Database**: Complete Clash Royale card collection with stats

### 📊 Player Analytics
- **Real-time Player Search**: Look up any player by tag
- **Battle History**: Detailed match analysis and statistics  
- **Trophy Tracking**: Arena progression and league standings
- **Clan Information**: Clan details and member stats

### 🏆 Competitive Features
- **Leaderboard**: Top player rankings and statistics
- **Battle Records**: Win/loss tracking and analysis
- **Player Comparison**: Compare stats between different players
- **Tournament Ready**: Optimized for competitive play analysis

### 👤 User Management
- **Account System**: Secure user registration and authentication
- **Profile Management**: Personal stats and preferences
- **Deck Collections**: Save and organize favorite builds
- **Progress Tracking**: Personal gameplay analytics

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1**: Modern UI with hooks and context
- **React Router DOM**: Single-page application navigation
- **CSS3**: Custom styling with responsive design
- **JavaScript ES6+**: Modern JavaScript features

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js 4.21.2**: Web application framework
- **MySQL**: Relational database for user and deck data
- **Sequelize ORM**: Database modeling and queries

### APIs & Integration
- **Clash Royale API**: Official game data integration
- **RESTful Architecture**: Clean API design patterns
- **CORS Enabled**: Cross-origin resource sharing
- **Bearer Token Authentication**: Secure API access

### Security & Communication
- **bcrypt**: Password hashing and security
- **JWT**: JSON Web Token authentication
- **Nodemailer**: Email services integration
- **Twilio**: SMS notifications (optional)

### Deployment
- **cPanel Hosting**: Production deployment on shared hosting
- **Node.js 22.18.0**: Production runtime environment
- **MySQL Database**: Production data storage
- **Static Assets**: Optimized image and font delivery

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0 or higher)
- MySQL (v8.0 or higher)
- Clash Royale API Token
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/MetaCrown.git
cd MetaCrown/meta-crown
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Database Setup**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE meta_crown_db;

# Import database schema
mysql -u root -p meta_crown_db < meta_crown_db.sql
```

4. **Environment Configuration**

Create `.env` file in the server directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=meta_crown_db
CR_API_TOKEN=your_clash_royale_api_token
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

5. **Start Development Servers**
```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend development server
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
meta-crown/
├── client/                 # React frontend application
│   ├── public/            # Static assets and HTML template
│   │   ├── fonts/         # Custom fonts and typography
│   │   └── assets/        # Images, icons, and graphics
│   └── src/
│       ├── api/           # API integration and services
│       ├── Assets/        # React components for SVG assets
│       ├── Components/    # Reusable UI components
│       ├── Pages/         # Main application pages
│       ├── Styles/        # CSS stylesheets
│       └── utils/         # Utility functions and helpers
├── server/                # Node.js backend application
│   ├── config/           # Database and app configuration
│   ├── models/           # Sequelize database models
│   └── production-server.js  # Production server configuration
├── meta_crown_db.sql     # Database schema and initial data
└── DECK_MANAGEMENT.md    # Deck system documentation
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts and authentication
- **decks**: User-created deck configurations
- **cards**: Complete Clash Royale card database
- **matches**: Battle history and results

### Key Relationships
- Users → Decks (One-to-Many)
- Decks → Cards (Many-to-Many through JSON)
- Users → Matches (One-to-Many)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Token verification

### Deck Management
- `POST /api/decks` - Save new deck
- `GET /api/decks/user/:userId` - Get user's decks
- `PUT /api/decks/:deckId` - Update existing deck
- `DELETE /api/decks/:deckId` - Delete deck

### Player Data
- `GET /api/player/:tag` - Get player information
- `GET /api/player/:tag/battles` - Get battle history
- `GET /api/cards` - Get all cards data

### Statistics
- `GET /api/leaderboard` - Get top players
- `GET /api/stats/global` - Global game statistics

## 🚀 Deployment

### Production Deployment (cPanel)

1. **Build the application**
```bash
cd client
npm run build
```

2. **Upload files**
- Upload `server/` directory to your hosting
- Upload `client/build/` contents to public_html
- Configure Node.js app in cPanel

3. **Database Setup**
- Create MySQL database in cPanel
- Import `meta_crown_db.sql` schema
- Update database credentials in production

4. **Environment Variables**
- Set production environment variables
- Configure Clash Royale API token
- Update CORS settings for your domain

### Local Development Tips

- Use `nodemon` for automatic server restarts
- Enable React DevTools for debugging
- Use MySQL Workbench for database management
- Test API endpoints with Postman or Thunder Client

## 🎮 Usage Guide

### For Players
1. **Create Account**: Sign up with email and password
2. **Search Players**: Find any Clash Royale player by tag
3. **Build Decks**: Use the interactive deck builder
4. **Save Decks**: Store your favorite deck configurations
5. **Analyze Stats**: View detailed player and battle analytics

### For Developers
1. **API Integration**: Use RESTful endpoints for data access
2. **Component Library**: Extend existing React components
3. **Database Queries**: Utilize Sequelize ORM for data operations
4. **Styling System**: Follow existing CSS architecture

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use semantic commit messages
- Write tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supercell**: For the Clash Royale game and official API
- **React Team**: For the amazing React framework
- **Express.js**: For the robust backend framework
- **MySQL**: For reliable database solutions
- **Community**: For feedback and feature suggestions

## 📞 Support

- **Website**: [metacrown.co.za](https://metacrown.co.za)
- **Issues**: GitHub Issues tab
- **Documentation**: See `TECHNICAL_DOCUMENTATION.md` for detailed technical specs

---

**Built with ❤️ for the Clash Royale community**
