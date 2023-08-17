-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 15, 2023 at 10:35 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `da_1`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `event_location` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` varchar(60) NOT NULL,
  `event_point` decimal(10,2) NOT NULL DEFAULT 0.00,
  `hasRegistered` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_date`, `event_location`, `title`, `content`, `image`, `status`, `event_point`, `hasRegistered`) VALUES
(1, 'PARTY MUSIC', '2023-09-13', 'Sân vận động Quốc gia Mỹ Đình, Hà Nội, Việt Nam', '', '                      Woowa chính thức thông báo\n                      nhóm nhạc EXO, IVE, STAY C & ca sĩ Sơn Tùng MTP\n                      tại sự kiện Party Music diễn ra vào khoản thời gian sắp\n                      tới được tổ chức tại sân vận động quốc gia Mỹ Đình, Hà\n                      Nội vào ngày 20/9', '', 'Đang diễn ra', 1000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE `event_participants` (
  `participant_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reset_tokens`
--

CREATE TABLE `reset_tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reset_tokens`
--

INSERT INTO `reset_tokens` (`id`, `email`, `token`, `created_at`) VALUES
(10, 'hoangleduy27901@gmail.com', '4b2f5c6a286d9d7f3ae5eee0a0bd08832f8f906a', '2023-08-02 07:42:52'),
(12, 'hoangleduy27901@gmail.com', 'e4fb17b6e639a1684b4ce0e70111c295575405fa', '2023-08-02 07:53:22'),
(13, 'hoangleduy27901@gmail.com', '6f8f3ecf1f8da7b847faaae0f458d669448bb0df', '2023-08-02 07:55:14'),
(14, 'hoangleduy27901@gmail.com', '2ec92167cea7406e6de9d3a7295b4110e265055d', '2023-08-02 07:55:47'),
(15, 'hoangleduy27901@gmail.com', 'bce29cf42bfb8233194041d5a726e60abdc9184b', '2023-08-02 07:55:48'),
(16, 'hoangleduy27901@gmail.com', 'bcdd59a8873ad05139bd90405357788e636a6d6c', '2023-08-02 07:55:54'),
(17, 'hoangleduy27901@gmail.com', 'a0bc872dbb5d8d741e163c157e32fa6f245f9f80', '2023-08-02 07:56:43'),
(31, 'hoangleduy27901@gmail.com', 'bdd15132316ae7e9e5869265c80cefdcaa3e1ff7', '2023-08-02 08:42:30'),
(33, 'hoangleduy27901@gmail.com', '81098e56e657087f2002db534648f6e6a05c7e93', '2023-08-09 07:14:39'),
(34, 'hoangleduy27901@gmail.com', 'fdb2b4d6733c80b6c29ecafd017b0520da579aa5', '2023-08-09 07:15:35'),
(35, 'hoangleduy27901@gmail.com', '0de09c4d95b991ebc60b4fe7cd0675a4811e6459', '2023-08-09 07:22:43'),
(36, 'hoangleduy27901@gmail.com', 'a837c9d284605bdf3e1555f589169bb0f0da0c8c', '2023-08-09 07:23:54'),
(37, 'hoangleduy27901@gmail.com', 'c6309b063582752328558b85b2dbddce42efdec0', '2023-08-09 07:24:13'),
(38, 'hoangleduy27901@gmail.com', '0a54bc94055e7afd7fcd5b8a20b972865e48ea0b', '2023-08-09 07:25:48'),
(39, 'hoangleduy27901@gmail.com', 'f39e8bbc394958be60a0e682afc4d8cb869316ed', '2023-08-09 07:26:05'),
(40, 'hoangleduy27901@gmail.com', 'f06f2d4c9cc9e3fb6a4aa6bfb9efeb09930ba4c6', '2023-08-09 07:26:45'),
(41, 'hoangleduy27901@gmail.com', 'b9dc1e3f69b0dca34c56130ce734e72ec682e790', '2023-08-09 07:27:04'),
(42, 'hoangleduy27901@gmail.com', 'b53ee043ca5a0904cb5c4f81368010f50fd0dda7', '2023-08-09 07:28:43'),
(43, 'hoangleduy27901@gmail.com', 'e4010ac989df3e1f62b096c9980df2af3a877d30', '2023-08-09 07:29:40'),
(44, 'hoangleduy27901@gmail.com', '4225ae6ee82575278ae5d8d965b5c04b7ff17067', '2023-08-09 07:30:07'),
(45, 'hoangleduy27901@gmail.com', '12bca6de39ae5769776bf527ed8b8a5d803c424a', '2023-08-09 07:30:47'),
(46, 'hoangleduy27901@gmail.com', 'ef814f9cda5bb0b638b3f2c87990f9d6b93227c9', '2023-08-09 07:31:12'),
(48, 'hoangleduy27901@gmail.com', '2a5089513d7c71d85284d1c59a42081578d0330f', '2023-08-09 07:46:48'),
(49, 'hoangleduy27901@gmail.com', '51f8cadfef5502b1024394b1bf9623224a5a885e', '2023-08-09 07:53:28'),
(50, 'hoangleduy27901@gmail.com', 'b30999323344fdb75e5e13198e300aa199c26a0a', '2023-08-09 08:01:36'),
(51, 'hoangleduy27901@gmail.com', 'bb263f55ea070fa0aba38c7961ec5eed962182dd', '2023-08-09 08:01:38'),
(52, 'hoangleduy27901@gmail.com', '07aa604a74371a30eda45560433c001b9ebc30a3', '2023-08-09 08:03:23'),
(53, 'hoangleduy27901@gmail.com', 'eff952292f8beb94e2b1761f625c0fd823c4c3ce', '2023-08-09 08:04:29'),
(54, 'hoangleduy27901@gmail.com', '9a6d578245a792d647b4259312042a3b175565e6', '2023-08-09 08:05:14'),
(55, 'hoangleduy27901@gmail.com', '44a4aa499bff8648de7185d16797e2d554aea217', '2023-08-09 08:06:18'),
(56, 'hoangleduy27901@gmail.com', 'd8834a724a140273dc47786b5d2735e5cec71dc6', '2023-08-09 08:08:03'),
(57, 'hoangleduy27901@gmail.com', 'd86870c8324113d7fc537761dcc3c64f01da2e18', '2023-08-09 08:10:35'),
(58, 'hoangleduy27901@gmail.com', 'cac029825bc74ec99aa883e631842db091a50f16', '2023-08-09 08:14:52'),
(59, 'hoangleduy27901@gmail.com', '64152b3f37191fc1291e235cea6f7fbe4cf4e4af', '2023-08-09 08:32:26'),
(60, 'hoangleduy27901@gmail.com', '6e579173377b2faae7c7fb4690fe9bbee28ce0b1', '2023-08-09 08:34:31'),
(61, 'hoangleduy27901@gmail.com', '92e81a0f7b6d1b9de7a4996ab1c9ac15b52e5b25', '2023-08-09 08:36:40'),
(62, 'hoangleduy27901@gmail.com', '7a671d1e3eaf97dffe24a54b24188d412cca864d', '2023-08-09 08:38:17'),
(63, 'hoangleduy27901@gmail.com', '43f383a93d8474950cc6fd345dd18cecdb1b4758', '2023-08-09 08:42:04'),
(64, 'hoangleduy27901@gmail.com', '8807c7ce397a7744d2b1fb88687b2559788f5d6f', '2023-08-09 08:44:03');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `area` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `seat_number` varchar(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `user_id`, `area`, `seat_number`, `created_at`) VALUES
(94, 96, 'A', 'A01', '2023-08-15 08:15:04'),
(96, 71, 'A', 'A03', '2023-08-15 08:24:29'),
(97, 70, 'A', 'A04', '2023-08-15 08:26:47'),
(98, 90, 'A', 'A02', '2023-08-15 08:28:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `referral_code` varchar(6) NOT NULL,
  `phonenumber` varchar(13) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `birthday` date DEFAULT NULL,
  `user_point` decimal(10,2) NOT NULL DEFAULT 0.00,
  `referral_code_count` int(11) NOT NULL DEFAULT 0,
  `ticket` varchar(20) NOT NULL,
  `email_sent` tinyint(1) NOT NULL DEFAULT 0,
  `profile_image` mediumblob DEFAULT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `user_level` varchar(10) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `referral_code`, `phonenumber`, `status`, `birthday`, `user_point`, `referral_code_count`, `ticket`, `email_sent`, `profile_image`, `profile_image_path`, `gender`, `user_level`, `facebook_id`) VALUES
(70, 'hoang1@gmail.com', 'Duy', '$2b$10$SN19tUiyvb0K2RMwcfKoz.4cLxd.S.mIvn30bAjBAhupCajmmJ8G6', 'F4ZQVY', '0963124155', 1, NULL, 1500.00, 915, 'yes', 0, NULL, NULL, NULL, 'D', NULL),
(71, 'admin@gmail.com', 'admin', '$2b$10$ntcTfKzx3bbwFO/u6sa1PeE9YYpNzjzG2HqmVG.qtM2/sBh7zgXaW', 'R71KKY', '07845528241', 1, '2023-08-02', 10000.00, 0, 'yes', 1, NULL, NULL, '', NULL, NULL),
(72, 'minh1@gmail.com', 'acb', '$2b$10$4NeMz0JccU0vKjYh7UNRf.SzOMv7XT3xVdwiRhTyj5WV00Z2FJDyK', 'XUTOVF', '0919999999', 1, NULL, 1000.00, 1, '', 0, NULL, NULL, NULL, NULL, NULL),
(73, 'minh2@gmail.com', 'minh2@gmail.com', '$2b$10$zy6JH7/iyDyUao4Cb3A87eoQ4AuuDZyhJoUhk8j4AmWTgswVi1EOW', '1XPK4E', '0919999991', 1, NULL, 2611.00, 0, '', 0, NULL, NULL, NULL, NULL, NULL),
(75, 'hoang27@gmail.com', 'duydeptrai', '$2b$10$09c2WtaRZFmgDIX/GVoMHejYjE4mrXtz1ap3BVIVBIiSWn4wyxSzy', 'JQPIK2', '0985462157', 1, NULL, 6000.00, 1, 'yes', 1, NULL, NULL, NULL, NULL, NULL),
(79, 'hoang123213@gmail.com', 'Duy', '$2b$10$8uf032esurJ3SxeZw1c49OCLQfuWAMT2O72yUqenDBCXEtxE9PSwG', 'LI09OK', '0964254222', 1, NULL, 1500.00, 1, '', 0, NULL, NULL, NULL, NULL, NULL),
(80, 'hoang321321@gmail.com', 'Duy', '$2b$10$99wjSkA9.xAmpUNqdpaJ0uoM/a2bBZSumyUaJGAn3v6Qo1BKWWTvO', 'R1HGL7', '0963154611', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL, NULL),
(81, 'hoangaddg@gmail.com', 'duy123', '$2b$10$yKqqbjIsoVnaXtJJ6fJLdO1qDbTBn0pYVZs08ZrlvqhYdPtq.gLLy', 'HWLZX5', '0963963962', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL, NULL),
(90, 'hoangleduy27901@gmail.com', 'Hoàng Lê Duy', '$2b$10$J4bxlbEYsp6cVXmBxK8lfOEeG/ujWeYifiVhxoBxaxKdre7kQ.o1W', '14FXJ7', '+84387343389', 1, '2001-09-27', 40.00, 4054, 'yes', 0, NULL, '1691117743299-adidas.jpg', 'male', 'C', NULL),
(95, 'hlduydn01@gmail.com', 'Justin', '$2b$10$HW5U20I9vpcVCJLxYND7BuWka1wJBC9wNJqPES8l9X0CjZvtyiMSq', '6QMM9G', '+84387343389', 1, NULL, 0.00, 0, '', 0, NULL, NULL, NULL, NULL, NULL),
(96, 'hoang@gmail.com', 'Justin 2', '$2b$10$PyY13RHz3QGZDTKg0SgWTO2aAY5SIRjVUqyZwlHpS3HqrHFqF2Rxq', 'QBUGA0', '+84387343389', 1, NULL, 5.00, 700, 'yes', 0, NULL, NULL, NULL, NULL, NULL),
(99, '', 'Hoàng Lê Duy', '', '', NULL, 1, NULL, 0.00, 0, '', 0, NULL, NULL, NULL, NULL, '821428202656793');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indexes for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reset_tokens`
--
ALTER TABLE `reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT for table `reset_tokens`
--
ALTER TABLE `reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
