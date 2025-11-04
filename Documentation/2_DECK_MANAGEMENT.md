# MetaCrown Deck Management System

## Overview
The MetaCrown Deck Management System is a comprehensive CRUD (Create, Read, Update, Delete) solution for managing Clash Royale deck configurations. This system allows users to build, save, analyze, and share their deck strategies with advanced statistics and real-time validation.

**Live System**: Active on [metacrown.co.za](https://metacrown.co.za)  
**Status**: Production-ready with full functionality

## Core Features

### 🎯 **Interactive Deck Builder**
- **Drag & Drop Interface**: Intuitive card placement system
- **8-Card Validation**: Enforces standard Clash Royale deck requirements
- **Real-time Statistics**: Live calculation of deck metrics
- **Card Database Integration**: Access to complete Clash Royale card collection
- **Visual Feedback**: Card rarity indicators and elixir cost display

### 📊 **Advanced Analytics Engine**
- **Average Elixir Cost**: Automatic calculation for deck speed analysis
- **Attack Rating**: Offensive capability scoring (1-10 scale)
- **Defense Rating**: Defensive strength evaluation (1-10 scale)  
- **F2P Rating**: Free-to-play accessibility scoring
- **Meta Compatibility**: Deck viability in current meta

### 🗄️ **Database Architecture**
- **Sequelize ORM**: `deck.model.js` with comprehensive field validation
- **Foreign Key Relations**: Secure user-deck associations
- **JSON Card Storage**: Flexible card data with metadata preservation
- **MySQL Production**: `metacrownco_meta_crown_db` with optimized indexing
- **Data Integrity**: Constraints and validation at database level

### 🔌 **RESTful API System**
- `POST /api/decks` - Create new deck with validation
- `GET /api/decks/user/:userId` - Retrieve user's deck collection
- `PUT /api/decks/:deckId` - Update existing deck (ownership verified)
- `DELETE /api/decks/:deckId` - Remove deck with authorization checks
- **Authentication Required**: All endpoints protect user data
- **Error Handling**: Comprehensive validation and user feedback

### 🎮 **User Interface Features**
- **Builder Tab**: Interactive deck construction workspace
- **Library Tab**: Organized deck collection with search/filter
- **Deck Preview**: Visual deck representation with statistics
- **Load/Edit System**: Seamless deck modification workflow
- **Delete Confirmation**: Safe deck removal with user confirmation
- **Responsive Design**: Mobile-optimized for on-the-go deck building

### 🔐 **Security & Validation**
- **User Authentication**: Login required for all deck operations
- **Ownership Validation**: Users can only modify their own decks
- **Input Sanitization**: XSS and injection protection
- **Unique Name Enforcement**: Prevents duplicate deck names per user
- **Session Management**: Secure user session handling

## Database Setup & Schema

### **Production Database**
```sql
-- Database: metacrownco_meta_crown_db (Production)
-- Alternative: meta_crown_db (Development)

-- Import complete schema with card data
mysql -u root -p meta_crown_db < metacrownco_meta_crown_db.sql
```

### **Deck Table Structure**
```sql
CREATE TABLE decks (
  deck_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  deck_name VARCHAR(100) NOT NULL,
  cards JSON NOT NULL,
  avg_elixir DECIMAL(3,1) DEFAULT NULL,
  avg_attack INT DEFAULT NULL,
  avg_defense INT DEFAULT NULL,
  avg_f2p INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_deck_name_per_user (user_id, deck_name)
);
```

### **Card Data Schema**
```json
{
  "cards": [
    {
      "card_id": 1,
      "name": "Giant",
      "rarity": "Rare",
      "elixir_cost": 5,
      "type": "Troop",
      "attack_rating": 7,
      "defense_rating": 6,
      "f2p_rating": 8,
      "image_url": "GiantCard.webp"
    }
    // ... 7 more cards
  ]
}
```

## User Workflow Guide

### 🛠️ **Building a New Deck**
1. **Navigate to Deck Centre**: Access the deck builder interface
2. **Select Cards**: Choose 8 cards from the complete card database
3. **Real-time Validation**: System enforces exactly 8 cards
4. **Statistics Preview**: View calculated deck metrics in real-time
5. **Name Your Deck**: Enter unique, descriptive deck name
6. **Save Deck**: Click save with automatic validation and feedback

### 📚 **Managing Your Deck Library** 
1. **Access Library Tab**: View all your saved deck configurations
2. **Deck Statistics**: See avg elixir, attack/defense/F2P ratings at a glance
3. **Search & Filter**: Find specific decks quickly (future enhancement)
4. **Load for Editing**: Click "Load" to modify existing decks in builder
5. **Delete with Confirmation**: Remove unwanted decks safely

### 🔄 **Deck Copy/Paste System**
1. **From Dashboard**: View player decks from Clash Royale API
2. **Copy Deck**: Use "Copy Deck" or "Improve" buttons
3. **Auto-Navigate**: System automatically opens Deck Centre
4. **Auto-Import**: Deck loads into builder for customization
5. **Save Modified**: Create your personalized version

### 📊 **Analytics & Statistics**
- **Elixir Analysis**: Optimal cost distribution for different strategies
- **Attack Rating**: Offensive power assessment for push potential  
- **Defense Rating**: Defensive capability for counter-strategies
- **F2P Rating**: Accessibility for players without premium cards
- **Meta Relevance**: Current competitive viability (planned feature)

## API Reference & Examples

### **Create New Deck**
```javascript
POST /api/decks
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "user_id": 1,
  "deck_name": "Meta Lightning Cycle",
  "cards": [
    {
      "card_id": 1,
      "name": "Giant",
      "rarity": "Rare",
      "elixir_cost": 5,
      "type": "Troop",
      "attack_rating": 7,
      "defense_rating": 6,
      "f2p_rating": 8,
      "image_url": "GiantCard.webp"
    }
    // ... 7 more cards for complete deck
  ],
  "avg_elixir": 3.8,
  "avg_attack": 7,
  "avg_defense": 6,
  "avg_f2p": 8
}

Response: 201 Created
{
  "success": true,
  "deck_id": 42,
  "message": "Deck saved successfully!"
}
```

### **Retrieve User's Deck Collection**
```javascript
GET /api/decks/user/1
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "decks": [
    {
      "deck_id": 42,
      "deck_name": "Meta Lightning Cycle",
      "cards": [...],
      "avg_elixir": 3.8,
      "avg_attack": 7,
      "avg_defense": 6,
      "avg_f2p": 8,
      "created_at": "2024-11-04T10:30:00Z",
      "updated_at": "2024-11-04T10:30:00Z"
    }
    // ... more decks
  ]
}
```

### **Update Existing Deck**
```javascript
PUT /api/decks/42
Authorization: Bearer <jwt_token>

{
  "deck_name": "Updated Meta Lightning Cycle",
  "cards": [/* modified card array */],
  "avg_elixir": 3.6,
  "avg_attack": 8,
  "avg_defense": 6,
  "avg_f2p": 7
}
```

### **Delete Deck**
```javascript
DELETE /api/decks/42
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "success": true,
  "message": "Deck deleted successfully"
}
```

## Error Handling & Validation

### **Validation Rules**
- ✅ **Deck Completeness**: Exactly 8 cards required
- ✅ **Unique Names**: No duplicate deck names per user
- ✅ **Authentication**: Valid user session required
- ✅ **Card Validation**: Cards must exist in database
- ✅ **Ownership**: Users can only modify their own decks
- ✅ **Name Length**: Deck names 1-100 characters

### **Error Response Format**
```javascript
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Deck must contain exactly 8 cards",
  "details": {
    "field": "cards",
    "current_count": 6,
    "required_count": 8
  }
}
```

### **Common Error Scenarios**
```javascript
// Incomplete deck
400 Bad Request: "Deck must contain exactly 8 cards"

// Duplicate name
409 Conflict: "Deck name already exists for this user"

// Unauthorized access
401 Unauthorized: "Authentication required"

// Deck not found
404 Not Found: "Deck not found or access denied"

// Invalid card data
400 Bad Request: "Invalid card ID: 999"
```

### **Frontend Error Handling**
- **Real-time Validation**: Immediate feedback during deck building
- **User-Friendly Messages**: Clear, actionable error descriptions
- **Retry Mechanisms**: Automatic retry for network failures
- **Loading States**: Visual feedback during API operations
- **Rollback Capability**: Revert changes on save failures

## Advanced Features & Integrations

### 🔥 **Current Live Features**
- ✅ **Real-time Deck Building**: Interactive drag-and-drop interface
- ✅ **Complete Card Database**: 100+ Clash Royale cards with stats
- ✅ **Advanced Analytics**: Attack/Defense/F2P rating system
- ✅ **Deck Copy System**: Import decks from player searches
- ✅ **Mobile Responsive**: Optimized for mobile gameplay
- ✅ **Secure Storage**: Production MySQL with user authentication

### 🚀 **Planned Enhancements**

#### **Social Features**
- **Deck Sharing**: Public deck galleries with community ratings
- **Deck Comments**: User feedback and strategy discussions  
- **Deck Favorites**: Bookmark and follow popular decks
- **Creator Profiles**: Deck builder reputation system

#### **Advanced Analytics**
- **Meta Analysis**: Win rate tracking across different arenas
- **Matchup Predictions**: Deck vs deck performance analysis
- **Card Synergy**: AI-powered card combination recommendations
- **Historical Trends**: Meta evolution and deck popularity tracking

#### **Competitive Features**
- **Tournament Integration**: Official tournament deck tracking
- **Pro Player Decks**: Curated decks from top players
- **Seasonal Meta**: Arena-specific deck recommendations
- **Clan Integration**: Team deck sharing and coordination

#### **Smart Recommendations**
- **AI Deck Optimizer**: Machine learning-powered deck suggestions
- **Counter Deck Builder**: Anti-meta deck generation
- **Card Replacement**: Smart substitutions for missing cards
- **Upgrade Path**: F2P-friendly progression recommendations

### 🛠️ **Technical Architecture**

#### **Performance Optimizations**
- **Database Indexing**: Optimized queries for large deck collections
- **Caching Strategy**: Redis integration for frequently accessed decks
- **CDN Integration**: Fast card image delivery worldwide
- **Lazy Loading**: Progressive deck library loading

#### **Security Enhancements**
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Comprehensive XSS and injection protection
- **Audit Logging**: Track all deck modifications for security
- **Data Encryption**: Sensitive user data protection

### 📊 **Production Statistics**
- **Active Users**: Growing deck builder community
- **Deck Collections**: Thousands of saved deck configurations
- **API Performance**: <500ms average response time
- **Database**: 99.9% uptime with automated backups

### 🎯 **Development Priorities**
1. **Mobile App**: React Native implementation for iOS/Android
2. **Real-time Features**: WebSocket integration for live updates
3. **Advanced Analytics**: Machine learning deck analysis
4. **Community Features**: Social deck sharing and ratings
5. **Tournament Integration**: Official Clash Royale event support

---

## Implementation Notes

### **Production Environment**
- **Live Site**: [metacrown.co.za](https://metacrown.co.za/deck-centre)
- **Database**: MySQL with full ACID compliance
- **Hosting**: cPanel with Node.js 22.18.0 support
- **Security**: JWT authentication with bcrypt password hashing
- **Performance**: Optimized for concurrent users and large datasets

### **Development Guidelines**
- **Code Quality**: ESLint and Prettier for consistent formatting
- **Testing**: Jest unit tests for critical deck operations
- **Documentation**: Comprehensive API docs with examples
- **Version Control**: Git with feature branch workflow
- **Deployment**: Automated CI/CD pipeline (planned)

---

**The MetaCrown Deck Management System represents the core functionality that makes MetaCrown the premier Clash Royale deck building platform. With production-ready features and a robust architecture, it provides players with professional-grade tools for deck optimization and strategy development.**