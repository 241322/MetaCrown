# MetaCrown

**A comprehensive Clash Royale analytics platform for deck building, player stats tracking, and competitive analysis.**

[![View Live Site](https://img.shields.io/badge/View%20Live%20Site-FF6B35?style=for-the-badge&logo=globe&logoColor=white)](https://metacrown.co.za)

---

## About MetaCrown

MetaCrown is a full-stack web application designed to empower Clash Royale players with professional-grade analytics and deck management tools. Built with React and Node.js, it integrates seamlessly with the official Clash Royale API to deliver real-time player statistics, advanced deck building capabilities, and competitive insights.

I created MetaCrown to address a gap in the Clash Royale community — the need for a comprehensive, user-friendly platform that combines deck building, player analytics, and competitive tracking in one place. Unlike fragmented tools scattered across different websites, MetaCrown provides an all-in-one solution that helps players optimize their strategies, track their progress, and stay competitive in the ever-evolving meta.

Whether you're a casual player experimenting with deck combinations or a competitive player analyzing battle histories and leaderboards, MetaCrown streamlines the entire experience so you can focus on what matters most — winning battles and climbing trophies.

---

## Features

### 🃏 Interactive Deck Builder
- **Drag & Drop Interface**: Intuitive 8-card deck creation with real-time validation
- **Advanced Analytics**: Automatic calculation of average elixir cost, attack/defense ratings, and F2P accessibility scores
- **Deck Library**: Save, organize, and manage unlimited deck configurations
- **Import System**: Copy decks from player searches with one click
- **Visual Feedback**: Card rarity indicators, elixir cost display, and meta compatibility

### 📊 Real-Time Player Analytics
- **Player Search**: Look up any Clash Royale player by tag for instant statistics
- **Battle History**: Detailed match analysis with deck breakdowns and results
- **Trophy Tracking**: Arena progression, personal bests, and league standings
- **Clan Information**: Clan details, member stats, and competitive rankings
- **Live Data Integration**: Direct connection to Clash Royale's official API

### 🏆 Competitive Features
- **Global Leaderboards**: Top player rankings with real-time updates
- **Battle Records**: Win/loss tracking and performance analysis
- **Meta Insights**: Current competitive deck trends and strategies
- **Tournament Ready**: Optimized for competitive play analysis

### 👤 User Management
- **Secure Authentication**: bcrypt password hashing with JWT session management
- **Profile System**: Personal stats, preferences, and Clash Royale account linking
- **Deck Collections**: Organize favorite builds with custom naming
- **Progress Tracking**: Personal gameplay analytics and improvement metrics

### 🎨 Professional UI/UX
- **Responsive Design**: Mobile-optimized for on-the-go deck building (orientation-based detection)
- **Modern Interface**: Clean, intuitive navigation with React Router DOM
- **Performance Optimized**: Fast load times and smooth interactions
- **Accessibility**: Semantic HTML and proper heading structure

---

## Built With

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22.18.0-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

---

## Technology Stack Deep Dive

### Frontend: React 19.1.1
React powers MetaCrown's dynamic, responsive user interface with modern hooks and functional components. It's perfect for creating interactive elements like the deck builder, real-time statistics updates, and live player searches. React's component-based architecture ensures maintainable code and seamless user experiences across all features.

### Backend: Node.js with Express.js
Node.js provides a fast, scalable server-side runtime, while Express.js simplifies API routing and middleware management. Together, they create an efficient proxy system for the Clash Royale API, handle user authentication, and manage database operations with optimal performance.

### Database: MySQL with Sequelize ORM
MySQL delivers reliable, ACID-compliant data storage for user accounts, deck configurations, and battle histories. Sequelize ORM provides type-safe models, automatic query building, and SQL injection prevention. JSON field support allows flexible card data storage while maintaining relational integrity.

### API Integration: Clash Royale Official API
MetaCrown acts as a secure proxy for the Clash Royale API, protecting API tokens from client exposure while delivering real-time player data, card databases, battle histories, and global leaderboards. Bearer token authentication ensures secure, authorized access to game data.

---

## How to Run MetaCrown

### Prerequisites
- Node.js (v18.0 or higher)
- MySQL (v8.0 or higher)
- Clash Royale API Token ([Get one here](https://developer.clashroyale.com))

### Step 1: Clone the Repository
```bash
git clone https://github.com/241322/MetaCrown.git
cd MetaCrown/meta-crown
```

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Step 3: Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE meta_crown_db;
EXIT;

# Import production database with complete schema and card data
mysql -u root -p meta_crown_db < metacrownco_meta_crown_db.sql
```

### Step 4: Configure Environment Variables
Create a `.env` file in the `server/` directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=meta_crown_db
CR_API_TOKEN=your_clash_royale_api_token
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Step 5: Start the Backend Server
```bash
# Open new terminal in server directory
cd server
npm start
# Backend runs on http://localhost:5000
```

### Step 6: Start the Frontend Development Server
```bash
# Open new terminal in client directory
cd client
npm start
# Frontend runs on http://localhost:3000
```

### Step 7: Access MetaCrown
Open your browser and navigate to `http://localhost:3000`

---

## Project Architecture

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  email_address VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(50) NOT NULL,
  player_tag VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Decks Table
```sql
CREATE TABLE decks (
  deck_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  deck_name VARCHAR(100) NOT NULL,
  cards JSON NOT NULL,
  avg_elixir DECIMAL(3,1),
  avg_attack INT,
  avg_defense INT,
  avg_f2p INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_deck_name_per_user (user_id, deck_name)
);
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration with validation
- `POST /api/auth/login` - User authentication and session creation
- `GET /api/auth/verify` - JWT token verification
- `POST /api/auth/logout` - Session termination

#### Deck Management (Full CRUD)
- `POST /api/decks` - Create new deck with 8-card validation
- `GET /api/decks/user/:userId` - Retrieve user's deck collection
- `PUT /api/decks/:deckId` - Update existing deck (authorization protected)
- `DELETE /api/decks/:deckId` - Delete deck with ownership validation

#### Clash Royale API Proxy
- `GET /api/cr/player/:tag` - Get comprehensive player data
- `GET /api/cr/player/:tag/battles` - Get battle history
- `GET /api/cr/cards` - Get complete card database
- `GET /api/cr/leaderboards/players` - Get global rankings
- `GET /api/cr/clans/top` - Get top performing clans

#### Admin Functions
- `POST /api/contact` - Submit user support messages
- `GET /api/admin/messages` - Retrieve all messages (admin only)
- `PUT /api/admin/messages/:id/read` - Toggle message status
- `DELETE /api/admin/messages/:id` - Delete support message

---

## What Problems Does MetaCrown Solve?

The Clash Royale community lacks a centralized platform that combines deck building, player analytics, and competitive tracking. Players often juggle multiple websites and tools to:
- Build and test deck combinations
- Look up player statistics
- Analyze battle histories
- Track meta trends and leaderboards

MetaCrown solves this fragmentation by providing an all-in-one solution with:
- **Centralized Tools**: Everything in one platform
- **Real-Time Data**: Direct Clash Royale API integration
- **Advanced Analytics**: Automated deck ratings and insights
- **User-Friendly Design**: Intuitive interface for all skill levels
- **Free Access**: No paywalls or feature restrictions
- **Mobile Optimization**: Build decks anywhere, anytime

By removing the need to navigate multiple platforms, MetaCrown empowers players to spend less time searching for tools and more time perfecting their strategies.

---

## Deployment

### Production Environment
MetaCrown is deployed on cPanel hosting with the following architecture:

#### Frontend: React Production Build
- Built with `npm run build` for optimized performance
- Deployed to `public_html` directory
- Served via Express static middleware
- Gzip compression and browser caching enabled

#### Backend: Node.js on cPanel
- Node.js 22.18.0 runtime environment
- Express.js server with CORS configuration
- Environment variables configured in cPanel interface
- Production database credentials secured

#### Database: MySQL on cPanel
- Production database: `metacrownco_meta_crown_db`
- Automated daily backups
- Optimized with indexing and query caching
- Complete card database (100+ Clash Royale cards)

#### Domain & SSL
- Custom domain: `metacrown.co.za`
- SSL certificate with automatic renewal
- HTTPS enforcement for secure connections

### Why cPanel?
- **Domain Integration**: Pre-existing domain registration with seamless DNS management
- **Rapid Deployment**: Suitable for MVP and production testing without complex DevOps
- **Cost Efficiency**: Fixed monthly pricing for predictable budgeting
- **Accessibility**: Web-based interface for easy maintenance
- **Node.js Support**: Native Node.js 22.18.0 runtime

Future scalability options include containerization with Docker and migration to cloud platforms (AWS, Azure, GCP) as traffic demands increase.

---

## SEO & Analytics Implementation

### Technical SEO
- **Meta Tags**: Comprehensive keyword targeting for Clash Royale searches
- **Open Graph**: Enhanced social media sharing on Facebook, Twitter, LinkedIn
- **XML Sitemap**: Submitted to Google Search Console for faster indexing
- **Robots.txt**: Optimized crawl paths for search engines
- **Semantic HTML**: Proper heading hierarchy and accessibility

### Analytics Integration
- **Google Analytics**: GA4 tracking (ID: G-H4823KC665)
- **Google Search Console**: Verified and monitoring search performance
- **Performance Metrics**: Core Web Vitals tracking and optimization
- **Conversion Tracking**: User registration and deck creation metrics

### Target Keywords
- Primary: "Clash Royale deck builder", "CR analytics", "Clash Royale tools"
- Secondary: "deck tracker", "CR stats", "Clash Royale meta"
- Long-tail: "best Clash Royale deck builder 2024", "CR player statistics"

---

## Challenges & Solutions

### Challenge 1: Clash Royale API Rate Limiting
**Problem**: Initial leaderboard implementation hit API rate limits when fetching hundreds of players.

**Solution**: Implemented intelligent request batching with 100ms delays between calls, fallback mock data for API failures, and efficient data aggregation from top clans instead of individual player lookups.

### Challenge 2: Mobile Responsiveness
**Problem**: Early pixel-based breakpoints (max-width: 1291px) caused issues on high-resolution displays with scaling.

**Solution**: Switched to orientation-based detection (`@media (orientation: portrait)`) for more reliable mobile device identification, improving UX across all screen sizes.

### Challenge 3: Production White Screen Issue
**Problem**: Apache/cPanel file serving degradation caused intermittent white screens over time.

**Solution**: Implemented daily cron job with file touch command to refresh Apache cache at midnight GMT, achieving zero-downtime resolution without server restarts.

### Challenge 4: User Acquisition Friction
**Problem**: Forcing authentication on landing page drove away potential new users.

**Solution**: Redesigned UX flow to show Landing page first with "Sign Up" button in navigation, allowing visitors to explore features before committing to registration.

### Challenge 5: Database Design for Deck Storage
**Problem**: Normalizing deck-card relationships created complex joins and slow queries.

**Solution**: Utilized MySQL JSON field support in Sequelize to store card arrays efficiently while maintaining relational integrity for user-deck associations.

---

## Future Enhancements

### Planned Features
- **Match History Tracking**: Store and analyze battle results with win/loss statistics
- **Advanced Analytics**: Machine learning-powered deck recommendations and meta predictions
- **Social Features**: Public deck galleries, community ratings, and strategy discussions
- **Mobile App**: React Native implementation for iOS and Android
- **Real-time Updates**: WebSocket integration for live leaderboard changes
- **Tournament Integration**: Official Clash Royale tournament tracking

### Technical Improvements
- **Caching Layer**: Redis integration for API response caching
- **Testing Suite**: Jest unit tests and Cypress E2E testing
- **CI/CD Pipeline**: Automated deployment with GitHub Actions
- **Monitoring**: Application performance monitoring with error tracking
- **Microservices**: API separation for cloud-native scalability

---

## Developer

**Xander Poalses**  
Student Number: 241322  
Open Window Institute

<a href="https://github.com/241322/MetaCrown/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=241322/MetaCrown" />
</a>

---

## Acknowledgments

Special thanks to:
- **Supercell**: For creating Clash Royale and providing the official API
- **The Clash Royale Community**: For feedback and feature suggestions
- **Open Window Institute**: For guidance and support during development

---

**Built with ❤️ for the Clash Royale community by Xander Poalses**
