# MetaCrown Deck Management System

## Overview
This update implements a complete CRUD (Create, Read, Update, Delete) system for managing user decks in MetaCrown.

## Features Implemented

### 1. Database Schema
- Updated `deck.model.js` with proper fields for deck storage
- Added foreign key relationship between users and decks
- JSON field for storing card data with metadata

### 2. Backend API Endpoints
- `POST /api/decks` - Save a new deck
- `GET /api/decks/user/:userId` - Get all decks for a user
- `PUT /api/decks/:deckId` - Update an existing deck
- `DELETE /api/decks/:deckId` - Delete a deck

### 3. Frontend Features
- **Deck Name Input**: Users can name their decks before saving
- **Save Functionality**: Complete validation and error handling
- **Library Tab**: View all saved decks with statistics
- **Load Decks**: Load saved decks back into the builder
- **Delete Decks**: Remove unwanted decks with confirmation

### 4. User Experience
- Real-time feedback for save operations
- Input validation (8 cards required, unique deck names)
- Loading states and error messages
- Responsive design for deck library

## Database Setup

1. Import the `database_setup.sql` file into your MySQL database:
```sql
mysql -u root -p meta_crown_db < database_setup.sql
```

2. Or run the commands manually in your MySQL client.

## Usage

### Saving a Deck
1. Build a complete deck (8 cards) in the Builder tab
2. Enter a unique deck name
3. Click "Save" button
4. Receive confirmation message

### Managing Saved Decks
1. Navigate to the "Library" tab
2. View all your saved decks with statistics
3. Click "Load" to edit a deck in the builder
4. Click "Delete" to remove a deck (with confirmation)

## API Examples

### Save a Deck
```javascript
POST /api/decks
{
  "user_id": 1,
  "deck_name": "My Victory Deck",
  "cards": [/* array of 8 card objects */],
  "avg_elixir": 3.8,
  "avg_attack": 7,
  "avg_defense": 6,
  "avg_f2p": 8
}
```

### Get User's Decks
```javascript
GET /api/decks/user/1
```

## Error Handling
- Validates deck completeness (8 cards)
- Checks for duplicate deck names per user
- Handles authentication (user must be logged in)
- Network error handling with user feedback

## Next Steps
The foundation is now in place for:
- Deck comparison features
- Deck sharing between users
- Deck statistics and analytics
- Tournament deck tracking
- Meta deck analysis

## Notes
- All deck data is stored in MySQL for persistence
- Battle history remains API-only to avoid database bloat
- User authentication is required for all deck operations
- Deck names must be unique per user (not globally)