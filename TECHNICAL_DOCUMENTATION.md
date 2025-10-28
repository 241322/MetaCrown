# MetaCrown - Technical Documentation & Architecture

## **Project Overview**
MetaCrown is a **full-stack web application** for Clash Royale players that provides comprehensive game analytics, deck management, and competitive insights. The platform integrates with the official **Clash Royale API** to deliver real-time player statistics, deck optimization tools, and leaderboard rankings.

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
- **Authentication**: bcrypt for password hashing with session-based auth
- **API Integration**: Clash Royale API via proxy endpoints with bearer token authentication
- **Architecture**: RESTful API design with modular route handlers

### **Database Schema**
MySQL database (`meta_crown_db`) with four primary entities:
- **Users Table**: Authentication and profile data
- **Decks Table**: User-created deck configurations with JSON card storage
- **Contact Messages**: Admin communication system
- **Matches Table**: Historical match data (prepared for future features)

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
- **Server**: cPanel hosting with Node.js support
- **Database**: MySQL production instance
- **Static Assets**: React build served via Express static middleware
- **API Endpoints**: RESTful routes with Express routing
- **Environment Variables**: Production API tokens and database credentials

### **Build Process**
```bash
npm run build  # Creates optimized React bundle
# Static files served from /client/build/
# Server handles API routes and React app fallback
```

---

## **Project Structure**
```
MetaCrown/
├── meta-crown/
│   ├── client/                     # React Frontend
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── fonts/
│   │   └── src/
│   │       ├── api/
│   │       │   └── clash.js        # API integration layer
│   │       ├── Assets/             # Images and icons
│   │       ├── Components/         # Reusable React components
│   │       │   ├── DeckComponent.jsx
│   │       │   ├── Footer.jsx
│   │       │   ├── NavBar.jsx
│   │       │   └── RewindRecord.jsx
│   │       ├── Pages/              # Route components
│   │       │   ├── Dashboard.jsx   # Player statistics
│   │       │   ├── DeckCentre.jsx  # Deck builder
│   │       │   ├── Landing.jsx     # Marketing page
│   │       │   ├── Leaderboard.jsx # Rankings
│   │       │   ├── LogIn.jsx       # Authentication
│   │       │   └── SignUp.jsx      # Registration
│   │       ├── Styles/             # Component CSS
│   │       ├── config/
│   │       │   └── api.js          # API configuration
│   │       ├── App.js              # Main application
│   │       └── index.js            # React entry point
│   └── server/                     # Node.js Backend
│       ├── config/
│       │   └── db.config.js        # Database configuration
│       ├── models/                 # Sequelize models
│       │   ├── user.model.js
│       │   ├── deck.model.js
│       │   ├── match.model.js
│       │   ├── contactMessage.model.js
│       │   └── index.js            # Model aggregation
│       ├── server.js               # Development server
│       ├── production-server.js    # Production server
│       └── package.json            # Dependencies
└── README.md
```

---

## **API Endpoints Reference**

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### **Deck Management**
- `POST /api/decks` - Create new deck
- `GET /api/decks/user/:userId` - Get user's decks
- `PUT /api/decks/:deckId` - Update existing deck
- `DELETE /api/decks/:deckId` - Delete deck

### **Clash Royale API Proxy**
- `GET /api/cr/player/:tag` - Get player data
- `GET /api/cr/cards` - Get all cards
- `GET /api/cr/leaderboards/players` - Get leaderboard

### **Admin Functions**
- `POST /api/contact` - Submit contact form
- `GET /api/admin/messages` - Get all messages (admin)
- `PUT /api/admin/messages/:id/read` - Mark message as read
- `DELETE /api/admin/messages/:id` - Delete message

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

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install

# Configure environment variables
cp .env.example .env
# Add your CLASH_API_TOKEN and database credentials

# Start development servers
npm run dev  # Backend (port 6969)
cd ../client
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