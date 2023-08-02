-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 02, 2023 lúc 05:05 AM
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
(1, 'Blackpink', '2023-09-13', 'Sân vận động Quốc gia Mỹ Đình, Hà Nội, Việt Nam', '', 'YG Entertainment chính thức thông báo điểm đến tiếp theo trong tour diễn vòng quanh thế giới Born Pink của nhóm nhạc BLACKPINK chính là sân vận động quốc gia Mỹ Đình, Hà Nội vào hai ngày 29 và 30/7', '', 'Đang diễn ra', 1000.00, 1);

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
  `created_date` datetime DEFAULT current_timestamp(),
  `status` tinyint(1) DEFAULT 1,
  `birthday` date DEFAULT NULL,
  `user_point` decimal(10,2) NOT NULL DEFAULT 0.00,
  `referral_code_count` int(11) NOT NULL DEFAULT 0,
  `ticket` varchar(20) NOT NULL,
  `email_sent` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `referral_code`, `phonenumber`, `quyenhan`, `created_date`, `status`, `birthday`, `user_point`, `referral_code_count`, `ticket`, `email_sent`) VALUES
(69, 'hoang@gmail.com', 'Duy', '$2b$10$JChq79QllRb/Sc9gu.6vbeM4BTALDq7cjDJmJmES1oNIv1NSSGpn2', 'B6RA7T', '0963963963', '', '2023-07-31 10:36:04', 1, NULL, 6000.00, 13, 'yes', 1),
(70, 'hoang1@gmail.com', 'Duy', '$2b$10$SN19tUiyvb0K2RMwcfKoz.4cLxd.S.mIvn30bAjBAhupCajmmJ8G6', 'F4ZQVY', '0963124155', '', '2023-07-31 10:36:54', 1, NULL, 500.00, 9, '', 0),
(71, 'admin@gmail.com', 'admin', '$2b$10$ntcTfKzx3bbwFO/u6sa1PeE9YYpNzjzG2HqmVG.qtM2/sBh7zgXaW', 'R71KKY', '07845528241', '', '2023-07-31 10:37:25', 1, NULL, 10000.00, 0, '', 1),
(72, 'minh1@gmail.com', 'acb', '$2b$10$4NeMz0JccU0vKjYh7UNRf.SzOMv7XT3xVdwiRhTyj5WV00Z2FJDyK', 'XUTOVF', '0919999999', '', '2023-07-31 13:42:32', 1, NULL, 1000.00, 1, '', 0),
(73, 'minh2@gmail.com', 'minh2@gmail.com', '$2b$10$zy6JH7/iyDyUao4Cb3A87eoQ4AuuDZyhJoUhk8j4AmWTgswVi1EOW', '1XPK4E', '0919999991', '', '2023-07-31 13:45:03', 1, NULL, 2611.00, 0, '', 0),
(74, 'duydzai000@gmail.com', 'Duy', '$2b$10$aohN6RRI3LNuExMNsPXzM.5LcJ/UibEr3Zdt9FgDkEoPT/bMMM1ZC', '1C4YZL', '09852135465', '', '2023-07-31 15:37:54', 1, NULL, 30000.00, 0, 'yes', 1),
(75, 'hoang27@gmail.com', 'duydeptrai', '$2b$10$09c2WtaRZFmgDIX/GVoMHejYjE4mrXtz1ap3BVIVBIiSWn4wyxSzy', 'JQPIK2', '0985462157', '', '2023-07-31 17:38:49', 1, NULL, 6000.00, 1, 'yes', 1),
(76, 'hoangleduy27901@gmail.com', 'Duy279', '$2b$10$9p2LZeWhxXcePp5Ov2cJxuQbiwVsG.ZuNbF9bXCsIqBnwg4J6VMEW', '9SZFUM', '0963154612', '', '2023-07-31 17:45:23', 1, NULL, 9994999.00, 9, '', 0),
(79, 'hoang123213@gmail.com', 'Duy', '$2b$10$8uf032esurJ3SxeZw1c49OCLQfuWAMT2O72yUqenDBCXEtxE9PSwG', 'LI09OK', '0964254222', '', '2023-08-01 13:52:43', 1, NULL, 1500.00, 1, '', 0),
(80, 'hoang321321@gmail.com', 'Duy', '$2b$10$99wjSkA9.xAmpUNqdpaJ0uoM/a2bBZSumyUaJGAn3v6Qo1BKWWTvO', 'R1HGL7', '0963154611', '', '2023-08-01 13:53:30', 1, NULL, 500.00, 0, '', 0),
(81, 'hoangaddg@gmail.com', 'duy123', '$2b$10$yKqqbjIsoVnaXtJJ6fJLdO1qDbTBn0pYVZs08ZrlvqhYdPtq.gLLy', 'HWLZX5', '0963963962', '', '2023-08-01 13:55:12', 1, NULL, 500.00, 0, '', 0),
(86, 'hoangkkkk@gmail.com', 'Duy', '$2b$10$Mh6nkzuGMjTbfc/x.j8aAuUaQTBbLg/IhNlaNIcN4i0tg.1jwtF2e', '2V9HPB', '+84387343389', '', '2023-08-01 15:13:20', 1, NULL, 0.00, 0, '', 0);

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
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

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
