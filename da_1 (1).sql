-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 07, 2023 lúc 04:56 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `da_1`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
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
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_date`, `event_location`, `title`, `content`, `image`, `status`, `event_point`, `hasRegistered`) VALUES
(1, 'PARTY MUSIC', '2023-09-13', 'Sân vận động Quốc gia Mỹ Đình, Hà Nội, Việt Nam', '', '                      Woowa chính thức thông báo\n                      nhóm nhạc EXO, IVE, STAY C & ca sĩ Sơn Tùng MTP\n                      tại sự kiện Party Music diễn ra vào khoản thời gian sắp\n                      tới được tổ chức tại sân vận động quốc gia Mỹ Đình, Hà\n                      Nội vào ngày 20/9', '', 'Đang diễn ra', 1000.00, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_participants`
--

CREATE TABLE `event_participants` (
  `participant_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reset_tokens`
--

CREATE TABLE `reset_tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reset_tokens`
--

INSERT INTO `reset_tokens` (`id`, `email`, `token`, `created_at`) VALUES
(10, 'hoangleduy27901@gmail.com', '4b2f5c6a286d9d7f3ae5eee0a0bd08832f8f906a', '2023-08-02 07:42:52'),
(12, 'hoangleduy27901@gmail.com', 'e4fb17b6e639a1684b4ce0e70111c295575405fa', '2023-08-02 07:53:22'),
(13, 'hoangleduy27901@gmail.com', '6f8f3ecf1f8da7b847faaae0f458d669448bb0df', '2023-08-02 07:55:14'),
(14, 'hoangleduy27901@gmail.com', '2ec92167cea7406e6de9d3a7295b4110e265055d', '2023-08-02 07:55:47'),
(15, 'hoangleduy27901@gmail.com', 'bce29cf42bfb8233194041d5a726e60abdc9184b', '2023-08-02 07:55:48'),
(16, 'hoangleduy27901@gmail.com', 'bcdd59a8873ad05139bd90405357788e636a6d6c', '2023-08-02 07:55:54'),
(17, 'hoangleduy27901@gmail.com', 'a0bc872dbb5d8d741e163c157e32fa6f245f9f80', '2023-08-02 07:56:43'),
(31, 'hoangleduy27901@gmail.com', 'bdd15132316ae7e9e5869265c80cefdcaa3e1ff7', '2023-08-02 08:42:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `referral_code` varchar(6) NOT NULL,
  `phonenumber` varchar(13) DEFAULT NULL,
  `quyenhan` varchar(255) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `birthday` date DEFAULT NULL,
  `user_point` decimal(10,2) NOT NULL DEFAULT 0.00,
  `referral_code_count` int(11) NOT NULL DEFAULT 0,
  `ticket` varchar(20) NOT NULL,
  `email_sent` tinyint(1) NOT NULL DEFAULT 0,
  `profile_image` mediumblob DEFAULT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `user_level` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `referral_code`, `phonenumber`, `quyenhan`, `status`, `birthday`, `user_point`, `referral_code_count`, `ticket`, `email_sent`, `profile_image`, `profile_image_path`, `gender`, `user_level`) VALUES
(70, 'hoang1@gmail.com', 'Duy', '$2b$10$SN19tUiyvb0K2RMwcfKoz.4cLxd.S.mIvn30bAjBAhupCajmmJ8G6', 'F4ZQVY', '0963124155', '', 1, NULL, 1500.00, 10, '', 0, NULL, NULL, NULL, 'D'),
(71, 'admin@gmail.com', 'admin', '$2b$10$ntcTfKzx3bbwFO/u6sa1PeE9YYpNzjzG2HqmVG.qtM2/sBh7zgXaW', 'R71KKY', '07845528241', '', 1, NULL, 10000.00, 0, '', 1, NULL, NULL, NULL, NULL),
(72, 'minh1@gmail.com', 'acb', '$2b$10$4NeMz0JccU0vKjYh7UNRf.SzOMv7XT3xVdwiRhTyj5WV00Z2FJDyK', 'XUTOVF', '0919999999', '', 1, NULL, 1000.00, 1, '', 0, NULL, NULL, NULL, NULL),
(73, 'minh2@gmail.com', 'minh2@gmail.com', '$2b$10$zy6JH7/iyDyUao4Cb3A87eoQ4AuuDZyhJoUhk8j4AmWTgswVi1EOW', '1XPK4E', '0919999991', '', 1, NULL, 2611.00, 0, '', 0, NULL, NULL, NULL, NULL),
(75, 'hoang27@gmail.com', 'duydeptrai', '$2b$10$09c2WtaRZFmgDIX/GVoMHejYjE4mrXtz1ap3BVIVBIiSWn4wyxSzy', 'JQPIK2', '0985462157', '', 1, NULL, 6000.00, 1, 'yes', 1, NULL, NULL, NULL, NULL),
(79, 'hoang123213@gmail.com', 'Duy', '$2b$10$8uf032esurJ3SxeZw1c49OCLQfuWAMT2O72yUqenDBCXEtxE9PSwG', 'LI09OK', '0964254222', '', 1, NULL, 1500.00, 1, '', 0, NULL, NULL, NULL, NULL),
(80, 'hoang321321@gmail.com', 'Duy', '$2b$10$99wjSkA9.xAmpUNqdpaJ0uoM/a2bBZSumyUaJGAn3v6Qo1BKWWTvO', 'R1HGL7', '0963154611', '', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL),
(81, 'hoangaddg@gmail.com', 'duy123', '$2b$10$yKqqbjIsoVnaXtJJ6fJLdO1qDbTBn0pYVZs08ZrlvqhYdPtq.gLLy', 'HWLZX5', '0963963962', '', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL),
(90, 'hoangleduy27901@gmail.com', 'Hoàng Lê Duy', '$2b$10$y9D0V3reQDdLtpf5iDTCTeYTOyggSugVatAKqma.jKHhgz9EAUItK', '14FXJ7', '+84387343389', '', 1, '2001-09-27', 20.00, 11, '', 0, NULL, '1691117743299-adidas.jpg', 'male', 'D'),
(91, 'hoangleduy27901@gmail.com', 'Hoàng Lê Duy 2', '$2b$10$9/BPYQ7d9l0mL9P0dpFOLusXlDd0JtctKWu0W8FnP2uBitMIYs35e', 'EBYA4V', '+84387343389', '', 1, NULL, 5.00, 0, '', 0, NULL, NULL, NULL, NULL),
(92, 'hlduydn01@gmail.com', 'Justin', '$2b$10$zgeExMb77zxIDA3poAL64OAuLuCMYb0YQDcRx684RTTdwydPz.mtS', 'D2L390', '+84387343389', '', 1, NULL, 5.00, 0, '', 0, NULL, NULL, NULL, NULL),
(93, 'hlduydn01@gmail.com', 'Justin', '$2b$10$vJaorf75t3jzfGdPo/MKb.2uAJZzwXexIJ9dLUN6R77fpZxtDm1J6', 'NL1FQK', '+84387343389', '', 1, NULL, 0.00, 0, '', 0, NULL, NULL, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Chỉ mục cho bảng `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `reset_tokens`
--
ALTER TABLE `reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=224;

--
-- AUTO_INCREMENT cho bảng `reset_tokens`
--
ALTER TABLE `reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
