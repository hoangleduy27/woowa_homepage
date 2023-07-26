-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 26, 2023 at 12:42 PM
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
-- Table structure for table `users`
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
  `birthday` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password`, `referral_code`, `phonenumber`, `quyenhan`, `created_date`, `status`, `birthday`) VALUES
(1, 'user@1', 'user1', '$2b$10$PiManrFZSEWxTwosr8cxIuTg3VrwXn6/UiVFFy3HilJesyByYjXLS', '', '0', '', '2023-07-25 09:29:18', 1, '0000-00-00'),
(2, 'user@1', 'user12', '$2b$10$Vr.u1SgQicni3adsOz1MgeDf8pgEtBXGh2c8.JQUWM1CcqLIzXQg2', '', '0', '', '2023-07-25 11:59:59', 1, '0000-00-00'),
(3, 'user@12', 'user123', '$2b$10$rf3.ic4oHnJqNydY/VrSZO8XLCPoHnHuE1zKtUL.lcg.sKftcG9j2', '', '0', '', '2023-07-25 13:06:45', 1, '0000-00-00'),
(4, 'user@123', 'user123', '$2b$10$ImpIAJ2.FbnK/2eXdT6eKuZMVovJ4aTvR/CXaXF76Yt6Fwr94QTBe', '', '0', '', '2023-07-25 13:11:28', 1, '0000-00-00'),
(5, 'admin@1', 'admin', '$2b$10$dt.IPJZXGiIpEyfnYKYupu048i/qivCJfdL.lVoWpyI1sPoEBtYDS', '', '0', '', '2023-07-25 13:13:36', 1, '0000-00-00'),
(6, 'admin@12', 'admin', '$2b$10$ViaGNbgqm069vuBj2PEsD.uMccjSP55R3wSHHTGJouQpugK9idZ4W', 'QW3F2C', '0', '', '2023-07-25 13:15:39', 1, '0000-00-00'),
(7, 'admin@123', 'admin', '$2b$10$A.Qy7FkINNfmfD.BS3s/RO6N1SkIDEfYh.gz9ArsxCHPIE82TZ9jK', 'LY2K8B', '0', '', '2023-07-25 13:17:38', 1, '0000-00-00'),
(8, 'user@1234', 'user1', '$2b$10$REIC4IGQqY1ejwj6PLz/7u82YhhoHzXy7LQHtP3khIAxMpDCqjYTy', 'NOL6LF', '0', '', '2023-07-25 14:33:07', 1, '0000-00-00'),
(9, 'hoang@1', 'hoang', '$2b$10$0nEwvOcFoD18HmP2BUKVAu.45K..2QaGboe5z0cYnb4A8BqT3KjAq', 'APPUJL', '123456', '', '2023-07-25 14:34:06', 1, '0000-00-00'),
(10, 'user@1112', 'user5', '$2b$10$mBQhSttsvUKqbTwj.PRju.J80Dyl4u2TG1j8if8Kaz6pK1OYBiYd.', '0Z5YZH', '0', '', '2023-07-25 14:37:05', 1, '0000-00-00'),
(11, 'admin@1123', 'admin123', '$2b$10$BFLh2D1LaTzKT2kWIXwKGea9n/zLh7Ns3Jm3nbyoj1lbp3KPMOz3m', '4L6C5X', '0', '', '2023-07-25 14:39:03', 1, '0000-00-00'),
(12, 'user@12345', 'user1', '$2b$10$Im9idXpAjX.BFkbbudNNPOKrWSWKgmQN.M5dU6yLbO3LLIVWYjFr2', 'DU6IXI', '0', '', '2023-07-25 14:46:27', 1, '0000-00-00'),
(13, 'hoangleduy@1', 'hoangleduy279', '$2b$10$Gp3c9bs2XXFusfy3lr3UYOIOf6Yo6gfkiM4bVlgdTwbElaahqqrOy', 'ZVVT2B', '0', '', '2023-07-25 15:00:14', 1, '0000-00-00'),
(14, 'user@1321', 'user1', '$2b$10$LDsLg3yEsRB.rANTmkBuVe8vXQZDTxQERsP/Kyk3svVEmJqNaW85y', 'X5S17Z', '0', '', '2023-07-25 15:02:57', 1, '0000-00-00'),
(15, 'admin@11231', 'hoangleduy27901@gmail.com', '$2b$10$zPt/F1C/lTrjuVpu.e7bMOTqGjYHj8Ny.CYpN3BVSzABm37.Ncghm', 'MD0RTX', '0', '', '2023-07-25 15:12:02', 1, '0000-00-00'),
(16, 'admin@13123', 'user1', '$2b$10$ZBSog0z1mLCxUmwiAGTB4.ngrGOe7noQ3moAHJUlDIxmZB/YcaXHa', 'RZBDSG', '0', '', '2023-07-25 15:12:40', 1, '0000-00-00'),
(17, 'abc@gmail.com', 'user1', '$2b$10$TirIY8qdHR2p4ziD0P1r2OAE3F7uK.y00cGXAzwRAP0Be35oQZ81y', 'F0HUWO', '0', '', '2023-07-25 17:31:15', 1, '0000-00-00'),
(18, 'admin@27', 'admin27', '$2b$10$HSiFzgeOHER6gD2h0CYce.mY6Tur9zdMUfLnaTvTAY9.0C2KfCcvu', 'W1V1ZP', '0', '', '2023-07-25 17:51:47', 1, '0000-00-00'),
(19, 'admin@29', 'admin29', '$2b$10$PYpcHAPfiJCHkazXYnyo0e2CYRPDtsFxq1jrJG9bodlhPJ66bmPki', '196ZW7', NULL, '', '2023-07-25 17:54:58', 1, '0000-00-00'),
(20, 'admin@28', 'admin28', '$2b$10$4XUFnUhLVtiKPh.i/BaStePfsjIfZHqOqfEfCcZpgJBDjtkC6Srgy', 'RLADEL', '', '', '2023-07-25 17:55:55', 1, '0000-00-00'),
(21, 'abcd@1', 'abcd', '$2b$10$37CEVJLlHjcuH5bpsG0RYuMla6FC30Cf8oc6kAeqK22155ZuzQYLe', 'YZ1ZW7', '', '', '2023-07-26 09:33:45', 1, '0000-00-00'),
(22, 'abcd@12', 'abcd', '$2b$10$UwUHHCt/oj09kY9V9U2TpONyuGvcldaP5CNYeOstEoaOM3moWC3Bm', 'YXC43G', NULL, '', '2023-07-26 09:35:51', 1, NULL),
(23, 'user@a', 'user11111', '$2b$10$IZlm8DuqjYdC4pwIFZ5oN.rqjFoUstiv4A6Q7J9nDampItC4CMUXW', 'HH6FTM', NULL, '', '2023-07-26 09:39:19', 1, NULL),
(24, 'user@1999', 'user1', '$2b$10$rrRUBWdjtTpJ5qtLmB.bnOw7.haMhXfApLa9gwRkx8QGLUabKfGfO', 'QGN7DY', NULL, '', '2023-07-26 09:39:46', 1, NULL),
(25, 'user@1998', 'user1', '$2b$10$rLyIJ/Qi/JDu01e1hoZ1VeulUT1w8nFicEx7LtlmF1ZcAxadDECiq', '0ZJ6OO', '0944983770', '', '2023-07-26 09:41:14', 1, '2023-06-30'),
(26, 'user@1997', 'user1997', '$2b$10$iQtm5VGYrWSxlEn7vbuUt.wQOhnlJu86oaL.m10aQLlAiI0jKqHS.', 'HRVE0L', '123213123213', '', '2023-07-26 09:41:31', 1, '2023-06-28'),
(27, 'admin@1999', 'admin1999', '$2b$10$XaeDbszSIJOdp4aokEhOV.m/vCS6r01LsxNIeoSo8i382RhpAzuhW', 'FWBBDE', NULL, '', '2023-07-26 09:43:50', 1, NULL),
(28, 'admin@1998', 'admin', '$2b$10$SWLdYs7OYP9x6pKN3wdvr.pYwd0bEJUw7fnVCxRy8v6g7T.6Wg2cG', 'I4PCIF', NULL, '', '2023-07-26 09:45:43', 1, NULL),
(29, 'admin@1977', 'admin', '$2b$10$/x1ikgKE/PRvsC7CYrx6Pe.SidZy29R6.7AEtAkJIp25GlYfwtKqC', '49Q61L', NULL, '', '2023-07-26 09:47:59', 1, NULL),
(30, 'admin@133', 'admin', '$2b$10$508ZFK600sEp8FTD.1AZ2ua217ETpJxNlSdewhEPWpG9Kc9r4zgPq', '4L30BO', NULL, '', '2023-07-26 09:55:15', 1, NULL),
(31, 'hoang@1123', 'admin', '$2b$10$7ZHuW7A5baISJ4Ia9/DoCOiuF1pdafzF8NbiTHOyaZbYBHljSb4wq', 'FNOINE', NULL, '', '2023-07-26 09:56:57', 1, NULL),
(32, 'user@1789', 'user1', '$2b$10$hP6hWCylKXoDrvrT6QOiYuOmbQpv2YpvJ0tu0VAI98G1nuioOCCSa', 'WKYB9T', NULL, '', '2023-07-26 10:01:20', 1, NULL),
(33, 'user@1987', 'user1', '$2b$10$gC8uys0dw8JXnzQjTfAwSemHr2JPaMXl.iHkGkrZUXakfjBwGvW8.', 'VG0BTX', NULL, '', '2023-07-26 10:03:40', 1, NULL),
(34, 'hoang@1369', 'admin', '$2b$10$rzlgGstfgh/0zjS7zI3DEeWZ4.slMKUpb24G.c6nQlWruaA7cva82', 'QJ1MKP', '', '', '2023-07-26 10:06:49', 1, '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
