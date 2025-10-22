CREATE DATABASE  IF NOT EXISTS `kandypack` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `kandypack`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: kandypack
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('ADM001','administrator','$2a$12$gFwsvaeTP5HL2my9XyGgPufKz05lIsKLa96ye4PXRg6BP7xC/xl2W','2025-10-19 05:04:28');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assistant`
--

DROP TABLE IF EXISTS `assistant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assistant` (
  `assistant_id` varchar(40) NOT NULL,
  `name` varchar(120) NOT NULL,
  `address` text,
  `phone_no` varchar(20) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `must_change_password` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`assistant_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assistant`
--

LOCK TABLES `assistant` WRITE;
/*!40000 ALTER TABLE `assistant` DISABLE KEYS */;
INSERT INTO `assistant` VALUES ('AST001','Sarah Support','111 Support St, Colombo','+94770000003','sarah.support@kandypack.com','sarahs','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('AST002','David Logistics','222 Logistics Ave, Kandy','+94770000004','david.logistics@kandypack.com','david','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('AST003','Emma Helper','333 Helper Lane, Galle','+94770000007','emma.helper@kandypack.com','emma','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('AST004','Tom Assistant','444 Assist Road, Negombo','+94770000008','tom.assist@kandypack.com','tom','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('AST005','senura Sachintha','No,71,Andupelena','0715311839','dinukakavinda3557@gmail.com','senura','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('AST006','Lekshan','No,54,Andupelena','0715311839','dinukakavinda2003@gmail.com','lekshan','$2a$12$z.9dTT1uovfBFLmz4/VsseIsdZzeNSt/zKdiGiZcVx7sRMN3YMjnG',0);
/*!40000 ALTER TABLE `assistant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` varchar(40) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `city` varchar(80) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('CUS001','Dinuka Kavinda','0715311839','Galle','71,Galle Road,Galle','dinuka','$2a$12$mPF4y3PikJujDuGNurbRgusx6mElnf7eZNCxOPsHy9JC0/FLAYMw.','2025-10-18 12:20:06'),('CUS002','Senuth Methwan Abeywardana','0741550112','Delgoda','8/8','senuth','$2a$12$ryg1Yl8AGUcGfHNU5.x9.uUr4bw1FmUCiFdde2KRIlAL6UvJHz5IK','2025-10-19 17:07:58'),('CUS003','Abdul Rafi','0714523980','Matara','12/5, Train Rd, Matara','rafi','$2a$12$sXfUL.7hLb1.eQzX9pu1Uey1Lw8BO8sNNn.03sgjL1SCgVNo9RjM6','2025-10-20 18:32:12'),('CUS004','Thilokya Angeesa','0712345692','Delgoda','12/3, Udupila,Delgoda','thilokya','$2a$12$Te/h9ad59nrWKkLjqSz0oOxVHwcjMruGVO0XsUor083Mq81fyE0xm','2025-10-20 18:33:39'),('CUS005','Yasindu Dissanayake','0754123987','Kesbawa','34/5, Kasbawa','yasindu','$2a$12$bhJUhOZgRPRbPjQEUYIBzuud0.Vf20Q2..yQZxjobjO/MNt.Y.Uii','2025-10-20 18:36:57'),('CUS006','januda lelwala','0754123987','Kesbawa','34/5, Kasbawa','januda','$2a$12$VmLbcEcNULVZOkHrq6DLBuXDkKQcrjAr9P.xg1Y/zup.t.vNLNZ16','2025-10-21 06:56:29');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `driver`
--

DROP TABLE IF EXISTS `driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver` (
  `driver_id` varchar(40) NOT NULL,
  `name` varchar(120) NOT NULL,
  `address` text,
  `phone_no` varchar(20) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `must_change_password` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`driver_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `driver`
--

