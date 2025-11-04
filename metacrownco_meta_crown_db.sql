-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 04, 2025 at 09:37 PM
-- Server version: 11.4.8-MariaDB-cll-lve
-- PHP Version: 8.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `metacrownco_meta_crown_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `card_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `rarity` enum('Common','Rare','Epic','Legendary','Champion') NOT NULL,
  `elixir_cost` tinyint(4) NOT NULL,
  `type` enum('Troop','Spell','Building') NOT NULL,
  `hitpoints` int(11) DEFAULT NULL,
  `damage` int(11) DEFAULT NULL,
  `damage_per_second` int(11) DEFAULT NULL,
  `attack_speed` float DEFAULT NULL,
  `range` float DEFAULT NULL,
  `targets` varchar(50) DEFAULT NULL,
  `speed` enum('Slow','Medium','Fast','Very Fast') DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `attack_rating` tinyint(4) DEFAULT NULL CHECK (`attack_rating` between 0 and 10),
  `defense_rating` tinyint(4) DEFAULT NULL CHECK (`defense_rating` between 0 and 10),
  `f2p_rating` tinyint(4) DEFAULT NULL CHECK (`f2p_rating` between 0 and 10),
  `name_norm` varchar(255) GENERATED ALWAYS AS (lcase(trim(`name`))) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `cards`
--

