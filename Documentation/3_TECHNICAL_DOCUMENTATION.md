# MetaCrown - Technical Documentation & Architecture

## **Project Overview**
MetaCrown is a **comprehensive full-stack Clash Royale analytics platform** built with React.js and Node.js that provides advanced game analytics, deck management, and competitive insights. The platform integrates with the official **Clash Royale API** to deliver real-time player statistics, deck optimization tools, leaderboard rankings, and battle analysis.

**Live Production Site**: [metacrown.co.za](https://metacrown.co.za)  
**Technology**: React 19.1.1 frontend, Node.js Express 4.21.2 backend, MySQL database  
**Hosting**: cPanel with Node.js 22.18.0 runtime environment

---

## **Technical Architecture**

### **Frontend Stack**
- **Framework**: React 19.1.1 with functional components and hooks
- **Routing**: React Router DOM for single-page application navigation
- **State Management**: React hooks (useState, useEffect, useMemo) with localStorage/sessionStorage persistence
- **Styling**: Pure CSS with responsive design (5-tier breakpoint system, mobile threshold at 1050px)
- **Build System**: Create React App with Webpack bundling

### **Backend Stack**
- **Runtime**: Node.js with Express.js 4.21.2 framework
- **Database**: MySQL with Sequelize ORM for database abstraction
- **Authentication**: bcrypt for password hashing with JWT/session-based auth
- **API Integration**: Clash Royale API via proxy endpoints with bearer token authentication
- **Security**: CORS middleware, input sanitization, password hashing
- **Communication**: Nodemailer for email services, Twilio for SMS notifications
- **Architecture**: RESTful API design with modular route handlers

### **Database Schema**
MySQL production database (`metacrownco_meta_crown_db`) with comprehensive game data:
- **Users Table**: Authentication and profile data with Clash Royale player tags
- **Decks Table**: User-created deck configurations with JSON card storage and analytics
- **Cards Table**: Complete Clash Royale card database with stats and ratings
- **Contact Messages**: Admin communication system for user support
- **Matches Table**: Historical match data (prepared for future battle tracking)

---

## **CRUD Functionality Deep Dive**

### **1. User Management (Authentication CRUD)**

#### **CREATE - User Registration**
```javascript
POST /api/auth/signup
```
- **Frontend**: Multi-step signup form with email/password validation and Clash Royale player tag verification
- **Validation**: Email format, password strength (6+ chars), unique player tag format (#ALPHANUMERIC)
- **Backend Process**:
  - Checks email uniqueness via `db.User.findOne()`
  - Password hashing using `bcrypt.hash()` with salt rounds
  - Creates user record with `db.User.create()`
  - Returns sanitized user object (excludes password hash)

#### **READ - User Authentication**
```javascript
POST /api/auth/login
```
- **Process**: Email lookup → bcrypt password comparison → session establishment
- **Frontend**: Stores user credentials in localStorage for session persistence

#### **UPDATE & DELETE**: User profile modifications (prepared endpoints, not currently implemented in UI)

### **2. Deck Management (Primary CRUD System)**

#### **CREATE - Deck Creation**
```javascript
POST /api/decks
```
**Frontend Process**:
- Drag-and-drop deck builder with 8-card validation
- Real-time statistics calculation (average elixir, attack/defense ratings, F2P friendliness)
- Card data validation and integrity checks

**Backend Process**:
- Validates deck completeness (exactly 8 cards required)
- Checks deck name uniqueness per user
- Stores deck as JSON object with calculated metadata
- Returns created deck with auto-generated ID

**Data Structure**:
```json
{
  "user_id": 123,
  "deck_name": "My Meta Deck",
  "cards": [array of 8 card objects],
  "avg_elixir": 3.5,
  "avg_attack": 75,
  "avg_defense": 60,
  "avg_f2p": 80
}
```

#### **READ - Deck Retrieval**
```javascript
GET /api/decks/user/:userId
```
- Fetches all decks belonging to authenticated user
- Ordered by creation date (newest first)
- Cards stored as JSON, automatically parsed by Sequelize

#### **UPDATE - Deck Modification**
```javascript
PUT /api/decks/:deckId
```
- Authorization check ensures users can only modify their own decks
- Validates new deck name uniqueness (excludes current deck)
- Partial updates supported (can modify name, cards, or statistics independently)
- Real-time preview updates in deck builder

#### **DELETE - Deck Removal**
```javascript
DELETE /api/decks/:deckId
```
- Authorization validation via user_id matching
- Soft cascading (doesn't affect related match history)
- Immediate UI update with optimistic rendering

### **3. Contact Message Management (Admin CRUD)**

#### **CREATE - Message Submission**
```javascript
POST /api/contact
```
- Public endpoint for user inquiries
- Validation for required fields (name, email, subject, message)
- Anti-spam measures through form validation

#### **READ - Admin Dashboard**
```javascript
GET /api/admin/messages
```
- Admin-only endpoint with authentication check
- Retrieves all messages with read/unread status
- Pagination support for large message volumes

#### **UPDATE - Message Status**
```javascript
PUT /api/admin/messages/:id/read
```
- Toggles message read status
- Admin response functionality (prepared)

#### **DELETE - Message Removal**
```javascript
DELETE /api/admin/messages/:id
```
- Admin-only message deletion
- Permanent removal from database

---

## **External API Integration**

### **Clash Royale API Integration**
The application acts as a **proxy server** for the official Clash Royale API:

#### **Player Data Retrieval**
```javascript
GET /api/cr/player/:tag
```
**Process Flow**:
1. Client sends player tag (e.g., "#2RC0P82YC")
2. Server sanitizes and encodes tag (`%232RC0P82YC`)
3. Proxied request to `https://api.clashroyale.com/v1/players/{tag}`
4. Bearer token authentication with Clash Royale API
5. Error handling and response forwarding to client

**Data Retrieved**:
- Player statistics (trophies, wins, three-crown wins)
- Current deck configuration
- Arena and league information  
- Clan affiliation

#### **Cards Database**
```javascript
GET /api/cr/cards
```
- Fetches complete card database from Clash Royale API
- Includes card statistics, images, and metadata
- Cached for performance optimization

#### **Leaderboard System**
```javascript
GET /api/cr/leaderboards/players
```
**Advanced Implementation**:
- Fetches top 10 global clans
- Iterates through clan members for real player data
- Aggregates and sorts by trophy count
- Rate limiting protection (100ms delays between requests)
- Fallback mock data for API failures

---

## **Database Architecture & Relationships**

### **Primary Tables**

#### **Users Table**
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

#### **Decks Table**
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
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### **Contact Messages Table**
```sql
CREATE TABLE contact_messages (
  message_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Relationships**
- **One-to-Many**: Users → Decks (each user owns multiple decks)
- **JSON Storage**: Card data stored as JSON arrays for flexibility
- **Foreign Key Constraints**: Ensure data integrity

---

## **Advanced Features**

### **Deck Copy/Paste System**
- **SessionStorage Implementation**: Temporary deck storage for cross-page functionality
- **Copy Workflow**: Dashboard → SessionStorage → Deck Centre import
- **Improve Workflow**: Dashboard → Auto-navigation → Auto-import to deck builder
- **Data Validation**: Ensures 8-card deck integrity during transfer

### **Responsive Design Architecture**
- **Breakpoint System**: 5-tier responsive design (mobile: 1050px threshold)
- **Mobile-First**: Optimized for mobile Clash Royale players
- **Progressive Enhancement**: Desktop features enhance mobile experience

### **Error Handling & UX**
- **API Fallbacks**: Mock data when Clash Royale API fails
- **User Feedback**: Real-time validation messages
- **Loading States**: Spinners and progress indicators
- **Optimistic Updates**: UI updates before server confirmation

### **Security Implementation**
- **Password Hashing**: bcrypt with salt rounds
- **Authorization Checks**: User-owned resource protection
- **API Proxy**: Hides Clash Royale API tokens from client
- **Input Sanitization**: SQL injection prevention via Sequelize

---

## **Performance Optimizations**

### **Frontend**
- **Memoization**: `useMemo` for expensive calculations (deck statistics)
- **Asset Optimization**: Optimized card images and icons
- **Bundle Splitting**: Create React App code splitting

### **Backend**
- **Connection Pooling**: MySQL connection pool (max: 5, idle timeout: 10s)
- **Query Optimization**: Indexed lookups, minimal SELECT fields
- **Caching Strategy**: Static asset caching, API response caching (prepared)

### **Database**
- **Indexing**: Primary keys, foreign keys, email uniqueness
- **JSON Storage**: Efficient card data storage without normalization overhead
- **Query Limits**: Pagination ready for large datasets

---

## **Deployment Architecture**

### **Production Environment**
- **Hosting**: cPanel shared hosting with Node.js 22.18.0 runtime
- **Domain**: metacrown.co.za with SSL certificate
- **Database**: MySQL production instance (`metacrownco_meta_crown_db`)
- **Static Assets**: React build served via Express static middleware
- **API Endpoints**: RESTful routes with Express routing and CORS configuration
- **Environment Variables**: Production API tokens, database credentials, email/SMS config
- **Server Configuration**: `production-server.js` with hardcoded production settings

### **Build & Deployment Process**
```bash
# Development workflow
npm install                    # Install dependencies
cd client && npm install     # Install frontend dependencies
cd ../server && npm install  # Install backend dependencies

# Production build
cd client
npm run build               # Creates optimized React bundle in build/

# Production deployment
# Upload server/ directory to cPanel
# Upload client/build/ contents to public_html
# Configure Node.js app in cPanel with production-server.js
# Set environment variables in cPanel Node.js settings
```

### **CORS Configuration**
```javascript
// Production server includes CORS middleware
import cors from 'cors';
app.use(cors());  // Enables cross-origin requests for frontend
```

---

## **Project Structure**
```
MetaCrown/
├── meta-crown/
│   ├── client/                          # React Frontend Application
│   │   ├── public/
│   │   │   ├── index.html              # Main HTML template
│   │   │   ├── manifest.json           # PWA configuration
│   │   │   ├── robots.txt              # SEO crawler instructions
│   │   │   └── fonts/                  # Custom typography assets
│   │   └── src/
│   │       ├── api/
│   │       │   └── clash.js            # Clash Royale API integration
│   │       ├── Assets/                 # SVG components and images
│   │       │   ├── LeftArrow.jsx       # Reusable SVG components
│   │       │   └── Cards/              # Card image assets
│   │       ├── Components/             # Reusable React components
│   │       │   ├── DeckComponent.jsx   # Deck display and interaction
│   │       │   ├── Footer.jsx          # Site footer
│   │       │   ├── NavBar.jsx          # Navigation header
│   │       │   └── RewindRecord.jsx    # Battle history component
│   │       ├── Pages/                  # Main route components
│   │       │   ├── Dashboard.jsx       # Player stats and search
│   │       │   ├── DeckCentre.jsx     # Deck builder interface
│   │       │   ├── Landing.jsx        # Marketing homepage
│   │       │   ├── Leaderboard.jsx    # Global rankings
│   │       │   ├── LogIn.jsx          # User authentication
│   │       │   ├── SignUp.jsx         # User registration
│   │       │   ├── Profile.jsx        # User profile management
│   │       │   ├── Settings.jsx       # User preferences
│   │       │   ├── Help.jsx           # Documentation and support
│   │       │   ├── Admin.jsx          # Administrative interface
│   │       │   ├── DiagnosticPage.jsx # Debug and testing tools
│   │       │   └── NotFound.jsx       # 404 error page
│   │       ├── Styles/                # Component-specific CSS
│   │       │   ├── Dashboard.css      # Player dashboard styling
│   │       │   ├── DeckCentre.css     # Deck builder styling
│   │       │   ├── Landing.css        # Homepage styling
│   │       │   └── [component].css    # Individual component styles
│   │       ├── config/
│   │       │   └── api.js             # API base configuration
│   │       ├── utils/                 # Utility functions and helpers
│   │       ├── App.js                 # Main React application
│   │       └── index.js               # React DOM entry point
│   ├── server/                        # Node.js Backend Application
│   │   ├── config/
│   │   │   └── db.config.js          # Database connection settings
│   │   ├── models/                   # Sequelize ORM models
│   │   │   ├── user.model.js         # User authentication model
│   │   │   ├── deck.model.js         # Deck storage model
│   │   │   ├── match.model.js        # Match history model
│   │   │   ├── contactMessage.model.js # Support message model
│   │   │   └── index.js              # Model relationship definitions
│   │   ├── .env                      # Environment variables (dev)
│   │   ├── server.js                 # Development server configuration
│   │   ├── production-server.js      # Production server with CORS
│   │   ├── package.json              # Backend dependencies
│   │   └── [various server files]    # Alternative server configurations
│   ├── metacrownco_meta_crown_db.sql # Production database export with complete schema and data
│   ├── DECK_MANAGEMENT.md           # Deck system documentation
│   └── package.json                 # Root project configuration
├── TECHNICAL_DOCUMENTATION.md       # This comprehensive technical guide
└── README.md                       # Project overview and setup guide
```

---

## **API Endpoints Reference**

### **Authentication & User Management**
- `POST /api/auth/signup` - User registration with email/password validation
- `POST /api/auth/login` - User authentication and session establishment
- `GET /api/auth/verify` - JWT token verification
- `POST /api/auth/logout` - Session termination

### **Deck Management (Full CRUD)**
- `POST /api/decks` - Create new deck (requires 8 cards, unique name validation)
- `GET /api/decks/user/:userId` - Get user's saved decks with statistics
- `PUT /api/decks/:deckId` - Update existing deck (authorization protected)
- `DELETE /api/decks/:deckId` - Delete deck with user ownership validation

### **Clash Royale API Proxy**
- `GET /api/cr/player/:tag` - Get comprehensive player data and statistics
- `GET /api/cr/player/:tag/battles` - Get player battle history
- `GET /api/cr/cards` - Get complete card database with metadata
- `GET /api/cr/leaderboards/players` - Get top global player rankings
- `GET /api/cr/clans/top` - Get top performing clans

### **Game Data & Analytics**
- `GET /api/cards` - Internal card database with custom ratings
- `GET /api/stats/global` - Global game statistics and meta analysis
- `GET /api/player/:tag/deck-analysis` - Advanced deck composition analysis

### **Admin Functions**
- `POST /api/contact` - Submit user support/feedback messages
- `GET /api/admin/messages` - Get all messages (admin authentication required)
- `PUT /api/admin/messages/:id/read` - Mark message as read/unread
- `DELETE /api/admin/messages/:id` - Delete support message
- `GET /api/admin/users` - User management dashboard (admin only)
- `GET /api/admin/statistics` - Platform usage analytics

---

## **Development Setup**

### **Prerequisites**
- Node.js 18+ 
- MySQL 8.0+
- Clash Royale API Token

### **Installation**
```bash
# Clone repository
git clone https://github.com/241322/MetaCrown.git
cd MetaCrown/meta-crown

# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Configure environment variables
# Create .env file in server/ directory with:
# DB_HOST=localhost
# DB_USER=your_mysql_user  
# DB_PASSWORD=your_mysql_password
# DB_NAME=meta_crown_db
# CR_API_TOKEN=your_clash_royale_api_token
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASS=your_email_password

# Set up database
mysql -u root -p
CREATE DATABASE meta_crown_db;
mysql -u root -p meta_crown_db < metacrownco_meta_crown_db.sql

# Start development servers
# Terminal 1: Backend server
cd server
npm start    # Backend (port 5000)

# Terminal 2: Frontend development server  
cd client
npm start    # Frontend (port 3000)
```

### **Database Setup**
```sql
CREATE DATABASE meta_crown_db;
USE meta_crown_db;
-- Tables are automatically created by Sequelize models
```

---

## **Technology Justifications**

### **React Choice**
- **Component Reusability**: Deck cards, navigation, forms
- **State Management**: Complex deck builder interactions
- **Performance**: Virtual DOM for optimal re-renders
- **Ecosystem**: Rich library ecosystem for gaming UIs

### **Express.js Choice**  
- **Rapid Development**: Quick API endpoint creation
- **Middleware Ecosystem**: CORS, body parsing, authentication
- **Proxy Capabilities**: Clash Royale API integration
- **Static Serving**: Single deployment for frontend and backend

### **MySQL Choice**
- **ACID Compliance**: User data integrity requirements
- **JSON Support**: Flexible card data storage
- **Hosting Compatibility**: Wide cPanel support
- **Performance**: Optimized for read-heavy workloads

### **Sequelize ORM Choice**
- **Type Safety**: Model validation and constraints
- **Migration Support**: Database version control
- **Query Optimization**: Automatic query building
- **Security**: Built-in SQL injection prevention

---

## **Recent Updates & Production Status**

### **Production Deployment (November 2024)**
- **Live Site**: [metacrown.co.za](https://metacrown.co.za) fully operational
- **CORS Configuration**: Fixed production server CORS issues for user registration
- **Database**: Production MySQL database with complete card collection (100+ cards)
- **User Registration**: Successfully working signup/login system
- **Deck System**: Full CRUD operations for deck management live
- **Player Search**: Real-time Clash Royale player lookup functional

### **Key Production Fixes Applied**
```javascript
// production-server.js - Added CORS support
import cors from 'cors';
app.use(cors());  // Enables frontend-backend communication
```

### **Current Production Features**
- ✅ **User Authentication**: Registration and login working  
- ✅ **Player Search**: Real-time player statistics via CR API
- ✅ **Deck Builder**: Interactive 8-card deck creation
- ✅ **Deck Library**: Save/load/delete user deck collections
- ✅ **Leaderboards**: Global player rankings display
- ✅ **Battle History**: Player match records and analysis
- ✅ **Responsive Design**: Mobile-optimized interface
- ✅ **Admin Panel**: Support message management system

### **Performance Metrics**
- **Database**: 100+ cards, user registration active
- **API Integration**: Stable Clash Royale API connectivity  
- **Response Times**: <2s average for player lookups
- **Uptime**: 99%+ availability on cPanel hosting

---

## **Future Enhancements**

### **Planned Features**
- **Match History Tracking**: Store and analyze battle results
- **Advanced Analytics**: Win rates, meta trend analysis
- **Social Features**: Deck sharing, community ratings
- **Push Notifications**: Meta changes, tournament alerts
- **Mobile App**: React Native implementation

### **Technical Improvements**
- **Caching Layer**: Redis for API response caching
- **Real-time Updates**: WebSocket integration for live data
- **Testing Suite**: Jest unit tests, Cypress E2E testing
- **CI/CD Pipeline**: Automated deployment and testing
- **Monitoring**: Application performance monitoring

---

This architecture provides a **scalable, maintainable platform** that efficiently handles user authentication, deck management, external API integration, and responsive user experiences while maintaining data integrity and security best practices.