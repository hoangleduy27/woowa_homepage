-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 10, 2023 lúc 06:07 AM
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
(70, 'hoang1@gmail.com', 'Duy', '$2b$10$SN19tUiyvb0K2RMwcfKoz.4cLxd.S.mIvn30bAjBAhupCajmmJ8G6', 'F4ZQVY', '0963124155', '', 1, NULL, 1500.00, 11, '', 0, NULL, NULL, NULL, 'D'),
(71, 'admin@gmail.com', 'admin', '$2b$10$ntcTfKzx3bbwFO/u6sa1PeE9YYpNzjzG2HqmVG.qtM2/sBh7zgXaW', 'R71KKY', '07845528241', '', 1, NULL, 10000.00, 0, '', 1, NULL, NULL, NULL, NULL),
(72, 'minh1@gmail.com', 'acb', '$2b$10$4NeMz0JccU0vKjYh7UNRf.SzOMv7XT3xVdwiRhTyj5WV00Z2FJDyK', 'XUTOVF', '0919999999', '', 1, NULL, 1000.00, 1, '', 0, NULL, NULL, NULL, NULL),
(73, 'minh2@gmail.com', 'minh2@gmail.com', '$2b$10$zy6JH7/iyDyUao4Cb3A87eoQ4AuuDZyhJoUhk8j4AmWTgswVi1EOW', '1XPK4E', '0919999991', '', 1, NULL, 2611.00, 0, '', 0, NULL, NULL, NULL, NULL),
(75, 'hoang27@gmail.com', 'duydeptrai', '$2b$10$09c2WtaRZFmgDIX/GVoMHejYjE4mrXtz1ap3BVIVBIiSWn4wyxSzy', 'JQPIK2', '0985462157', '', 1, NULL, 6000.00, 1, 'yes', 1, NULL, NULL, NULL, NULL),
(79, 'hoang123213@gmail.com', 'Duy', '$2b$10$8uf032esurJ3SxeZw1c49OCLQfuWAMT2O72yUqenDBCXEtxE9PSwG', 'LI09OK', '0964254222', '', 1, NULL, 1500.00, 1, '', 0, NULL, NULL, NULL, NULL),
(80, 'hoang321321@gmail.com', 'Duy', '$2b$10$99wjSkA9.xAmpUNqdpaJ0uoM/a2bBZSumyUaJGAn3v6Qo1BKWWTvO', 'R1HGL7', '0963154611', '', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL),
(81, 'hoangaddg@gmail.com', 'duy123', '$2b$10$yKqqbjIsoVnaXtJJ6fJLdO1qDbTBn0pYVZs08ZrlvqhYdPtq.gLLy', 'HWLZX5', '0963963962', '', 1, NULL, 500.00, 0, '', 0, NULL, NULL, NULL, NULL),
(90, 'hoangleduy27901@gmail.com', 'Hoàng Lê Duy', '$2b$10$J4bxlbEYsp6cVXmBxK8lfOEeG/ujWeYifiVhxoBxaxKdre7kQ.o1W', '14FXJ7', '+84387343389', '', 1, '2001-09-27', 40.00, 9, '', 0, NULL, '1691117743299-adidas.jpg', 'male', NULL),
(95, 'hlduydn01@gmail.com', 'Justin', '$2b$10$HW5U20I9vpcVCJLxYND7BuWka1wJBC9wNJqPES8l9X0CjZvtyiMSq', '6QMM9G', '+84387343389', '', 1, NULL, 0.00, 0, '', 0, NULL, NULL, NULL, NULL),
(96, 'hoang@gmail.com', 'Justin 2', '$2b$10$PyY13RHz3QGZDTKg0SgWTO2aAY5SIRjVUqyZwlHpS3HqrHFqF2Rxq', 'QBUGA0', '+84387343389', '', 1, NULL, 5.00, 0, '', 0, NULL, NULL, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