LOCK TABLES `driver` WRITE;
/*!40000 ALTER TABLE `driver` DISABLE KEYS */;
INSERT INTO `driver` VALUES ('DRV001','John Driver','123 Driver Street, Colombo','+94770000001','john.driver@kandypack.com','john','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV002','Jane Transport','456 Transport Ave, Kandy','+94770000002','jane.transport@kandypack.com','jane','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV003','Mike Wilson','789 Road Lane, Galle','+94770000005','mike.wilson@kandypack.com','mike','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV004','Sarah Johnson','321 Highway St, Negombo','+94770000006','sarah.j@kandypack.com','sarah','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV005','Dinuka Kavinda','No,71\nAndupelena','0715311839','dinukakavinda3557@gmail.com','dinuka','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV006','Senuth Abeywardana','No,67,Andupelena','0715311839','senuthabeywardana@gmail.com','senuth','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeSKyLT0jLXMzKdSBBBBfMvbW',1),('DRV007','Isuru Sampath','No,78,Andupelena','0715311839','dinukakavinda2003@gmail.com','isuru','$2a$12$0qzZAcw3htUCa64tiatiMef6.hg7ENMHXZ.lHnhmmLvfW3CNJfSk6',0),('DRV008','Yasindu Dissanayake','12/34, Kesbawa.','0703321478','yasindu0904@gmail.com','yasindu','$2a$12$13kEI3RgjCOLWjE3pOc0C.jsV6zeFfeo16WwwjvwSDVhfArJtpcBy',1),('DRV009','Kamal','145/23, Dehiwala.','0754123987','rafiabdul7128@gmail.com','kamal','$2a$12$LdTDfFmF/rZHtRp6bBFJ5uUUAxuMCpIif28y7o7eKylTH6QH44sw.',1),('DRV010','januda lelwala','145/23, Dehiwala.','0754123987','janudaxx@gmail.com','januda','$2a$12$0P.jOTrl8zTii0hzAKdBVO5xHrUiXw.bnm6XUKzzOZLz2Cd1jkAuG',0);
/*!40000 ALTER TABLE `driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `order_item_id` varchar(40) NOT NULL,
  `order_id` varchar(40) NOT NULL,
  `product_id` varchar(40) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `idx_order_item_order` (`order_id`),
  KEY `idx_order_item_product` (`product_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_item_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_item_chk_2` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES ('OI0001','ORD003','P030',1,350.00),('OI0002','ORD003','P014',1,50.00),('OI0003','ORD004','P030',1,350.00),('OI0004','ORD004','P014',1,50.00),('OI0005','ORD004','P018',1,550.00),('OI0006','ORD005','P030',1,350.00),('OI0007','ORD005','P029',1,280.00),('OI0008','ORD006','P029',1,280.00),('OI0009','ORD007','P030',1,350.00),('OI0010','ORD007','P018',1,550.00),('OI0011','ORD008','P008',1,180.00),('OI0012','ORD008','P014',1,50.00),('OI0013','ORD009','P030',1,350.00),('OI0014','ORD009','P018',2,550.00),('OI0015','ORD010','P016',95,280.00),('OI0016','ORD011','P029',91,280.00),('OI0017','ORD012','P016',10,280.00),('OI0018','ORD013','P010',12,650.00),('OI0019','ORD014','PROD032',10,150.00),('OI0020','ORD014','P030',15,350.00),('OI0021','ORD015','P029',10,280.00),('OI0022','ORD015','PROD033',12,100.00),('OI0023','ORD015','P001',7,600.00),('OI0024','ORD016','P029',10,280.00),('OI0025','ORD017','P029',10,280.00),('OI0026','ORD017','P006',12,950.00),('OI0027','ORD018','P026',50,240.00),('OI0028','ORD018','P016',10,280.00),('OI0029','ORD018','PROD033',50,100.00),('OI0030','ORD019','P029',10,280.00),('OI0031','ORD020','P030',20,350.00),('OI0032','ORD021','PROD032',3,150.00),('OI0033','ORD021','P029',1,280.00),('OI0034','ORD022','P029',10,280.00);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(40) NOT NULL,
  `customer_id` varchar(40) NOT NULL,
  `order_date` datetime NOT NULL,
  `destination_city` varchar(80) NOT NULL,
  `destination_address` varchar(255) NOT NULL,
  `status` enum('pending','confirmed','placed','scheduled','in_transit','delivered','cancelled') DEFAULT 'pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cancel_reason` varchar(255) DEFAULT NULL,
  `delivery_date` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_customer` (`customer_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_city` (`destination_city`),
  KEY `idx_orders_order_date` (`order_date`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('ORD001','CUS001','2025-10-19 05:55:29','Colombo','colombo 7,colombo,76543','pending','2025-10-19 05:55:29','2025-10-19 05:55:29',NULL,NULL),('ORD002','CUS001','2025-10-19 05:56:13','Colombo','colombo 7,colombo,76543','pending','2025-10-19 05:56:13','2025-10-19 05:56:13',NULL,NULL),('ORD003','CUS001','2025-10-19 06:00:54','Colombo','7,Colombo,34565','pending','2025-10-19 06:00:54','2025-10-19 06:00:54',NULL,NULL),('ORD004','CUS001','2025-10-19 06:05:04','colombo','7,colombo,675453','placed','2025-10-19 06:05:04','2025-10-21 00:18:08',NULL,NULL),('ORD005','CUS001','2025-10-19 06:08:18','Ranna','71,Ranna,82125','placed','2025-10-19 06:08:18','2025-10-20 13:01:57',NULL,NULL),('ORD006','CUS001','2025-10-19 06:15:33','Tangalle','ranna,Tangalle,54635','placed','2025-10-19 06:15:33','2025-10-20 11:35:54',NULL,NULL),('ORD007','CUS001','2025-10-19 08:01:47','Matara','Matara Road,Matar,65434','placed','2025-10-19 08:01:47','2025-10-20 08:01:09',NULL,NULL),('ORD008','CUS001','2025-10-19 09:01:46','Hambantota','str4,hambantota,56463','cancelled','2025-10-19 09:01:46','2025-10-19 10:16:24','Ordered by mistake',NULL),('ORD009','CUS001','2025-10-19 12:56:53','Gampaha','str2,gampaha,65754','placed','2025-10-19 12:56:53','2025-10-20 07:20:24',NULL,NULL),('ORD010','CUS001','2025-10-20 10:36:23','Katharagama','42/5, Sellakatharagama,Katharagama','scheduled','2025-10-20 10:36:23','2025-10-20 12:32:14',NULL,NULL),('ORD011','CUS002','2025-10-20 19:06:14','Kantale','45, Wewa rd, Kantale','scheduled','2025-10-20 19:06:14','2025-10-21 05:08:45',NULL,NULL),('ORD012','CUS002','2025-10-20 19:23:14','Muttur','12,Muttur,Jaffna','scheduled','2025-10-20 19:23:14','2025-10-20 23:10:42',NULL,NULL),('ORD013','CUS002','2025-10-20 23:25:00','Nilaveli','78/5, Nilaveli,Trincomalee','scheduled','2025-10-20 23:25:00','2025-10-20 23:26:10',NULL,'2025-10-28 00:00:00'),('ORD014','CUS001','2025-10-21 02:20:24','Talpe','65/C, Talpe, Galle','scheduled','2025-10-21 02:20:24','2025-10-21 03:11:25',NULL,'2025-10-28 00:00:00'),('ORD015','CUS002','2025-10-21 03:23:43','Karapitiya','12/7, Karapitiya, Matara','scheduled','2025-10-21 03:23:43','2025-10-21 03:24:49',NULL,'2025-10-29 00:00:00'),('ORD016','CUS001','2025-10-21 04:03:16','Koggala','12/Koggala','placed','2025-10-21 04:03:16','2025-10-21 05:05:09',NULL,'2025-10-29 00:00:00'),('ORD017','CUS003','2025-10-21 05:11:57','Kinniya','34/5,Kinniya,Jaffna','scheduled','2025-10-21 05:11:57','2025-10-21 05:13:10',NULL,'2025-10-29 00:00:00'),('ORD018','CUS001','2025-10-21 05:22:46','Matara','89/5, Matara','pending','2025-10-21 05:22:46','2025-10-21 05:22:46',NULL,'2025-10-29 00:00:00'),('ORD019','CUS001','2025-10-21 05:49:46','Matara','23/5, Matara','pending','2025-10-21 05:49:46','2025-10-21 05:49:46',NULL,'2025-10-28 00:00:00'),('ORD020','CUS001','2025-10-21 05:53:37','Galle','45/7, Galle','placed','2025-10-21 05:53:37','2025-10-21 07:01:41',NULL,'2025-10-29 00:00:00'),('ORD021','CUS006','2025-10-21 06:58:53','Gampaha','gampaha,gampaha,45678','cancelled','2025-10-21 06:58:53','2025-10-21 06:59:19','No longer need the items','2025-10-29 00:00:00'),('ORD022','CUS001','2025-10-21 07:02:50','Kinniya','23/5, Kinniya','scheduled','2025-10-21 07:02:50','2025-10-21 07:03:52',NULL,'2025-10-28 00:00:00');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` varchar(40) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `space_consumption` decimal(10,4) NOT NULL,
  `category` varchar(60) DEFAULT NULL,
  `available_quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`),
  CONSTRAINT `product_chk_1` CHECK ((`price` >= 0)),
  CONSTRAINT `product_chk_2` CHECK ((`space_consumption` > 0)),
  CONSTRAINT `product_chk_3` CHECK ((`available_quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('P001','Detergent Box','1kg box',600.00,0.5000,'FMCG',200),('P002','Shampoo Pack','500ml',450.00,0.2000,'FMCG',300),('P003','Soap Carton','20 bars',1200.00,1.0000,'FMCG',150),('P004','Rice Bag','5kg premium rice',1500.00,2.5000,'Food',100),('P005','Tea Pack','500g Ceylon tea',800.00,0.3000,'Food',250),('P006','Coffee Pack','250g instant coffee',950.00,0.2500,'Food',168),('P007','Sugar Bag','1kg white sugar',250.00,0.6000,'Food',500),('P008','Flour Bag','1kg wheat flour',180.00,0.6500,'Food',399),('P009','Milk Powder','400g tin',1100.00,0.3500,'Food',220),('P010','Coconut Oil','1L bottle',650.00,0.4500,'Food',150),('P011','Notebook Set','10 books',350.00,0.4000,'Stationery',300),('P012','Pen Pack','12 pens',120.00,0.1500,'Stationery',500),('P013','Pencil Set','24 pencils',180.00,0.2000,'Stationery',400),('P014','Eraser Pack','5 erasers',50.00,0.1000,'Stationery',597),('P015','Ruler Set','30cm rulers',75.00,0.1200,'Stationery',450),('P016','Battery Pack','AA 4 pack',280.00,0.1800,'Electronics',340),('P017','Light Bulb','LED 15W',320.00,0.2200,'Electronics',280),('P018','Extension Cord','3m cord',550.00,0.3500,'Electronics',196),('P019','Toothpaste','100g family pack',180.00,0.1600,'Personal Care',400),('P020','Toothbrush','Soft bristle',85.00,0.0800,'Personal Care',550),('P021','Face Wash','150ml tube',420.00,0.1900,'Personal Care',320),('P022','Hand Sanitizer','500ml bottle',380.00,0.2800,'Personal Care',290),('P023','Tissue Box','200 sheets',150.00,0.3200,'Household',450),('P024','Kitchen Towel','2 rolls',220.00,0.3800,'Household',380),('P025','Garbage Bags','30 pack',280.00,0.4200,'Household',340),('P026','Dishwashing Liquid','500ml',240.00,0.2600,'Household',360),('P027','Laundry Powder','1kg box',480.00,0.5500,'Household',260),('P028','Floor Cleaner','1L bottle',320.00,0.4800,'Household',300),('P029','Biscuit Pack','500g assorted',280.00,0.3300,'Snacks',337),('P030','Chocolate Bar','200g milk chocolate',350.00,0.1400,'Snacks',395),('PROD032','Biscuits','Munchee',150.00,0.2000,'Good',217),('PROD033','Bottles','Plastic',100.00,1.0000,'Goods',70);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store` (
  `store_id` varchar(40) NOT NULL,
  `name` varchar(120) NOT NULL,
  `city` varchar(80) NOT NULL,
  PRIMARY KEY (`store_id`),
  KEY `idx_store_city` (`city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES ('ST_ANU','KandyPack Anuradhapura Store','Anuradhapura'),('ST_BAT','KandyPack Batticaloa Branch','Batticaloa'),('ST_COL','KandyPack Colombo Hub','Colombo'),('ST_GAL','KandyPack Galle Branch','Galle'),('ST_JAF','KandyPack Jaffna Center','Jaffna'),('ST_KAN','KandyPack Kandy Store','Kandy'),('ST_KUR','KandyPack Kurunegala Hub','Kurunegala'),('ST_MAT','KandyPack Matara Store','Matara'),('ST_MTR','Matara Rail Depot','Matara'),('ST_NEG','KandyPack Negombo Hub','Negombo'),('ST_TRI','KandyPack Trincomalee Store','Trincomalee');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train`
--

DROP TABLE IF EXISTS `train`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train` (
  `train_id` varchar(40) NOT NULL,
  `capacity` decimal(12,4) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `route_id` varchar(40) DEFAULT NULL,
  `begin_time` time DEFAULT NULL,
  PRIMARY KEY (`train_id`),
  KEY `fk_train_route` (`route_id`),
  CONSTRAINT `fk_train_route` FOREIGN KEY (`route_id`) REFERENCES `train_route` (`route_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `train_chk_1` CHECK ((`capacity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train`
--

LOCK TABLES `train` WRITE;
/*!40000 ALTER TABLE `train` DISABLE KEYS */;
INSERT INTO `train` VALUES ('TRN001',500.0000,'UDARATA MANIKE','R001','21:07:00'),('TRN002',600.0000,'train1','R002','19:06:00'),('TRN003',750.0000,'train3','R003','20:07:00'),('TRN004',500.0000,'train4','R004','22:10:00'),('TRN005',600.0000,'train5','R005','21:08:00'),('TRN006',800.0000,'train6','R006','20:08:00'),('TRN007',700.0000,'Train7','R007','08:22:00'),('TRN008',750.0000,'Train8','R008','07:06:00');
/*!40000 ALTER TABLE `train` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train_route`
--

DROP TABLE IF EXISTS `train_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train_route` (
  `route_id` varchar(40) NOT NULL,
  `start_city` varchar(80) NOT NULL,
  `end_city` varchar(80) NOT NULL,
  `destinations` text,
  PRIMARY KEY (`route_id`),
  KEY `idx_train_route_end_city` (`end_city`),
  FULLTEXT KEY `ftx_train_route_destinations` (`destinations`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train_route`
--

LOCK TABLES `train_route` WRITE;
/*!40000 ALTER TABLE `train_route` DISABLE KEYS */;
INSERT INTO `train_route` VALUES ('R001','kandy','colombo','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Mirigama, Veyangoda, Gampaha, Ragama, Kelaniya, Maradana'),('R002','kandy','negombo','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Mirigama, Veyangoda, Gampaha, Ragama, Ja-Ela, Seeduwa, Katunayake'),('R003','kandy','galle','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Mirigama, Veyangoda, Gampaha, Ragama, Colombo Fort, Dehiwala, Mount Lavinia, Moratuwa, Panadura, Kalutara South, Aluthgama, Bentota, Hikkaduwa'),('R004','kandy','matara','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Mirigama, Veyangoda, Gampaha, Ragama, Colombo Fort, Dehiwala, Mount Lavinia, Moratuwa, Panadura, Kalutara South, Aluthgama, Bentota, Hikkaduwa, Galle, Weligama'),('R005','kandy','Jaffna','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Kurunegala, Maho, Galgamuwa, Anuradhapura, Medawachchiya, Vavuniya, Kilinochchi'),('R006','kandy','trincomalee','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Kurunegala, Maho, Kekirawa, Habarana, Kantale, China Bay'),('R007','kandy','anuradhapura','Peradeniya, Kadugannawa, Rambukkana, Polgahawela, Kurunegala, Maho, Galgamuwa, anuradhapura'),('R008','Kandy','Badulla','Peradeniya Junction, Gelioya, Gampola, Ulapane, Nawalapitiya, Inguru Oya, Galboda, Watawala, Rozella, Hatton, Kotagala, Talawakele, Watagoda, Great Western, Radella, Nanu Oya, Ambewela, Pattipola, Ohiya, Idalgashinna, Haputale, Diyatalawa, Bandarawela, Kithal Ella, Ella, Demodara, Hali Ela, Badulla');
/*!40000 ALTER TABLE `train_route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train_shipment`
--

DROP TABLE IF EXISTS `train_shipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train_shipment` (
  `shipment_id` varchar(40) NOT NULL,
  `order_id` varchar(40) NOT NULL,
  `trip_id` varchar(40) NOT NULL,
  `allocated_space` decimal(12,4) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`shipment_id`),
  KEY `idx_train_shipment_order` (`order_id`),
  KEY `idx_train_shipment_trip` (`trip_id`),
  KEY `idx_ts_order_trip` (`order_id`,`trip_id`),
  CONSTRAINT `fk_ts_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_trip` FOREIGN KEY (`trip_id`) REFERENCES `train_trip` (`trip_id`) ON DELETE CASCADE,
  CONSTRAINT `train_shipment_chk_1` CHECK ((`allocated_space` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train_shipment`
--

LOCK TABLES `train_shipment` WRITE;
/*!40000 ALTER TABLE `train_shipment` DISABLE KEYS */;
/*!40000 ALTER TABLE `train_shipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `train_trip`
--

DROP TABLE IF EXISTS `train_trip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `train_trip` (
  `trip_id` varchar(40) NOT NULL,
  `route_id` varchar(40) NOT NULL,
  `train_id` varchar(40) NOT NULL,
  `depart_time` datetime NOT NULL,
  `arrive_time` datetime NOT NULL,
  `capacity` decimal(12,4) NOT NULL,
  `capacity_used` decimal(12,4) NOT NULL DEFAULT '0.0000',
  `store_id` varchar(40) NOT NULL,
  PRIMARY KEY (`trip_id`),
  KEY `fk_tt_train` (`train_id`),
  KEY `fk_tt_store` (`store_id`),
  KEY `idx_train_trip_times` (`depart_time`,`arrive_time`),
  KEY `idx_train_trip_route` (`route_id`),
  KEY `idx_train_trip_store_capacity` (`store_id`,`route_id`,`depart_time`,`capacity`,`capacity_used`),
  CONSTRAINT `fk_tt_route` FOREIGN KEY (`route_id`) REFERENCES `train_route` (`route_id`),
  CONSTRAINT `fk_tt_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`),
  CONSTRAINT `fk_tt_train` FOREIGN KEY (`train_id`) REFERENCES `train` (`train_id`),
  CONSTRAINT `chk_tt_time` CHECK ((`arrive_time` > `depart_time`)),
  CONSTRAINT `train_trip_chk_1` CHECK ((`capacity` > 0)),
  CONSTRAINT `train_trip_chk_2` CHECK ((`capacity_used` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `train_trip`
--

LOCK TABLES `train_trip` WRITE;
/*!40000 ALTER TABLE `train_trip` DISABLE KEYS */;
INSERT INTO `train_trip` VALUES ('TT0001','R001','TRN001','2025-10-20 07:20:24','2025-10-20 13:20:24',500.0000,1.4300,'ST_COL'),('TT0002','R004','TRN004','2025-10-20 08:01:09','2025-10-20 14:01:09',500.0000,81.5900,'ST_MAT'),('TT0003','R006','TRN006','2025-10-20 19:23:50','2025-10-21 01:23:50',800.0000,50.4300,'ST_TRI');
/*!40000 ALTER TABLE `train_trip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `truck`
--

DROP TABLE IF EXISTS `truck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `truck` (
  `truck_id` varchar(40) NOT NULL,
  `license_plate` varchar(40) NOT NULL,
  `capacity` decimal(12,4) NOT NULL,
  PRIMARY KEY (`truck_id`),
  UNIQUE KEY `license_plate` (`license_plate`),
  CONSTRAINT `truck_chk_1` CHECK ((`capacity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `truck`
--

LOCK TABLES `truck` WRITE;
/*!40000 ALTER TABLE `truck` DISABLE KEYS */;
INSERT INTO `truck` VALUES ('TK01','WP-1234',60.0000),('TK02','WP-5678',60.0000),('TK03','WP-9012',80.0000),('TK04','CP-3457',70.0000),('TK05','KY-7890',65.0000),('TRK006','WP-7864',75.0000),('TRK007','WP - 6812',100.0000);
/*!40000 ALTER TABLE `truck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `truck_delivery`
--

DROP TABLE IF EXISTS `truck_delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `truck_delivery` (
  `delivery_id` varchar(40) NOT NULL,
  `truck_schedule_id` varchar(40) NOT NULL,
  `order_id` varchar(40) NOT NULL,
  `delivered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  KEY `fk_td_ts` (`truck_schedule_id`),
  KEY `idx_truck_delivery_order` (`order_id`),
  CONSTRAINT `fk_td_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_td_ts` FOREIGN KEY (`truck_schedule_id`) REFERENCES `truck_schedule` (`truck_schedule_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `truck_delivery`
--

LOCK TABLES `truck_delivery` WRITE;
/*!40000 ALTER TABLE `truck_delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `truck_delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `truck_route`
--

DROP TABLE IF EXISTS `truck_route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `truck_route` (
  `route_id` varchar(40) NOT NULL,
  `store_id` varchar(40) NOT NULL,
  `route_name` varchar(120) NOT NULL,
  `max_minutes` int NOT NULL DEFAULT '240',
  PRIMARY KEY (`route_id`),
  KEY `idx_truck_route_store` (`store_id`),
  CONSTRAINT `fk_tr_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`),
  CONSTRAINT `truck_route_chk_1` CHECK ((`max_minutes` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `truck_route`
--

LOCK TABLES `truck_route` WRITE;
/*!40000 ALTER TABLE `truck_route` DISABLE KEYS */;
INSERT INTO `truck_route` VALUES ('TR_COL_NEGOMBO','ST_COL','Colombo -> Negombo, Katunayake',90),('TR_GAL_COAST','ST_GAL','Galle -> Hikkaduwa, Ambalangoda, Unawatuna, Ahangama, Koggala, Habaraduwa, Baddegama, Batapola, Karapitiya, Talpe',120),('TR_GAL_HIK','ST_GAL','Galle -> Hikkaduwa, Unawatuna',60),('TR_JAF_PENINSULA','ST_JAF','Jaffna -> Nallur, Chavakachcheri, Point Pedro, Karainagar, Kayts, Chunnakam, Tellippalai, Kopay, Valvettithurai, Velanai',180),('TR_MTR_KATAR','ST_MTR','Matara -> Kataragama, Katharagama, Tangalle, Tissamaharama, Hambantota',150),('TR_NEG_PUTTALAM','ST_NEG','Negombo -> Katunayake, Seeduwa, Minuwangoda, Divulapitiya, Kochchikade, Wennappuwa, Nattandiya, Chilaw, Dankotuwa',120),('TR_TRI_EAST','ST_TRI','Trincomalee -> China Bay, Kinniya, Nilaveli, Uppuveli, Kuchchaveli, Kantale, Muttur, Kumburupiddy, Thambalagamuwa',180);
/*!40000 ALTER TABLE `truck_route` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `truck_schedule`
--

DROP TABLE IF EXISTS `truck_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `truck_schedule` (
  `truck_schedule_id` varchar(40) NOT NULL,
  `route_id` varchar(40) NOT NULL,
  `truck_id` varchar(40) NOT NULL,
  `driver_id` varchar(40) NOT NULL,
  `assistant_id` varchar(40) NOT NULL,
  `order_id` varchar(40) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  PRIMARY KEY (`truck_schedule_id`),
  KEY `fk_ts_route` (`route_id`),
  KEY `idx_truck_schedule_time` (`start_time`,`end_time`),
  KEY `idx_truck_schedule_truck` (`truck_id`),
  KEY `idx_truck_schedule_driver` (`driver_id`),
  KEY `idx_truck_schedule_assistant` (`assistant_id`),
  KEY `idx_ts_driver_time` (`driver_id`,`start_time`,`end_time`),
  KEY `idx_ts_assistant_time` (`assistant_id`,`start_time`,`end_time`),
  KEY `idx_ts_truck_time` (`truck_id`,`start_time`,`end_time`),
  CONSTRAINT `fk_ts_assistant` FOREIGN KEY (`assistant_id`) REFERENCES `assistant` (`assistant_id`),
  CONSTRAINT `fk_ts_driver` FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`),
  CONSTRAINT `fk_ts_route` FOREIGN KEY (`route_id`) REFERENCES `truck_route` (`route_id`),
  CONSTRAINT `fk_ts_truck` FOREIGN KEY (`truck_id`) REFERENCES `truck` (`truck_id`),
  CONSTRAINT `chk_ts_time` CHECK ((`end_time` > `start_time`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `truck_schedule`
--

LOCK TABLES `truck_schedule` WRITE;
/*!40000 ALTER TABLE `truck_schedule` DISABLE KEYS */;
INSERT INTO `truck_schedule` VALUES ('TS001','TR_MTR_KATAR','TK01','DRV005','AST002',NULL,'2025-10-20 12:32:00','2025-10-20 15:02:00'),('TS002','TR_MTR_KATAR','TK01','DRV001','AST001',NULL,'2025-10-20 18:51:00','2025-10-20 21:21:00'),('TS003','TR_TRI_EAST','TK02','DRV003','AST006','ORD012','2025-10-20 23:10:00','2025-10-21 02:10:00'),('TS004','TR_TRI_EAST','TK01','DRV007','AST002','ORD013','2025-10-20 23:25:00','2025-10-21 02:25:00'),('TS005','TR_MTR_KATAR','TK03','DRV006','AST001',NULL,'2025-10-21 00:08:00','2025-10-21 02:38:00'),('TS006','TR_GAL_COAST','TK04','DRV007','AST002','ORD014','2025-10-21 03:11:00','2025-10-21 05:11:00'),('TS007','TR_GAL_COAST','TK01','DRV002','AST006','ORD015','2025-10-21 03:24:00','2025-10-21 05:24:00'),('TS008','TR_TRI_EAST','TK03','DRV005','AST003','ORD011','2025-10-21 05:08:00','2025-10-21 08:08:00'),('TS009','TR_TRI_EAST','TK04','DRV007','AST001','ORD017','2025-10-21 05:12:00','2025-10-21 08:12:00'),('TS010','TR_TRI_EAST','TK01','DRV009','AST006','ORD022','2025-10-21 07:03:00','2025-10-21 10:03:00');
/*!40000 ALTER TABLE `truck_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_order_totals`
--

DROP TABLE IF EXISTS `v_order_totals`;
/*!50001 DROP VIEW IF EXISTS `v_order_totals`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_order_totals` AS SELECT 
 1 AS `order_id`,
 1 AS `order_amount`,
 1 AS `required_space`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_quarter_top_items`
--

DROP TABLE IF EXISTS `v_quarter_top_items`;
/*!50001 DROP VIEW IF EXISTS `v_quarter_top_items`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_quarter_top_items` AS SELECT 
 1 AS `year`,
 1 AS `quarter`,
 1 AS `product_id`,
 1 AS `product_name`,
 1 AS `total_qty`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_quarterly_sales`
--

DROP TABLE IF EXISTS `v_quarterly_sales`;
/*!50001 DROP VIEW IF EXISTS `v_quarterly_sales`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_quarterly_sales` AS SELECT 
 1 AS `quarter`,
 1 AS `total_value`,
 1 AS `total_space_units`,
 1 AS `orders`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_truck_usage`
--

DROP TABLE IF EXISTS `v_truck_usage`;
/*!50001 DROP VIEW IF EXISTS `v_truck_usage`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_truck_usage` AS SELECT 
 1 AS `truck_id`,
 1 AS `month`,
 1 AS `runs`,
 1 AS `hours`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_worker_hours`
--

DROP TABLE IF EXISTS `v_worker_hours`;
/*!50001 DROP VIEW IF EXISTS `v_worker_hours`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_worker_hours` AS SELECT 
 1 AS `role`,
 1 AS `worker_id`,
 1 AS `week`,
 1 AS `hours`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_order_totals`
--

/*!50001 DROP VIEW IF EXISTS `v_order_totals`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_order_totals` AS select `oi`.`order_id` AS `order_id`,sum((`oi`.`quantity` * `oi`.`unit_price`)) AS `order_amount`,sum((`oi`.`quantity` * `p`.`space_consumption`)) AS `required_space` from (`order_item` `oi` join `product` `p` on((`p`.`product_id` = `oi`.`product_id`))) group by `oi`.`order_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_quarter_top_items`
--

/*!50001 DROP VIEW IF EXISTS `v_quarter_top_items`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_quarter_top_items` AS select year(`o`.`order_date`) AS `year`,quarter(`o`.`order_date`) AS `quarter`,`oi`.`product_id` AS `product_id`,`p`.`name` AS `product_name`,sum(`oi`.`quantity`) AS `total_qty` from ((`order_item` `oi` join `orders` `o` on((`o`.`order_id` = `oi`.`order_id`))) join `product` `p` on((`p`.`product_id` = `oi`.`product_id`))) group by year(`o`.`order_date`),quarter(`o`.`order_date`),`oi`.`product_id`,`p`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_quarterly_sales`
--

/*!50001 DROP VIEW IF EXISTS `v_quarterly_sales`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_quarterly_sales` AS select concat(year(`o`.`order_date`),'-Q',quarter(`o`.`order_date`)) AS `quarter`,sum(`v`.`order_amount`) AS `total_value`,sum(`v`.`required_space`) AS `total_space_units`,count(distinct `o`.`order_id`) AS `orders` from (`orders` `o` join `v_order_totals` `v` on((`v`.`order_id` = `o`.`order_id`))) group by year(`o`.`order_date`),quarter(`o`.`order_date`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_truck_usage`
--

/*!50001 DROP VIEW IF EXISTS `v_truck_usage`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_truck_usage` AS select `s`.`truck_id` AS `truck_id`,date_format(`s`.`start_time`,'%Y-%m') AS `month`,count(0) AS `runs`,(sum(timestampdiff(MINUTE,`s`.`start_time`,`s`.`end_time`)) / 60) AS `hours` from `truck_schedule` `s` group by `s`.`truck_id`,`month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_worker_hours`
--

/*!50001 DROP VIEW IF EXISTS `v_worker_hours`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_worker_hours` AS select 'driver' AS `role`,`s`.`driver_id` AS `worker_id`,date_format(`s`.`start_time`,'%x-%v') AS `week`,(sum(timestampdiff(MINUTE,`s`.`start_time`,`s`.`end_time`)) / 60) AS `hours` from `truck_schedule` `s` group by `s`.`driver_id`,date_format(`s`.`start_time`,'%x-%v') union all select 'assistant' AS `role`,`s`.`assistant_id` AS `worker_id`,date_format(`s`.`start_time`,'%x-%v') AS `week`,(sum(timestampdiff(MINUTE,`s`.`start_time`,`s`.`end_time`)) / 60) AS `hours` from `truck_schedule` `s` group by `s`.`assistant_id`,date_format(`s`.`start_time`,'%x-%v') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-23  0:07:20