INSERT INTO `cards` (`card_id`, `name`, `rarity`, `elixir_cost`, `type`, `hitpoints`, `damage`, `damage_per_second`, `attack_speed`, `range`, `targets`, `speed`, `release_date`, `description`, `image_url`, `attack_rating`, `defense_rating`, `f2p_rating`) VALUES
(1, 'Giant', 'Rare', 5, 'Troop', 3000, 150, 100, 1.5, 3, 'Ground', 'Medium', '2016-01-01', 'A strong tank unit', 'GiantCard.webp', 7, 6, 8),
(2, 'Archers', 'Common', 3, 'Troop', 663, 133, 95, 1.4, 5, 'Air, Ground', 'Medium', '2016-01-04', 'A pair of lightly-armoured ranged attackers. They’ll help take down air and ground units.', 'ArchersCard.webp', 5, 4, 9),
(3, 'Knight', 'Common', 3, 'Troop', 2506, 318, 212, 1.5, 0, 'Ground', 'Medium', '2016-01-04', 'A tough melee fighter with a nice moustache and decent hitpoints.', 'KnightCard.webp', 6, 7, 8),
(4, 'Fireball', 'Rare', 4, 'Spell', NULL, 757, NULL, NULL, 2.5, 'Air, Ground', NULL, '2016-01-04', 'An explosive ball of fire that deals area damage. Good against medium-health troops.', 'FireballCard.webp', 8, 5, 7),
(5, 'Mini PEKKA', 'Rare', 4, 'Troop', 1632, 756, 756, 1, 0, 'Ground', 'Fast', '2016-01-04', 'A single-target melee assassin. High damage per hit but vulnerable to swarms.', 'MiniPEKKACard.webp', 9, 5, 6),
(6, 'Musketeer', 'Rare', 4, 'Troop', 1144, 354, 236, 1.5, 6, 'Air, Ground', 'Medium', '2016-01-04', 'Shoots a long-ranged musket shot that can hit both air and ground units.', 'MusketeerCard.webp', 7, 5, 8),
(7, 'Valkyrie', 'Rare', 4, 'Troop', 2864, 385, 257, 1.5, 0, 'Ground', 'Medium', '2016-01-04', 'Swings her axe in a full circle, dealing splash damage to all nearby ground units.', 'ValkyrieCard.webp', 7, 7, 7),
(8, 'Hog Rider', 'Rare', 4, 'Troop', 2106, 397, 265, 1.5, 0, 'Buildings', 'Very Fast', '2016-01-04', 'Fast and reckless, he jumps the river to attack enemy buildings directly.', 'HogRiderCard.webp', 9, 3, 9),
(9, 'Goblins', 'Common', 2, 'Troop', 432, 159, 132, 1.2, 0, 'Ground', 'Very Fast', '2016-01-04', 'Three quick and squishy melee attackers. Great for distracting and swarming.', 'GoblinsCard.webp', 5, 3, 9),
(10, 'Spear Goblins', 'Common', 2, 'Troop', 216, 101, 76, 1.3, 5.5, 'Air, Ground', 'Very Fast', '2016-01-04', 'Three ranged goblins who throw spears. Low cost and good for chipping damage.', 'SpearGoblinsCard.webp', 4, 3, 8),
(11, 'Skeleton Army', 'Epic', 3, 'Troop', 108, 108, 108, 1, 0, 'Ground', 'Fast', '2016-01-04', 'A horde of fragile skeletons that can overwhelm single-target attackers.', 'SkeletonArmyCard.webp', 7, 4, 8),
(12, 'Baby Dragon', 'Epic', 4, 'Troop', 1679, 218, 145, 1.5, 3.5, 'Air, Ground', 'Fast', '2016-01-04', 'Spits fireballs in splash damage. A versatile flying troop.', 'BabyDragonCard.webp', 7, 6, 8),
(13, 'Witch', 'Epic', 5, 'Troop', 1144, 221, 147, 1.5, 5.5, 'Air, Ground', 'Medium', '2016-01-04', 'Summons skeletons while attacking with splash-damage spells.', 'WitchCard.webp', 6, 6, 7),
(14, 'Skeletons', 'Common', 1, 'Troop', 216, 108, 108, 1, 0, 'Ground', 'Fast', '2016-01-04', 'Three cheap disposable units. Good for cycling and distracting.', 'SkeletonsCard.webp', 4, 2, 10),
(15, 'Bomber', 'Common', 2, 'Troop', 1144, 318, 212, 1.5, 4.5, 'Ground', 'Medium', '2016-01-04', 'Throws bombs that deal area damage to ground targets.', 'BomberCard.webp', 6, 4, 8),
(16, 'Prince', 'Epic', 5, 'Troop', 4192, 756, 504, 1.5, 0, 'Ground', 'Medium', '2016-01-04', 'Charges into battle and deals double damage on impact.', 'PrinceCard.webp', 9, 5, 7),
(17, 'Dark Prince', 'Epic', 4, 'Troop', 2864, 319, 212, 1.5, 0, 'Ground', 'Medium', '2015-12-15', 'Wields a shield and splash-damage attack with a charge mechanic.', 'DarkPrinceCard.webp', 7, 6, 7),
(18, 'Zap', 'Common', 2, 'Spell', NULL, 290, NULL, NULL, 2.5, 'Air, Ground', NULL, '2016-01-04', 'A quick spell that deals damage and stuns enemies for 0.5s.', 'ZapCard.webp', 6, 3, 10),
(19, 'Arrows', 'Common', 3, 'Spell', NULL, 453, NULL, NULL, 4, 'Air, Ground', NULL, '2016-01-04', 'Covers a large area with arrows, good against swarms.', 'ArrowsCard.webp', 6, 4, 9),
(20, 'Rocket', 'Rare', 6, 'Spell', NULL, 1484, NULL, NULL, 2, 'Air, Ground', NULL, '2016-01-04', 'A high-damage spell that obliterates everything in a small area.', 'RocketCard.webp', 9, 4, 6),
(21, 'Lightning', 'Epic', 6, 'Spell', NULL, 1847, NULL, NULL, 3.5, 'Air, Ground', NULL, '2016-01-04', 'Strikes three strongest targets with high damage and a stun effect.', 'LightningCard.webp', 9, 6, 6),
(22, 'Freeze', 'Epic', 4, 'Spell', NULL, 305, NULL, NULL, 3, 'Air, Ground', NULL, '2016-01-04', 'Freezes enemy troops and buildings in place while dealing slight damage.', 'FreezeCard.webp', 5, 7, 7),
(23, 'Goblin Barrel', 'Epic', 4, 'Spell', NULL, 0, NULL, NULL, 0, 'Ground', NULL, '2016-01-04', 'Throws a barrel that spawns goblins directly at enemy towers.', 'GoblinBarrelCard.webp', 8, 4, 9),
(24, 'Tombstone', 'Rare', 3, 'Building', 810, 108, 108, 1, 0, 'Ground', NULL, '2016-01-04', 'Spawns skeletons on death and over time while standing.', 'TombstoneCard.webp', 5, 6, 7),
(25, 'Cannon', 'Common', 3, 'Building', 1526, 318, 212, 1.5, 5.5, 'Ground', NULL, '2016-01-04', 'A defensive building with solid single-target damage against ground units.', 'CannonCard.webp', 6, 7, 8),
(26, 'Tesla', 'Common', 4, 'Building', 1526, 318, 212, 1.5, 5.5, 'Air, Ground', NULL, '2016-01-04', 'Hidden when idle, zaps enemies when they get close.', 'TeslaCard.webp', 6, 8, 8),
(27, 'Inferno Tower', 'Rare', 5, 'Building', 2664, 2900, NULL, NULL, 6, 'Air, Ground', NULL, '2016-01-04', 'Deals increasing damage over time, perfect for tanks.', 'InfernoTowerCard.webp', 9, 9, 6),
(28, 'Elixir Collector', 'Rare', 6, 'Building', 3192, NULL, NULL, NULL, 0, NULL, NULL, '2016-01-04', 'Generates extra elixir over time but is a vulnerable target.', 'ElixirCollectorCard.webp', 0, 4, 5),
(29, 'X-Bow', 'Epic', 6, 'Building', 3192, 91, 131, 0.7, 11.5, 'Ground', NULL, '2016-01-04', 'A long-range siege weapon that targets enemy towers.', 'X-BowCard.webp', 8, 5, 5),
(30, 'Mortar', 'Common', 4, 'Building', 2280, 328, 109, 3, 11.5, 'Ground', NULL, '2016-01-04', 'Launches explosive shells from afar, targeting buildings.', 'MortarCard.webp', 6, 5, 7),
(31, 'Golem', 'Epic', 8, 'Troop', 7176, 756, 252, 3, 0, 'Buildings', 'Slow', '2016-01-04', 'Massive tank that splits into Golemites upon death.', 'GolemCard.webp', 9, 8, 4),
(32, 'Giant Skeleton', 'Epic', 6, 'Troop', 5028, 504, 336, 1.5, 0, 'Ground', 'Medium', '2016-01-04', 'Drops a massive bomb on death, devastating nearby enemies.', 'GiantSkeletonCard.webp', 7, 8, 6),
(33, 'Balloon', 'Epic', 5, 'Troop', 4192, 1512, 504, 3, 0, 'Buildings', 'Medium', '2016-01-04', 'Flies directly to enemy buildings, dropping deadly bombs.', 'BalloonCard.webp', 10, 2, 6),
(34, 'Barbarian Hut', 'Rare', 6, 'Building', 4536, NULL, NULL, NULL, 0, 'Ground', NULL, '2016-01-04', 'Spawns barbarians periodically to pressure lanes.', 'BarbarianHutCard.webp', 5, 7, 5),
(35, 'Barbarian Barrel', 'Epic', 2, 'Spell', 0, 380, NULL, NULL, 3.9, 'Ground', NULL, '2018-03-02', 'Rolls forward damaging everything in its path and spawns a Barbarian.', 'BarbarianBarrelCard.webp', 6, 5, 8),
(36, 'Battle Ram', 'Rare', 4, 'Troop', 1728, 504, 336, 1.5, 0, 'Buildings', 'Medium', '2017-02-13', 'Charges into buildings then spawns two Barbarians.', 'BattleRamCard.webp', 8, 5, 7),
(37, 'Fire Spirits', 'Common', 1, 'Troop', 328, 572, 572, 1, 2, 'Air, Ground', 'Fast', '2016-02-29', 'Suicidal fireballs that explode on contact.', 'FireSpiritsCard.webp', 6, 3, 8),
(38, 'Furnace', 'Rare', 4, 'Troop', 1900, NULL, NULL, NULL, 0, NULL, NULL, '2016-02-29', 'Spawns one fire spirit at a time while dealing damage with its special cauldron brew.', 'FurnaceCard.webp', 4, 6, 6),
(39, 'Guards', 'Epic', 3, 'Troop', 648, 127, 106, 1.2, 0, 'Ground', 'Fast', '2016-03-23', 'Skeletons with shields that block initial damage.', 'GuardsCard.webp', 5, 6, 7),
(40, 'Princess', 'Legendary', 3, 'Troop', 684, 254, 85, 3, 9, 'Air, Ground', 'Slow', '2016-03-02', 'Longest range in the game, shoots flaming arrows.', 'PrincessCard.webp', 6, 4, 6),
(41, 'Ice Wizard', 'Legendary', 3, 'Troop', 1276, 159, 106, 1.5, 5.5, 'Air, Ground', 'Medium', '2016-03-02', 'Slows enemy movement and attack speed with ice blasts.', 'IceWizardCard.webp', 4, 7, 7),
(42, 'Lava Hound', 'Legendary', 7, 'Troop', 5256, 168, 56, 3, 0, 'Buildings', 'Slow', '2016-05-02', 'Flying tank that spawns Lava Pups when destroyed.', 'LavaHoundCard.webp', 4, 8, 4),
(43, 'Miner', 'Legendary', 3, 'Troop', 2016, 290, 193, 1.5, 0, 'Ground', 'Medium', '2016-05-03', 'Can be deployed anywhere in the arena, digs underground.', 'MinerCard.webp', 7, 5, 9),
(44, 'Royal Giant', 'Rare', 6, 'Troop', 4192, 262, 174, 1.5, 6.5, 'Buildings', 'Medium', '2016-04-01', 'Shoots over the river to attack enemy buildings.', 'RoyalGiantCard.webp', 8, 5, 6),
(45, 'Electro Wizard', 'Legendary', 4, 'Troop', 1276, 183, 122, 1.5, 5, 'Air, Ground', 'Medium', '2017-01-12', 'Stuns enemies on spawn and with each attack.', 'ElectroWizardCard.webp', 7, 6, 7),
(46, 'Minion Horde', 'Rare', 5, 'Troop', 546, 159, 106, 1.5, 3.5, 'Air, Ground', 'Fast', '2016-01-04', 'A horde of six minions that can quickly take down single-target troops.', 'MinionHordeCard.webp', 7, 4, 7),
(47, 'PEKKA', 'Epic', 7, 'Troop', 5344, 1218, 809, 1.5, 0, 'Ground', '', '2016-01-04', 'Heavy-hitting tanky melee unit. High damage and HP.', 'PEKKACard.webp', 10, 9, 5),
(48, 'Ice Spirit', 'Common', 1, 'Troop', 127, 92, 92, 1, 1, 'Ground', 'Very Fast', '2016-01-04', 'Freezes enemies for 1 second on contact.', 'IceSpiritCard.webp', 4, 3, 10),
(49, 'Ice Golem', 'Rare', 2, 'Troop', 1100, 65, 43, 1.5, 0, 'Ground', 'Medium', '2017-03-23', 'Tanky troop that slows enemies when destroyed.', 'IceGolemCard.webp', 5, 7, 8),
(50, 'Sparky', 'Legendary', 6, 'Troop', 2080, 1360, 680, 2, 0, 'Ground', 'Slow', '2016-06-01', 'Charges up for massive area damage.', 'SparkyCard.webp', 10, 4, 6),
(51, 'Goblin Gang', 'Common', 3, 'Troop', 216, 108, 108, 1, 0, 'Ground', 'Fast', '2016-05-03', 'A mix of Goblins and Spear Goblins. Good for swarming.', 'GoblinGangCard.webp', 5, 3, 9),
(52, 'Hunter', 'Epic', 4, 'Troop', 1200, 320, 320, 1, 0, 'Air, Ground', 'Medium', '2018-05-15', 'Short-range but high burst damage in a cone.', 'HunterCard.webp', 7, 7, 7),
(53, 'Flying Machine', 'Rare', 4, 'Troop', 910, 190, 127, 1.5, 6, 'Air, Ground', 'Medium', '2016-06-01', 'A flying troop that attacks from range.', 'FlyingMachineCard.webp', 6, 5, 7),
(54, 'Bandit', 'Legendary', 3, 'Troop', 1020, 300, 300, 1, 0, 'Ground', 'Fast', '2017-06-01', 'Dashes to enemy units, dealing double damage on contact.', 'BanditCard.webp', 8, 5, 8),
(55, 'Goblin Giant', 'Epic', 6, 'Troop', 2532, 230, 153, 1.5, 0, 'Buildings', 'Medium', '2019-03-01', 'Tanky unit carrying two Spear Goblins on its back.', 'GoblinGiantCard.webp', 8, 6, 6),
(56, 'Ram Rider', 'Legendary', 5, 'Troop', 1800, 280, 140, 2, 0, 'Buildings', 'Fast', '2019-10-01', 'Charges to buildings, slowing enemies in its path.', 'RamRiderCard.webp', 8, 5, 7),
(57, 'Mega Knight', 'Legendary', 7, 'Troop', 5732, 1218, 609, 2, 0, 'Ground', '', '2017-10-01', 'Deals splash damage on spawn and jumps between enemies.', 'MegaKnightCard.webp', 10, 8, 5),
(58, 'Magic Archer', 'Legendary', 4, 'Troop', 1020, 209, 139, 1.5, 7, 'Air, Ground', 'Medium', '2018-04-01', 'Shoots a long-range arrow that pierces through enemies.', 'MagicArcherCard.webp', 7, 5, 7),
(59, 'Night Witch', 'Legendary', 4, 'Troop', 1008, 112, 112, 1, 0, 'Ground', 'Medium', '2017-12-01', 'Spawns bats while attacking with melee.', 'NightWitchCard.webp', 7, 6, 7),
(60, 'Firecracker', 'Rare', 3, 'Troop', 864, 152, 152, 1, 6.5, 'Air, Ground', 'Medium', '2018-08-01', 'Shoots an explosive projectile that damages multiple units.', 'FirecrackerCard.webp', 6, 4, 8),
(61, 'Electro Spirit', 'Common', 1, 'Troop', 108, 108, 108, 1, 1, 'Air, Ground', 'Fast', '2018-03-01', 'Jumps to multiple targets dealing a stun.', 'ElectroSpiritCard.webp', 5, 3, 9),
(62, 'Skeleton Barrel', 'Epic', 3, 'Troop', 864, 182, 182, 1, 0, 'Ground', 'Medium', '2019-05-01', 'Rolls towards a tower and breaks open to release skeletons.', 'SkeletonBarrelCard.webp', 7, 5, 7),
(63, 'Royal Ghost', 'Legendary', 3, 'Troop', 1276, 254, 127, 2, 0, 'Ground', 'Fast', '2019-09-01', 'Invisible until it attacks, dealing splash damage to troops.', 'RoyalGhostCard.webp', 7, 6, 8),
(64, 'Wall Breakers', 'Epic', 2, 'Troop', 432, 312, 156, 2, 0, 'Buildings', 'Very Fast', '2018-05-01', 'Two skeletons with bombs, deal huge building damage.', 'WallBreakersCard.webp', 7, 4, 8),
(65, 'Zappies', 'Rare', 4, 'Troop', 910, 158, 105, 1.5, 0, 'Air, Ground', 'Medium', '2018-02-01', 'Three small zapper units that stun enemies.', 'ZappiesCard.webp', 6, 5, 7),
(66, 'Cannon Cart', 'Epic', 5, 'Troop', 1232, 254, 127, 2, 5.5, 'Ground', 'Medium', '2019-07-01', 'A mobile cannon that becomes a stationary building after being destroyed.', 'CannonCartCard.webp', 7, 6, 7),
(67, 'Fisherman', 'Legendary', 3, 'Troop', 1260, 180, 120, 1.5, 0, 'Ground', 'Medium', '2019-04-01', 'Hooks enemy troops and drags them closer.', 'FishermanCard.webp', 7, 6, 8),
(68, 'Elite Barbarians', 'Rare', 6, 'Troop', 1368, 423, 211, 2, 0, 'Ground', 'Very Fast', '2016-01-04', 'Two powerful barbarians that rush enemy towers.', 'EliteBarbariansCard.webp', 9, 5, 7),
(69, 'Graveyard', 'Legendary', 5, 'Spell', 0, 0, 0, 0, 0, 'Ground', NULL, '2016-01-04', 'Summons skeletons randomly over an area for a duration.', 'GraveyardCard.webp', 9, 4, 7),
(70, 'Tornado', 'Epic', 3, 'Spell', 0, 0, 0, 0, 4.5, 'Air, Ground', NULL, '2016-01-04', 'Pulls enemies into the centre and deals damage over time.', 'TornadoCard.webp', 5, 6, 7),
(71, 'Phoenix', 'Legendary', 4, 'Troop', 1200, 200, 133, 1.5, 1.2, 'Air & Ground', 'Fast', '2022-11-01', 'A fiery bird that resurrects once when defeated.', 'PhoenixCard.webp', 8, 5, 7),
(72, 'Monk', 'Champion', 5, 'Troop', 1800, 150, 100, 1.5, 1, 'Ground', 'Medium', '2022-11-01', 'A master of patience who can deflect projectiles with his ability.', 'MonkCard.webp', 7, 8, 6),
(73, 'Goblin Drill', 'Epic', 4, 'Building', 1200, 0, 0, NULL, NULL, 'Ground', '', '2021-06-01', 'A tunnel that spawns Goblins directly onto enemy territory.', 'GoblinDrillCard.webp', 8, 4, 7),
(74, 'Skeleton King', 'Champion', 4, 'Troop', 2300, 160, 106, 1.5, 1, 'Ground', 'Medium', '2021-10-01', 'Collects souls of fallen troops to unleash a Skeleton army.', 'SkeletonKingCard.webp', 8, 7, 6),
(75, 'Archer Queen', 'Champion', 5, 'Troop', 1200, 250, 250, 1, 5, 'Air & Ground', 'Medium', '2021-10-01', 'A ranged Champion with a stealth ability that boosts her attack speed.', 'ArcherQueenCard.webp', 9, 5, 6),
(76, 'Golden Knight', 'Champion', 4, 'Troop', 2100, 160, 106, 1.5, 1, 'Ground', 'Fast', '2021-10-01', 'Charges through enemies with his dash ability.', 'GoldenKnightCard.webp', 8, 6, 7),
(77, 'Mighty Miner', 'Champion', 4, 'Troop', 2200, 180, 120, 1.5, 1, 'Ground', 'Medium', '2022-04-01', 'Drills through the arena and can switch lanes with his ability.', 'MightyMinerCard.webp', 7, 7, 6),
(78, 'Battle Healer', 'Rare', 4, 'Troop', 1500, 100, 67, 1.5, 1, 'Ground', 'Medium', '2019-12-01', 'Heals nearby allies while attacking enemies.', 'BattleHealerCard.webp', 6, 7, 8),
(79, 'Mother Witch', 'Legendary', 4, 'Troop', 1200, 120, 80, 1.5, 5, 'Air & Ground', 'Medium', '2020-12-01', 'Curses enemies into Cursed Hogs when they die.', 'MotherWitchCard.webp', 7, 6, 7),
(80, 'Rune Giant', 'Epic', 6, 'Troop', 3500, 250, 167, 1.5, 1, 'Buildings', 'Slow', '2025-03-01', 'A mystical giant empowered by runes, stronger near towers.', 'RuneGiantCard.webp', 8, 7, 6),
(81, 'Berserker', 'Common', 3, 'Troop', 900, 180, 180, 1, 1, 'Ground', 'Fast', '2025-05-01', 'A frenzied warrior who gains attack speed as his health drops.', 'BerserkerCard.webp', 8, 5, 8),
(82, 'Boss Bandit', 'Champion', 6, 'Troop', 1600, 220, 146, 1.2, 1, 'Ground', 'Fast', '2025-08-01', 'A rogue leader with a powerful dash that chains between enemies.', 'BossBanditCard.webp', 9, 6, 7),
(83, 'Barbarians', 'Common', 5, 'Troop', 1500, 120, 80, 1.5, 1, 'Ground', 'Medium', '2016-01-01', 'A squad of five melee fighters.', 'BarbariansCard.webp', 6, 6, 7),
(84, 'Bats', 'Common', 2, 'Troop', 100, 50, 50, 1, 2.5, 'Air & Ground', 'Very Fast', '2017-07-01', 'A swarm of fast flying creatures.', 'BatsCard.webp', 6, 4, 8),
(85, 'Bomb Tower', 'Rare', 4, 'Building', 1500, 100, 67, 1.5, 6, 'Ground', '', '2016-01-01', 'Defensive tower that throws bombs.', 'BombTowerCard.webp', 6, 8, 6),
(86, 'Bowler', 'Epic', 5, 'Troop', 1600, 200, 133, 1.5, 5, 'Ground', 'Slow', '2016-03-01', 'Rolls a giant boulder that knocks back enemies.', 'BowlerCard.webp', 7, 7, 6),
(87, 'Clone', 'Epic', 3, 'Spell', NULL, NULL, NULL, NULL, NULL, 'N/A', '', '2016-12-01', 'Duplicates all friendly troops in the area.', 'CloneCard.webp', 6, 3, 5),
(88, 'Dart Goblin', 'Rare', 3, 'Troop', 700, 120, 120, 1, 6.5, 'Air & Ground', 'Fast', '2017-02-01', 'Shoots darts at long range.', 'DartGoblinCard.webp', 6, 4, 7),
(89, 'Earthquake', 'Rare', 3, 'Spell', NULL, 200, 200, NULL, 3.5, 'Buildings', '', '2019-04-01', 'Damages and slows buildings and troops.', 'EarthquakeCard.webp', 7, 5, 6),
(90, 'Electro Dragon', 'Epic', 5, 'Troop', 1600, 200, 133, 1.5, 3.5, 'Air & Ground', 'Medium', '2018-11-01', 'Chains lightning between enemies.', 'ElectroDragonCard.webp', 7, 6, 6),
(91, 'Elixir Golem', 'Epic', 3, 'Troop', 1200, 100, 67, 1.5, 1, 'Ground', 'Slow', '2019-11-01', 'Splits into smaller golems and gives Elixir to the opponent.', 'ElixirGolemCard.webp', 7, 4, 5),
(92, 'Executioner', 'Epic', 5, 'Troop', 1600, 200, 133, 1.5, 4.5, 'Air & Ground', 'Medium', '2017-02-01', 'Throws his axe like a boomerang.', 'ExecutionerCard.webp', 7, 7, 6),
(94, 'Giant Snowball', 'Common', 2, 'Spell', NULL, 150, 150, NULL, 3, 'Air & Ground', '', '2018-06-01', 'A big snowball that knocks back and slows.', 'GiantSnowballCard.webp', 6, 4, 7),
(95, 'Goblin Cage', 'Rare', 4, 'Building', 1200, 0, 0, NULL, NULL, 'Ground', '', '2019-06-01', 'Releases a Goblin Brawler when destroyed.', 'GoblinCageCard.webp', 6, 7, 6),
(96, 'Goblin Hut', 'Rare', 4, 'Building', 1200, 0, 0, NULL, NULL, 'Ground', '', '2016-01-01', 'Spawns Spear Goblins periodically.', 'GoblinHutCard.webp', 6, 7, 6),
(97, 'Heal Spirit', 'Rare', 1, 'Troop', 200, 100, 100, 1, 2.5, 'Air & Ground', 'Very Fast', '2020-04-01', 'Jumps and heals allies in a small radius.', 'HealSpiritCard.webp', 5, 4, 8),
(98, 'Inferno Dragon', 'Legendary', 4, 'Troop', 1200, 30, 20, 1.5, 3.5, 'Air & Ground', 'Medium', '2016-09-01', 'Fires a beam that ramps up damage.', 'InfernoDragonCard.webp', 8, 5, 7),
(99, 'The Log', 'Legendary', 2, 'Spell', NULL, 240, 240, NULL, 11, 'Ground', '', '2016-07-01', 'Rolls through and knocks back ground troops.', 'TheLogCard.webp', 7, 5, 7),
(100, 'Lumberjack', 'Legendary', 4, 'Troop', 1060, 200, 200, 1, 1, 'Ground', 'Fast', '2016-07-01', 'Drops a Rage spell when defeated.', 'LumberjackCard.webp', 8, 5, 7),
(101, 'Mega Minion', 'Common', 3, 'Troop', 600, 150, 100, 1.5, 2, 'Air & Ground', 'Medium', '2016-09-01', 'A flying mini‑tank with strong damage.', 'MegaMinionCard.webp', 7, 5, 7),
(102, 'Mirror', 'Epic', 1, 'Spell', NULL, NULL, NULL, NULL, NULL, 'N/A', '', '2016-01-01', 'Repeats your last card at +1 level.', 'MirrorCard.webp', 7, 3, 6),
(103, 'Poison', 'Epic', 4, 'Spell', NULL, 240, 240, NULL, 3.5, 'Air & Ground', '', '2016-05-01', 'Covers an area with damaging poison.', 'PoisonCard.webp', 7, 6, 6),
(104, 'Rage', 'Epic', 2, 'Spell', NULL, NULL, NULL, NULL, 5, 'Friendly', '', '2016-01-01', 'Increases movement and attack speed.', 'RageCard.webp', 6, 3, 7),
(105, 'Rascals', 'Rare', 5, 'Troop', 1600, 120, 80, 1.5, 5, 'Air & Ground', 'Medium', '2018-05-01', 'A boy tank and two girl ranged attackers.', 'RascalsCard.webp', 6, 6, 7),
(106, 'Royal Delivery', 'Common', 3, 'Spell', NULL, 200, 200, NULL, 3, 'Air & Ground', '', '2020-01-01', 'Drops a Royal Recruit from the sky.', 'RoyalDeliveryCard.webp', 6, 5, 7),
(107, 'Royal Hogs', 'Rare', 5, 'Troop', 1600, 120, 80, 1.5, 1, 'Buildings', 'Fast', '2018-06-01', 'Four hogs that charge buildings.', 'RoyalHogsCard.webp', 7, 5, 7),
(108, 'Royal Recruits', 'Common', 7, 'Troop', 2000, 120, 80, 1.5, 1, 'Ground', 'Medium', '2018-06-01', 'Six shielded soldiers that split across lanes.', 'RoyalRecruitsCard.webp', 6, 7, 6),
(109, 'Skeleton Dragons', 'Common', 4, 'Troop', 800, 100, 67, 1.5, 3.5, 'Air & Ground', 'Fast', '2020-06-01', 'Two flying dragons that breathe fire.', 'SkeletonDragonsCard.webp', 6, 5, 7),
(110, 'Three Musketeers', 'Rare', 9, 'Troop', 900, 180, 120, 1.5, 6, 'Air & Ground', 'Medium', '2016-01-01', 'Deploys three powerful Musketeers.', 'ThreeMusketeersCard.webp', 8, 4, 5),
(111, 'Wizard', 'Rare', 5, 'Troop', 1200, 200, 133, 1.5, 5, 'Air & Ground', 'Medium', '2016-01-01', 'Casts fireballs that deal splash damage.', 'WizardCard.webp', 7, 5, 7),
(112, 'Goblinstein', 'Champion', 5, 'Troop', 2000, 150, 100, 1.8, 5.5, 'Ground', 'Medium', '2025-01-01', 'Monster lumbers towards enemy building while Doctor waits to spring the trap.', 'GoblinsteinCard.webp', 7, 7, 4),
(113, 'Little Prince', 'Champion', 3, 'Troop', 900, 180, 180, 1.2, 5.5, 'Air & Ground', 'Medium', '2025-01-01', 'A royal prodigy with a powerful ranged shot and a body guard to back him.', 'LittlePrinceCard.webp', 8, 4, 7),
(114, 'Spirit Empress', 'Champion', 5, 'Troop', 1800, 200, 133, 1.5, 4.5, 'Air & Ground', 'Medium', '2025-01-01', 'Commands elemental spirits to aid her in battle.', 'SpiritEmpressCard.webp', 8, 6, 6),
(115, 'Goblin Machine', 'Legendary', 5, 'Troop', 1500, 120, 80, 1.2, 1, 'Air & Ground', 'Medium', '2025-01-01', 'A contraption with two arms for melee and one big rocket for faraway targets.', 'GoblinMachineCard.webp', 7, 6, 6),
(116, 'Electro Giant', 'Epic', 8, 'Troop', 3500, 200, 133, 1.5, 1, 'Buildings', 'Slow', '2020-10-01', 'A massive giant that zaps nearby enemies when hit.', 'ElectroGiantCard.webp', 8, 7, 6),
(117, 'Void', 'Epic', 4, 'Spell', NULL, 250, 250, NULL, 3.5, 'Air & Ground', '', '2025-01-01', 'Creates a dark zone that damages and silences enemies.', 'VoidCard.webp', 8, 5, 6),
(118, 'Vines', 'Epic', 3, 'Spell', NULL, 150, 150, NULL, 2.5, 'Air & Ground', '', '2025-01-01', 'Entangles enemy troops, slowing them down.', 'VinesCard.webp', 6, 5, 7),
(119, 'Goblin Curse', 'Epic', 4, 'Spell', NULL, 200, 200, NULL, 3.5, 'Air & Ground', '', '2025-01-01', 'Curses enemies into goblins upon defeat.', 'GoblinCurseCard.webp', 7, 5, 6),
(120, 'Goblin Demolisher', 'Rare', 4, 'Troop', 1800, 220, 146, 1.5, 1, 'Buildings', 'Medium', '2025-01-01', 'A goblin with explosives that targets defenses.', 'GoblinDemolisherCard.webp', 8, 6, 6),
(121, 'Suspicious Bush', 'Rare', 2, 'Building', 800, 0, 0, NULL, NULL, 'Buildings', 'Medium', '2025-01-01', 'A bush that hides goblins until enemies approach.', 'SuspiciousBushCard.webp', 5, 6, 7);

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `admin_response` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `name`, `email`, `subject`, `message`, `is_read`, `admin_response`, `created_at`) VALUES
(4, 'Jordan', 'test@email.com', 'Test ', 'Hierdie is \'n toets van\'n ander pc af om seker te maak die website load die boodkappe vir die admin op enige site', 1, NULL, '2025-10-28 06:23:08'),
(5, 'Tsunagi', 'ManUtd@gmail.com', 'Presentation', 'This is a test ', 1, NULL, '2025-10-28 07:33:29'),
(6, 'Stefan', 'venterstefand@gmail.com', 'clash account ', 'Why is my clash royale account broken', 1, NULL, '2025-11-01 21:12:16');

