-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : sam. 17 mai 2025 à 14:56
-- Version du serveur : 10.11.6-MariaDB-0+deb12u1
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `choisirpdm`
--

-- --------------------------------------------------------

--
-- Structure de la table `cath`
--

CREATE TABLE `cath` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `libelle` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cath`
--

INSERT INTO `cath` (`id`, `libelle`) VALUES
(0, 'Non classé'),
(1, 'Couverture'),
(2, 'Enduits – Revêtements'),
(3, 'Fluide'),
(4, 'Fondations'),
(5, 'Humidité'),
(6, 'Isolants d\'origines animale ou végétale'),
(7, 'Isolants issus du recyclage'),
(8, 'Isolants minéraux'),
(9, 'Isolants synthétiques'),
(10, 'Menuiserie'),
(11, 'Structure'),
(12, 'Bois');

-- --------------------------------------------------------

--
-- Structure de la table `materiaux`
--

CREATE TABLE `materiaux` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 3 COMMENT '0 = Spam\r\n1 = Désactivé\r\n3 = En attente de modération\r\n5 = visible',
  `libelle` varchar(255) NOT NULL,
  `cath_id` int(20) NOT NULL DEFAULT 0,
  `generique` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Générique / produit commercial',
  `lambda` varchar(255) DEFAULT NULL COMMENT 'conductivité thermique λ (W/m.K)',
  `p` varchar(255) DEFAULT NULL COMMENT 'masse volumique ρ (kg/m3)',
  `c` varchar(255) DEFAULT NULL COMMENT 'capacité thermique massique Cp (kJ/kg.°C)',
  `u` varchar(255) NOT NULL COMMENT 'résistance diffusion de la vapeur d’eau μ (-)',
  `h` varchar(255) DEFAULT NULL COMMENT 'Déphasage (h – pour 20cm)',
  `source_libelle` varchar(255) NOT NULL,
  `source_link` varchar(255) DEFAULT NULL,
  `contrib` varchar(255) NOT NULL,
  `lastupdate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `materiaux`
--

