<?php
require_once('config.php');

/*
CREATE TABLE `links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `link` varchar(20) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  `hash` text NOT NULL,
  `level` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `link` (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
 ALTER TABLE `links` 
CHANGE COLUMN `hash` `url` text NOT NULL,
ADD COLUMN `last_access` datetime DEFAULT NULL,
ADD COLUMN `count_access` int DEFAULT 0;
*/

header("Access-Control-Allow-Origin: *");

// Connexion à la base de données
try {
    $pdo = new PDO("mysql:host=".$config['mysql']['hostname'].";dbname=".$config['mysql']['db'], 
                   $config['mysql']['username'], 
                   $config['mysql']['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()]));
}

// Au début du fichier, après la config
$debug_logs = [];
function addDebugLog($message, $data = null) {
    global $debug_logs, $config;
    if (isset($config['link']['debug']) && $config['link']['debug']) {
        $debug_logs[] = [
            'timestamp' => microtime(true),
            'message' => $message,
            'data' => $data
        ];
    }
}

function sendJsonResponse($data, $code = 200) {
    global $debug_logs, $config;
    http_response_code($code);
    if (isset($config['link']['debug']) && $config['link']['debug']) {
        $data['debug'] = $debug_logs;
    }
    echo json_encode($data);
    exit();
}

// Fonction pour la purge des liens
function purgeLiens($pdo, $purgeDay) {
    addDebugLog("Début de la purge pour les liens plus vieux que $purgeDay jours");
    
    try {
        $stmt = $pdo->prepare("
            DELETE FROM links 
            WHERE (last_access IS NULL AND date < DATE_SUB(NOW(), INTERVAL ? DAY))
            OR (last_access IS NOT NULL AND last_access < DATE_SUB(NOW(), INTERVAL ? DAY))
        ");
        
        addDebugLog("Exécution de la requête de purge", [
            'sql' => $stmt->queryString,
            'params' => [$purgeDay, $purgeDay]
        ]);
        
        $stmt->execute([$purgeDay, $purgeDay]);
        $deletedCount = $stmt->rowCount();
        
        addDebugLog("Purge terminée", ['liens_supprimés' => $deletedCount]);
        return $deletedCount;
        
    } catch(PDOException $e) {
        addDebugLog("Erreur lors de la purge", ['error' => $e->getMessage()]);
        throw $e;
    }
}

// Vérification de la tâche cron via GET
if (isset($_GET['task']) && $_GET['task'] === 'cron') {
    header("Content-Type: application/json");
    
    try {
        
        // Vérifie la configuration de purge
        if (!isset($config['link']['purgeday'])) {
            addDebugLog("Configuration manquante: 'purgeday' n'est pas défini");
            sendJsonResponse(['error' => 'Configuration purgeday manquante'], 500);
        }
        
        $purgeDay = intval($config['link']['purgeday']);
        $deletedCount = purgeLiens($pdo, $purgeDay);
        
        sendJsonResponse([
            'status' => 'success',
            'message' => "Purge terminée",
            'deleted_count' => $deletedCount
        ]);
        
    } catch(Exception $e) {
        sendJsonResponse([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}

// Traitement des requêtes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header("Content-Type: application/json");
    if (!isset($_POST['url'])) {
        addDebugLog('URL manquante dans la requête POST');
        sendJsonResponse(['error' => 'L\'URL est requise'], 400);
    }

    $url = filter_var($_POST['url'], FILTER_VALIDATE_URL);
    addDebugLog('Validation URL', ['input' => $_POST['url'], 'filtered' => $url]);
    
    if (!$url || !preg_match('/^https?:\/\//i', $url)) {
        addDebugLog('URL invalide', ['pattern_check' => preg_match('/^https?:\/\//i', $url)]);
        sendJsonResponse(['error' => 'URL invalide. Elle doit commencer par http:// ou https://'], 400);
    }

    // Vérifier si l'URL existe déjà
    $stmt = $pdo->prepare("SELECT link FROM links WHERE url = ?");
    addDebugLog('Vérification URL existante', ['sql' => $stmt->queryString, 'params' => [$url]]);
    $stmt->execute([$url]);
    
    if ($existing = $stmt->fetch(PDO::FETCH_ASSOC)) {
        addDebugLog('URL déjà existante', ['existing_link' => $existing]);
        sendJsonResponse(['link' => $existing['link']]);
    }

    $ip = $_SERVER['REMOTE_ADDR'];
    $date = date('Y-m-d H:i:s');
    addDebugLog('Informations requête', ['ip' => $ip, 'date' => $date]);
    
    if (isset($_POST['name'])) {
        // Génération d'un lien avec nom personnalisé
        do {
            $random = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            $link = $_POST['name'] . '_' . $random;
            
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM links WHERE link = ?");
            $stmt->execute([$link]);
        } while ($stmt->fetchColumn() > 0);
    } else {
        // Génération d'un lien aléatoire
        do {
            $link = substr(str_shuffle('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 16);
            
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM links WHERE link = ?");
            $stmt->execute([$link]);
        } while ($stmt->fetchColumn() > 0);
    }
    addDebugLog('Lien généré', ['generated_link' => $link]);

    try {
        $stmt = $pdo->prepare("INSERT INTO links (link, ip, date, url) VALUES (?, ?, ?, ?)");
        addDebugLog('Insertion en base', [
            'sql' => $stmt->queryString,
            'params' => [$link, $ip, $date, $url]
        ]);
        
        $stmt->execute([$link, $ip, $date, $url]);
        addDebugLog('Insertion réussie');
        
        sendJsonResponse(['link' => $link]);
    } catch(PDOException $e) {
        addDebugLog('Erreur SQL', ['error' => $e->getMessage()]);
        sendJsonResponse(['error' => 'Erreur lors de la création du lien: ' . $e->getMessage()], 500);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    if (!isset($_GET['link'])) {
        addDebugLog('Paramètre link manquant');
        header("Content-Type: application/json");
        sendJsonResponse(['error' => 'Le paramètre link est requis'], 400);
    }

    try {
        // Récupérer l'URL et mettre à jour les statistiques
        $stmt = $pdo->prepare("SELECT url FROM links WHERE link = ?");
        addDebugLog('Recherche du lien', [
            'sql' => $stmt->queryString,
            'params' => [$_GET['link']]
        ]);
        
        $stmt->execute([$_GET['link']]);
        
        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            addDebugLog('Lien trouvé', ['url' => $row['url']]);
            
            // Mettre à jour last_access et count_access
            $updateStmt = $pdo->prepare("UPDATE links SET 
                last_access = NOW(), 
                count_access = count_access + 1 
                WHERE link = ?");
            addDebugLog('Mise à jour statistiques', ['sql' => $updateStmt->queryString]);
            $updateStmt->execute([$_GET['link']]);

            header("HTTP/1.1 301 Moved Permanently");
            header("Location: " . $row['url']);
            exit();
        } else {
            addDebugLog('Lien non trouvé');
            http_response_code(404);
            echo '<!DOCTYPE html>
<html>
<head>
    <title>Lien non trouvé</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding-top: 50px;
            background-color: #f5f5f5;
        }
        h1 { color: #333; }
        .error-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404 - Enregistrement non trouvé</h1>
        <p>Désolé, l\'enregistrement que vous recherchez n\'existe pas/plus.</p>
    </div>
</body>
</html>';
            exit();
        }
    } catch(PDOException $e) {
        addDebugLog('Erreur SQL', ['error' => $e->getMessage()]);
        http_response_code(500);
        die('Erreur serveur interne');
    }

} else {
    header("Content-Type: application/json");
    http_response_code(405);
    die(json_encode(['error' => 'Méthode non autorisée']));
}