-- --------------------------------------------------------

--
-- Table structure for table `decks`
--

CREATE TABLE `decks` (
  `deck_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `deck_name` varchar(100) NOT NULL,
  `cards` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`cards`)),
  `avg_elixir` decimal(3,1) DEFAULT NULL,
  `avg_attack` int(11) DEFAULT NULL,
  `avg_defense` int(11) DEFAULT NULL,
  `avg_f2p` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `decks`
--

INSERT INTO `decks` (`deck_id`, `user_id`, `deck_name`, `cards`, `avg_elixir`, `avg_attack`, `avg_defense`, `avg_f2p`, `created_at`, `updated_at`) VALUES
(10, 15, 'main deck', '\"[{\\\"name\\\":\\\"Bats\\\",\\\"id\\\":26000049,\\\"maxLevel\\\":14,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":2,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/EnIcvO21hxiNpoI-zO6MDjLmzwPbq8Z4JPo2OKoVUjU.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/EnIcvO21hxiNpoI-zO6MDjLmzwPbq8Z4JPo2OKoVUjU.png\\\"},\\\"rarity\\\":\\\"common\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/EnIcvO21hxiNpoI-zO6MDjLmzwPbq8Z4JPo2OKoVUjU.png\\\"},{\\\"name\\\":\\\"Valkyrie\\\",\\\"id\\\":26000011,\\\"maxLevel\\\":12,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/0lIoYf3Y_plFTzo95zZL93JVxpfb3MMgFDDhgSDGU9A.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/0lIoYf3Y_plFTzo95zZL93JVxpfb3MMgFDDhgSDGU9A.png\\\"},\\\"rarity\\\":\\\"rare\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/0lIoYf3Y_plFTzo95zZL93JVxpfb3MMgFDDhgSDGU9A.png\\\"},{\\\"name\\\":\\\"Firecracker\\\",\\\"id\\\":26000064,\\\"maxLevel\\\":14,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":3,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/c1rL3LO1U2D9-TkeFfAC18gP3AO8ztSwrcHMZplwL2Q.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/c1rL3LO1U2D9-TkeFfAC18gP3AO8ztSwrcHMZplwL2Q.png\\\"},\\\"rarity\\\":\\\"common\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/c1rL3LO1U2D9-TkeFfAC18gP3AO8ztSwrcHMZplwL2Q.png\\\"},{\\\"name\\\":\\\"Skeleton Army\\\",\\\"id\\\":26000012,\\\"maxLevel\\\":9,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":3,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/fAOToOi1pRy7svN2xQS6mDkhQw2pj9m_17FauaNqyl4.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/fAOToOi1pRy7svN2xQS6mDkhQw2pj9m_17FauaNqyl4.png\\\"},\\\"rarity\\\":\\\"epic\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/fAOToOi1pRy7svN2xQS6mDkhQw2pj9m_17FauaNqyl4.png\\\"},{\\\"name\\\":\\\"Furnace\\\",\\\"id\\\":27000010,\\\"maxLevel\\\":12,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/iqbDiG7yYRIzvCPXdt9zPb3IvMt7F7Gi4wIPnh2x4aI.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/iqbDiG7yYRIzvCPXdt9zPb3IvMt7F7Gi4wIPnh2x4aI.png\\\"},\\\"rarity\\\":\\\"rare\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/iqbDiG7yYRIzvCPXdt9zPb3IvMt7F7Gi4wIPnh2x4aI.png\\\"},{\\\"name\\\":\\\"The Log\\\",\\\"id\\\":28000011,\\\"maxLevel\\\":6,\\\"elixirCost\\\":2,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/_iDwuDLexHPFZ_x4_a0eP-rxCS6vwWgTs6DLauwwoaY.png\\\"},\\\"rarity\\\":\\\"legendary\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/_iDwuDLexHPFZ_x4_a0eP-rxCS6vwWgTs6DLauwwoaY.png\\\"},{\\\"name\\\":\\\"Mega Knight\\\",\\\"id\\\":26000055,\\\"maxLevel\\\":6,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":7,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/O2NycChSNhn_UK9nqBXUhhC_lILkiANzPuJjtjoz0CE.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/O2NycChSNhn_UK9nqBXUhhC_lILkiANzPuJjtjoz0CE.png\\\"},\\\"rarity\\\":\\\"legendary\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/O2NycChSNhn_UK9nqBXUhhC_lILkiANzPuJjtjoz0CE.png\\\"},{\\\"name\\\":\\\"Hog Rider\\\",\\\"id\\\":26000021,\\\"maxLevel\\\":12,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/Ubu0oUl8tZkusnkZf8Xv9Vno5IO29Y-jbZ4fhoNJ5oc.png\\\"},\\\"rarity\\\":\\\"rare\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/Ubu0oUl8tZkusnkZf8Xv9Vno5IO29Y-jbZ4fhoNJ5oc.png\\\"}]\"', 3.6, 5, 5, 5, '2025-10-28 16:42:35', '2025-10-28 16:42:35'),
(11, 19, 'Oui Oui', '\"[{\\\"name\\\":\\\"Ice Spirit\\\",\\\"id\\\":26000030,\\\"maxLevel\\\":14,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":1,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/lv1budiafU9XmSdrDkk0NYyqASAFYyZ06CPysXKZXlA.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/lv1budiafU9XmSdrDkk0NYyqASAFYyZ06CPysXKZXlA.png\\\"},\\\"rarity\\\":\\\"common\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/lv1budiafU9XmSdrDkk0NYyqASAFYyZ06CPysXKZXlA.png\\\"},{\\\"name\\\":\\\"Baby Dragon\\\",\\\"id\\\":26000015,\\\"maxLevel\\\":9,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0.png\\\"},\\\"rarity\\\":\\\"epic\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0.png\\\"},{\\\"name\\\":\\\"Inferno Dragon\\\",\\\"id\\\":26000037,\\\"maxLevel\\\":6,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/y5HDbKtTbWG6En6TGWU0xoVIGs1-iQpIP4HC-VM7u8A.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/y5HDbKtTbWG6En6TGWU0xoVIGs1-iQpIP4HC-VM7u8A.png\\\"},\\\"rarity\\\":\\\"legendary\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/y5HDbKtTbWG6En6TGWU0xoVIGs1-iQpIP4HC-VM7u8A.png\\\"},{\\\"name\\\":\\\"Knight\\\",\\\"id\\\":26000000,\\\"maxLevel\\\":14,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":3,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png\\\"},\\\"rarity\\\":\\\"common\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png\\\"},{\\\"name\\\":\\\"Battle Healer\\\",\\\"id\\\":26000068,\\\"maxLevel\\\":12,\\\"elixirCost\\\":4,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/KdwXcoigS2Kg-cgA7BJJIANbUJG6SNgjetRQ-MegZ08.png\\\"},\\\"rarity\\\":\\\"rare\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/KdwXcoigS2Kg-cgA7BJJIANbUJG6SNgjetRQ-MegZ08.png\\\"},{\\\"name\\\":\\\"Wizard\\\",\\\"id\\\":26000017,\\\"maxLevel\\\":12,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":5,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/Mej7vnv4H_3p_8qPs_N6_GKahy6HDr7pU7i9eTHS84U.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/Mej7vnv4H_3p_8qPs_N6_GKahy6HDr7pU7i9eTHS84U.png\\\"},\\\"rarity\\\":\\\"rare\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/Mej7vnv4H_3p_8qPs_N6_GKahy6HDr7pU7i9eTHS84U.png\\\"},{\\\"name\\\":\\\"Golem\\\",\\\"id\\\":26000009,\\\"maxLevel\\\":9,\\\"elixirCost\\\":8,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/npdmCnET7jmVjJvjJQkFnNSNnDxYHDBigbvIAloFMds.png\\\"},\\\"rarity\\\":\\\"epic\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/npdmCnET7jmVjJvjJQkFnNSNnDxYHDBigbvIAloFMds.png\\\"},{\\\"name\\\":\\\"Skeletons\\\",\\\"id\\\":26000010,\\\"maxLevel\\\":14,\\\"maxEvolutionLevel\\\":1,\\\"elixirCost\\\":1,\\\"iconUrls\\\":{\\\"medium\\\":\\\"https://api-assets.clashroyale.com/cards/300/oO7iKMU5m0cdxhYPZA3nWQiAUh2yoGgdThLWB1rVSec.png\\\",\\\"evolutionMedium\\\":\\\"https://api-assets.clashroyale.com/cardevolutions/300/oO7iKMU5m0cdxhYPZA3nWQiAUh2yoGgdThLWB1rVSec.png\\\"},\\\"rarity\\\":\\\"common\\\",\\\"imageUrl\\\":\\\"https://api-assets.clashroyale.com/cards/300/oO7iKMU5m0cdxhYPZA3nWQiAUh2yoGgdThLWB1rVSec.png\\\"}]\"', 3.8, 5, 5, 5, '2025-11-01 21:09:09', '2025-11-01 21:09:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `player_tag` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email_address`, `password`, `player_tag`, `username`, `created_at`, `updated_at`, `is_admin`) VALUES
(1, 'poalsesxander@gmail.com', '$2b$12$T.ZKo7Km/1my./Nn8Ca5VeEjGyP4ktzOzm1Rgj7ymV8WGk7hKylxG', '#2RC0P82YC', 'x.ander.OS', '2025-10-27 06:37:55', '2025-10-27 07:06:26', 1),
(8, '241077@virtualwindow.co.za', '$2b$12$A6HepASC16leRyGD7oIsUesScaySkbsOx/3JyuHRufZ0MiUOj6P86', '#ANGIEVR05', 'AngievR05', '2025-10-28 07:04:26', '2025-10-28 07:04:26', 0),
(9, 'kai@gmail.com', '$2b$12$cN3SQQp3MMdHH7FXtTbGhuA9voPOs12x/H.Y4aRbigUszpK/KjUfO', '#PY0YVJRYR', 'Synergyy', '2025-10-28 07:40:12', '2025-10-28 07:40:12', 0),
(10, 'ps4xanderstrydom@gmail.com', '$2b$12$Y2dyPEw684GTDdrbmvTcdOFIz9w.At0ilwnWna/I4/Y2QXkmf8vvy', '#CVYV808YY', 'Early', '2025-10-28 08:13:18', '2025-10-28 08:13:18', 0),
(11, 'meyermarkus513@gmail.com', '$2b$12$vvCPk1VGllfovubmph0pUO1ax9q4bwyynasxlEeq8zr4cOYI5UxSu', '#1', 'PeanutButterBrood', '2025-10-28 09:25:16', '2025-10-28 09:25:16', 0),
(12, 'zanderkdebeer@gmail.com', '$2b$12$wYfCeQF4Hzlo9lFyCs062uyxJvtd.xMWl/PjIqmWvWvmaA8.cMzS.', '#IFORGOR', 'Octaneology', '2025-10-28 11:30:16', '2025-10-28 11:30:16', 0),
(13, 'corbyncrobinson@gmail.com', '$2b$12$6k3etDJxQrZaYov.n3tOCe.J4vNmbTy9rNs4nOMqt3MOZjC/4vJTW', '#JPG', 'Corbyn', '2025-10-28 12:16:30', '2025-10-28 12:16:30', 0),
(14, 'Saucegod@gmail.com', '$2b$12$D62A4JJ5xlK2jmQvTH2TJ.8pJIEAytyOBdrpsv0nDdj.x6OZwD93S', '#123', 'SauceGod', '2025-10-28 12:41:43', '2025-10-28 12:41:43', 0),
(15, 'jacques.vorster135@gmail.com', '$2b$12$L5FyaDQQVb0ToqIgksLWzeyzQO82U0m2Akil5edPjUx9mJimwaw1i', '#YJULCYOJ9', 'Slet_sappies', '2025-10-28 16:37:14', '2025-10-28 16:37:14', 0),
(16, 'alex.poalses@gmail.com', '$2b$12$qcPkPg9e9sxzGArguns0XuhGLhiAVKjteVSV1pEqoV0losOw9D56W', '#29L0UJC', 'alex.poalses@gmail.com', '2025-10-29 05:56:16', '2025-10-29 05:56:16', 0),
(17, 'orlandopretoria@gmail.com', '$2b$12$ARPF7D.4/ghi21OR9gej.u6rO3nNIJ1ZBSuIx77ii7KA.bNH3uEsS', '#8JYQRPYQR', 'Rouge_Revenant', '2025-10-29 09:41:44', '2025-10-29 09:41:44', 0),
(18, '21100471@virtualwindow.co.za', '$2b$12$dgAvrx3uZrhLgtAObFlNFeAvMjMzHUeyIr.8/9b7A4uS2oxuvfBUa', '#2198', 'MRV', '2025-10-29 13:49:55', '2025-10-29 13:49:55', 0),
(19, 'venterstefand@gmail.com', '$2b$12$WTaj6uAGfw/Z64PAFEd3m.kaBDApKsDJsYf6a/StdU/Wvuzxu1716', '#123456', 'Stefan V', '2025-11-01 21:04:59', '2025-11-01 21:04:59', 0),
(52, 'test@gmail.com', '$2b$12$xb7FLDLcLr/FHTs2w4n7deqAOd.z4Cvu76A3BKqnHwGiUiruo1Kd6', '#TEST', 'test', '2025-11-04 09:30:46', '2025-11-04 09:30:46', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`card_id`),
  ADD UNIQUE KEY `uk_cards_name_norm` (`name_norm`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `decks`
--
ALTER TABLE `decks`
  ADD PRIMARY KEY (`deck_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email_address` (`email_address`),
  ADD UNIQUE KEY `player_tag` (`player_tag`),
  ADD UNIQUE KEY `uq_users_email` (`email_address`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `card_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `decks`
--
ALTER TABLE `decks`
  MODIFY `deck_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `decks`
--
ALTER TABLE `decks`
  ADD CONSTRAINT `decks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
