-- MetaCrown Database Setup Script
-- Run this script to create the necessary tables for deck functionality

-- Create the decks table
CREATE TABLE IF NOT EXISTS `decks` (
  `deck_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `deck_name` varchar(100) NOT NULL,
  `cards` json NOT NULL,
  `avg_elixir` decimal(3,1) DEFAULT NULL,
  `avg_attack` int(11) DEFAULT NULL,
  `avg_defense` int(11) DEFAULT NULL,
  `avg_f2p` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`deck_id`),
  KEY `user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add indexes for better performance
CREATE INDEX `idx_user_decks` ON `decks` (`user_id`, `created_at` DESC);
CREATE INDEX `idx_deck_name` ON `decks` (`user_id`, `deck_name`);

-- Show existing tables
SHOW TABLES;

-- Describe the deck table structure
DESCRIBE decks;