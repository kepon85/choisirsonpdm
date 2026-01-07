<?php
require_once('config.php');

# Généré by : https://chatgpt.com/c/681cf8ac-4608-800c-8830-fdb363dd0e7e

// Connexion à la base de données
try {
    $pdo = new PDO("mysql:host=".$config['mysql']['hostname'].";dbname=".$config['mysql']['db'], 
                   $config['mysql']['username'], 
                   $config['mysql']['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

// Filtrage par mois et top N
$monthFilter = isset($_GET['month']) ? $_GET['month'] : date('Y-m');
$topLimit = isset($_GET['top']) ? intval($_GET['top']) : 10;
$startDate = $monthFilter . '-01';
$endDate = date('Y-m-t', strtotime($startDate));

// Récupération des statistiques globales
$stats = [];
$stmt = $pdo->query("SELECT COUNT(*) AS unique_submissions FROM (SELECT ip, MIN(date) FROM links GROUP BY ip) grouped");
$stats['unique_submissions'] = $stmt->fetchColumn();
$stmt = $pdo->query("SELECT COUNT(*) AS total_submissions FROM links");
$stats['total_submissions'] = $stmt->fetchColumn();
$stmt = $pdo->query("SELECT SUM(count_access) AS total_usage FROM links");
$stats['total_usage'] = $stmt->fetchColumn();

// Statistiques filtrées par mois
$topAccessStmt = $pdo->prepare("SELECT link, count_access FROM links WHERE date BETWEEN :start AND :end ORDER BY count_access DESC LIMIT $topLimit");
$topAccessStmt->execute(['start' => $startDate, 'end' => $endDate]);
$filtered['top_access'] = $topAccessStmt->fetchAll(PDO::FETCH_ASSOC);

$lastAccessStmt = $pdo->prepare("SELECT link, last_access FROM links WHERE date BETWEEN :start AND :end ORDER BY last_access DESC LIMIT 10");
$lastAccessStmt->execute(['start' => $startDate, 'end' => $endDate]);
$filtered['last_access'] = $lastAccessStmt->fetchAll(PDO::FETCH_ASSOC);

$topIpsStmt = $pdo->prepare("SELECT ip, COUNT(*) AS submissions FROM links WHERE date BETWEEN :start AND :end GROUP BY ip ORDER BY submissions DESC LIMIT $topLimit");
$topIpsStmt->execute(['start' => $startDate, 'end' => $endDate]);
$filtered['top_ips'] = $topIpsStmt->fetchAll(PDO::FETCH_ASSOC);

$recentLinksStmt = $pdo->prepare("SELECT link, date FROM links WHERE date BETWEEN :start AND :end ORDER BY date DESC LIMIT 10");
$recentLinksStmt->execute(['start' => $startDate, 'end' => $endDate]);
$filtered['recent_links'] = $recentLinksStmt->fetchAll(PDO::FETCH_ASSOC);

// Récupération des données journalières pour le graphique
$dailyStatsStmt = $pdo->prepare("
    SELECT DATE(date) as day, 
           COUNT(*) as total_submissions,
           COUNT(DISTINCT ip) as unique_submissions
    FROM links
    WHERE date BETWEEN :start AND :end
    GROUP BY day
    ORDER BY day
");
$dailyStatsStmt->execute(['start' => $startDate, 'end' => $endDate]);
$dailyStats = $dailyStatsStmt->fetchAll(PDO::FETCH_ASSOC);
$days = array_column($dailyStats, 'day');
$dailyTotal = array_column($dailyStats, 'total_submissions');
$dailyUnique = array_column($dailyStats, 'unique_submissions');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Statistiques des liens</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h1>Statistiques des liens</h1>

    <h2>Chiffres généraux</h2>
    <ul>
        <li>Soumissions uniques : <?= $stats['unique_submissions'] ?></li>
        <li>Total des soumissions : <?= $stats['total_submissions'] ?></li>
        <li>Nombre total d'utilisations : <?= $stats['total_usage'] ?> (soit <?= $stats['total_submissions'] + $stats['total_usage'] ?> utilisations cumulées)</li>
        <li><em>Données disponibles depuis mars 2025</em></li>
    </ul>

    <form method="get">
        <label for="month">Mois :</label>
        <input type="month" name="month" id="month" value="<?= htmlspecialchars($monthFilter) ?>">
        <label for="top">Top :</label>
        <select name="top" id="top">
            <?php foreach ([10, 20, 30, 50] as $option): ?>
                <option value="<?= $option ?>" <?= $topLimit === $option ? 'selected' : '' ?>><?= $option ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit">Filtrer</button>
    </form>

    <h2>Top <?= $topLimit ?> des liens les plus consultés (<?= htmlspecialchars($monthFilter) ?>)</h2>
    <table>
        <thead>
            <tr>
                <th>Lien</th>
                <th>Nombre d'accès</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($filtered['top_access'] as $row): ?>
                <tr>
                    <td><a href="<?= $config['url_prefix'] . $row['link'] ?>" target="_blank"><?= htmlspecialchars($row['link']) ?></a></td>
                    <td><?= $row['count_access'] ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Derniers liens consultés (<?= htmlspecialchars($monthFilter) ?>)</h2>
    <table>
        <thead>
            <tr>
                <th>Lien</th>
                <th>Dernier accès</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($filtered['last_access'] as $row): ?>
                <tr>
                    <td><a href="<?= $config['url_prefix'] . $row['link'] ?>" target="_blank"><?= htmlspecialchars($row['link']) ?></a></td>
                    <td><?= $row['last_access'] ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Dernières créations de liens (<?= htmlspecialchars($monthFilter) ?>)</h2>
    <table>
        <thead>
            <tr>
                <th>Lien</th>
                <th>Date de création</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($filtered['recent_links'] as $row): ?>
                <tr>
                    <td><a href="<?= $config['url_prefix'] . $row['link'] ?>" target="_blank"><?= htmlspecialchars($row['link']) ?></a></td>
                    <td><?= $row['date'] ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Top <?= $topLimit ?> des IP (<?= htmlspecialchars($monthFilter) ?>)</h2>
    <table>
        <thead>
            <tr>
                <th>IP</th>
                <th>Nombre de soumissions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($filtered['top_ips'] as $row): ?>
                <tr>
                    <td><?= $row['ip'] ?></td>
                    <td><?= $row['submissions'] ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Graphiques journaliers (<?= htmlspecialchars($monthFilter) ?>)</h2>
    <canvas id="dailyChart" width="600" height="300"></canvas>
    <script>
        const ctx = document.getElementById('dailyChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: <?= json_encode($days) ?>,
                datasets: [
                    {
                        label: 'Soumissions',
                        data: <?= json_encode($dailyTotal) ?>,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Soumissions uniques',
                        data: <?= json_encode($dailyUnique) ?>,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>