INSERT INTO `materiaux` (`id`, `status`, `libelle`, `cath_id`, `generique`, `lambda`, `p`, `c`, `u`, `h`, `source_libelle`, `source_link`, `contrib`, `lastupdate`) VALUES
(1, 5, 'Ardoise', 1, 1, '2', '2750', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(2, 5, 'Chaux', 2, 1, '0.12', '800', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(3, 5, 'Chaux-chanvre', 2, 1, '0.12', '400', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(4, 5, 'Pisé', 2, 1, '1.1', '1900', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(5, 5, 'Plâtre', 2, 1, '0.325', '715.38', '', '1', '', 'Placo', '', '', '2023-10-15 13:25:34'),
(6, 5, 'Sable', 2, 1, '', '1800', '', '6', '', '', '', '', '2023-10-15 13:25:34'),
(7, 5, 'Terre argileuse : Enduits - Revêtements', 11, 1, '1.1', '1500', '', '10', '', '', '', '', '2023-10-15 13:25:34'),
(8, 5, 'Torchis', 2, 1, '0.2', '750', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(9, 5, 'Air', 3, 1, '0.0257', '1.205', '1005', '1', '', '', '', '', '2023-10-15 13:25:34'),
(10, 5, 'Eau (à 20°C)', 3, 1, '0.5977', '998', '4181.8', '1', '', '', '', '', '2023-10-15 13:25:34'),
(11, 5, 'Galets 20/40', 4, 1, '', '1700', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(12, 5, 'Misapor', 4, 0, '0.08', '140', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(13, 5, 'Pouzzolane', 4, 1, '0.15', '1050', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(14, 5, 'Pare-pluie - fibre de bois', 5, 1, '0.048', '270', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(15, 5, 'Pare-vapeur', 5, 1, '0.034', '40', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(16, 5, 'Chanvre', 6, 1, '0.04', '35', '', '1.5', '7', '', '', '', '2023-10-15 13:25:34'),
(17, 5, 'Chènevotte', 6, 1, '0.048', '100', '', '1.5', '8.5', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(18, 5, 'Laine de bois souple', 6, 1, '0.038', '45', '', '1.5', '7', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(19, 5, 'Laine de bois rigide', 6, 1, '0.045', '160', '', '4', '15', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(20, 5, 'Laine de lin', 6, 1, '0.037', '25', '', '1.5', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(21, 5, 'Laine de mouton', 6, 1, '0.037', '20', '', '1.5', '5', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(22, 5, 'Liège expansé', 6, 1, '0.043', '240', '', '10', '13', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(23, 5, 'Liège expansé (vrac)', 6, 1, '0,049', '65', '', '2', '9', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(24, 5, 'Paille – Botte', 6, 1, '0.052', '80', '', '1', '8', 'RFCP', 'https://www.rfcp.fr/caracteristiques-techniques/', '', '2023-10-15 13:25:34'),
(25, 5, 'Paille – Vrac', 6, 1, '0,049', '40', '', '1', '6', '', 'https://ielo.coop/', '', '2023-10-15 13:25:34'),
(26, 5, 'Plume', 6, 1, '0.05', '30', '', '2', '5', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(27, 5, 'Roseau', 6, 1, '0.06', '200', '', '2.5', '8', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(28, 5, 'Métisse', 7, 1, '0.039', '25', '', '2.5', '5', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(29, 5, 'Ouate de cellulose soufflée', 7, 1, '0.041', '30', '', '1.5', '10', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(30, 5, 'Ouate de cellulose panneaux', 7, 1, '0.039', '45', '', '2', '12', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(31, 5, 'Laine de roche', 8, 1, '0.044', '15', '', '1', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(32, 5, 'Laine de verre', 8, 1, '0.042', '10', '', '1', '4', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(33, 5, 'Mousse minérale', 8, 1, '0.045', '115', '', '3', '7', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(34, 5, 'Perlite expansée', 8, 1, '0.045', '70', '', '3', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(35, 5, 'Vermiculite expansée', 8, 1, '0.08', '100', '', '3.5', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(36, 5, 'Verre cellulaire', 8, 1, '0.06', '100', '', '10000', '7', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(37, 5, 'PSE Polystyrène expansé', 9, 1, '0.038', '20', '', '20', '4', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(38, 5, 'PSX Polystyrène extrudé', 9, 1, '0.035', '30', '', '80', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(39, 5, 'Polyuréthane', 9, 1, '0.03', '30', '', '30', '6', 'ParcEcoHabitat', 'http://www.urbia.fr/wp-content/uploads/2014/08/comparatif.isolation.pdf', '', '2023-10-15 13:25:34'),
(40, 5, 'Verre', 10, 1, '1.2', '2530', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(41, 5, 'Acacia (Robinier)', 12, 1, '', '770', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(42, 5, 'Béton', 11, 1, '1.75', '2200', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(43, 5, 'Châtaigner', 12, 1, '0.17', '620', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(44, 5, 'Chêne', 12, 1, '0.17', '750', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(45, 5, 'Douglas', 12, 1, '0.12', '540', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(46, 5, 'Epicéa', 12, 1, '', '510', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(47, 5, 'Frêne', 12, 1, '0.04', '720', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(48, 5, 'Hêtre', 12, 1, '', '680', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(49, 5, 'Mélèze', 12, 1, '0.13', '600', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(50, 5, 'Noyer', 12, 1, '', '700', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(51, 5, 'Pin (maritime, sylvestre)', 12, 1, '0.12', '600', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(52, 5, 'Red Cedar (Thuya)', 12, 1, '', '370', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(53, 5, 'Sapin', 12, 1, '', '450', '', '', '', '', '', '', '2023-10-15 13:25:34'),
(54, 5, 'Paille – Botte à plat', 6, 1, '0.08', '80', '', '1', '8', 'RFCP', 'https://www.rfcp.fr/caracteristiques-techniques/', '', '2023-10-15 13:25:34'),
(55, 5, 'Terre-paille (212kg/m3)', 6, 1, '0.078', '212', NULL, '4.77', NULL, 'terrepaille.fr', 'https://terrepaille.fr/conception#essais-laboratoire', 'David', '2024-09-07 19:06:11'),
(57, 5, 'Granite', 11, 1, '2.8', '2699', '0.8', '0', '', 'Ecobati et Wikipedia', 'https://ecobati.com/fr/produits/isolation-thermique/lambda-materiaux', 'Poulk', '2024-09-25 17:48:16'),
(58, 5, 'Acier', 11, 1, '50.2', '', '', '', '', 'Wikipedia', 'https://fr.wikipedia.org/wiki/Liste_de_conductivit%C3%A9s_thermiques', 'Poulk', '2024-11-17 12:01:44'),
(59, 5, 'Brique traditionnel terre cuite', 11, 0, '0.69', '1684', '', '', '', 'Terca fabricant', 'https://www.pointp.fr/asset/50/33/AST6415033.pdf', 'poulk', '2025-02-28 10:40:29'),
(60, 5, 'Correcteur thermique Terre/Chanvre projeté', 6, 1, '0.08', '400', '1.5', '4', '', 'arpe nomandie', '', 'Adrien JAMIN', '2025-05-08 18:22:39'),
(61, 5, 'Bauge', 11, 1, '1.1', '1800', '1.5', '5', '', 'Livre : Isolation thermique ecologique', '', 'Adrien JAMIN', '2025-05-08 18:25:56'),
(62, 5, 'Pare pluie steico', 6, 0, '0.048', '270', '2.1', '5', '', 'steico', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(63, 5, 'Pare pluie steico', 6, 0, '0.048', '270', '2.1', '5', '', 'steico', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(64, 5, 'Laine de bois steico flex', 6, 0, '0.036', '55', '2.1', '2', '', 'steico', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(65, 5, 'Laine de bois steico flex', 6, 0, '0.036', '55', '2.1', '2', '', 'steico', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(66, 5, 'Fermacell', 2, 0, '0.32', '1150', '1.3', '13', '', ' livre isolation thermique ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(67, 5, 'Fermacell', 2, 0, '0.32', '1150', '1.3', '13', '', ' livre isolation thermique ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(68, 5, 'tomette', 2, 1, '0.9', '1900', '1', '13', '', ' livre isolation thermique ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(69, 5, 'tomette', 2, 1, '0.9', '1900', '1', '13', '', ' livre isolation thermique ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(70, 5, 'Béton de liege légé', 11, 1, '0.09', '450', '1', '25', '', 'Saint Astier + livre maison ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17'),
(71, 5, 'Béton de liege légé', 11, 1, '0.09', '450', '1', '25', '', 'Saint Astier + livre maison ecologique', '', 'Adrien JAMIN', '2025-05-09 12:17:17');

-- --------------------------------------------------------

--
-- Structure de la table `trad_cath`
--

CREATE TABLE `trad_cath` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cath_id` bigint(20) NOT NULL COMMENT 'Matériaux ou cathegorie',
  `libelle` varchar(255) NOT NULL,
  `lang` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `trad_cath`
--

INSERT INTO `trad_cath` (`id`, `cath_id`, `libelle`, `lang`) VALUES
(1, 12, 'Wood', 'en');

-- --------------------------------------------------------

--
-- Structure de la table `trad_materiaux`
--

CREATE TABLE `trad_materiaux` (
  `id` int(20) NOT NULL,
  `materiaux_id` bigint(20) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `lang` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `trad_materiaux`
--

INSERT INTO `trad_materiaux` (`id`, `materiaux_id`, `libelle`, `lang`) VALUES
(1, 24, 'Bale of straw', 'en');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cath`
--
ALTER TABLE `cath`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `materiaux`
--
ALTER TABLE `materiaux`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `trad_cath`
--
ALTER TABLE `trad_cath`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `trad_materiaux`
--
ALTER TABLE `trad_materiaux`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cath`
--
ALTER TABLE `cath`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `materiaux`
--
ALTER TABLE `materiaux`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT pour la table `trad_cath`
--
ALTER TABLE `trad_cath`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `trad_materiaux`
--
ALTER TABLE `trad_materiaux`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
