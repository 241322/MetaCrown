# MetaCrown

**A comprehensive Clash Royale analytics platform for deck building, player stats tracking, and competitive analysis.**

🌐 **Live Site**: [metacrown.co.za](https://metacrown.co.za)

## 📚 Documentation

This project's complete documentation is organized in the `Documentation` directory:

### 📖 **Main Documentation Files**
- **[🚀 1_SETUP.md](./Documentation/1_SETUP.md)** - Complete project setup, installation, and usage guide
- **[🎯 2_DECK_MANAGEMENT.md](./Documentation/2_DECK_MANAGEMENT.md)** - Deck management system documentation  
- **[⚙️ 3_TECHNICAL_DOCUMENTATION.md](./Documentation/3_TECHNICAL_DOCUMENTATION.md)** - Technical architecture and API reference
- **[📈 4_SEO_MARKETING.md](./Documentation/4_SEO_MARKETING.md)** - SEO implementation and digital marketing strategy

## 🚀 Quick Start

For complete setup instructions, see [1_SETUP.md](./Documentation/1_SETUP.md)

### Prerequisites
- Node.js (v18.0 or higher)
- MySQL (v8.0 or higher)
- Clash Royale API Token

### Installation
```bash
# Clone the repository
git clone https://github.com/241322/MetaCrown.git
cd MetaCrown/meta-crown

# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Set up database
mysql -u root -p meta_crown_db < metacrownco_meta_crown_db.sql

# Configure environment variables (see 1_README.md for details)
# Start development servers (see 1_README.md for complete instructions)
```

## 🎯 Project Overview

MetaCrown is a full-stack web application that provides Clash Royale players with advanced tools for deck analysis, player statistics tracking, and competitive insights. Built with React 19.1.1 and Node.js, it integrates with the official Clash Royale API to deliver real-time data and analytics.

### Key Features
- 🃏 **Interactive Deck Builder** with real-time validation
- 📊 **Player Analytics** with battle history tracking
- 🏆 **Leaderboards** and competitive insights
- 👤 **User Management** with secure authentication
- 🗄️ **Complete Database** of Clash Royale cards and stats

### Technology Stack
- **Frontend**: React 19.1.1, React Router DOM, CSS3
- **Backend**: Node.js, Express.js 4.21.2, MySQL, Sequelize ORM
- **APIs**: Clash Royale Official API integration
- **Deployment**: cPanel hosting with Node.js 22.18.0

---

**For detailed information, please refer to the complete documentation in the [Documentation](./Documentation/) directory.**