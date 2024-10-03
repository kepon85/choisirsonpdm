<?php

include('config.php');

// Doc : 
// https://blog.elyotherm.fr/2015/08/dju-degre-jour-unifies-base-18.html

####################################
# Init
####################################

if (empty($_GET['debug'])) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    // header("Access-Control-Max-Age: 3600");
}
if (! is_writable($config['cache_dir'])) {
    http_response_code(500);
    $return['message'] = 'Cache dir ('.$config['cache_dir'].') is not writable';
    echo json_encode($return);
    exit(254);
}
function debug($msg) {
    global $_GET;
    if (isset($_GET['debug'])) {
        echo $msg."<br />\n";
    }
}

// Vérification des paramètres
if (empty($_GET['lat']) || empty($_GET['lng'])) {
    http_response_code(400);
    $return['message'] = 'lat & lng param is required';
    echo json_encode($return);
    exit(254);
} 

$latitude=$_GET['lat'];
$longitude=$_GET['lng'];
if (isset($_GET['s'])) {
    $s=$_GET['s'];
} else {
    $s=$config['paramDefault']['s'];
} 
if (isset($_GET['nbYearsArchive'])) {
    $nbYearsArchive=$_GET['nbYearsArchive'];
} else {
    $nbYearsArchive=$config['paramDefault']['nbYearsArchive'];
}
// Sécurité sur la quantité de données traités 
// Les données remontes jusqu'en 1985 
if ($nbYearsArchive < 1 || $nbYearsArchive > 41) {
    $nbYearsArchive=$config['paramDefault']['nbYearsArchive'];
}
$nbYearsArchive=$nbYearsArchive-1;

if (isset($_GET['temperature_unit'])) {
    $temperature_unit=$_GET['temperature_unit'];
} else {
    $temperature_unit=$config['paramDefault']['temperature_unit'];
}

####################################
# Récupération des données
####################################

# Nom du fichier
$dataFileName=$latitude.'_'.$longitude.'_'.$nbYearsArchive.'_'.$temperature_unit.'.json';
# Chemin du fichier
$dataFilePath=$config['cache_dir'].'/'.$dataFileName;
debug('path file : '.$dataFilePath);

if (!is_file($dataFilePath) || filemtime($dataFilePath)+$config['cache_timelife'] < time()) {
    debug('Cache expir or not exist, download...');
    $end_date=date('Y', strtotime(' - 1 years')).'-12-31';
    $start_date=date('Y', strtotime(' - '.($nbYearsArchive+1).' years')).'-01-01';
    debug('Date : start_date='.$start_date.'&end_date='.$end_date);
    $curl = curl_init();
    $curl_url = $config['api_url'].'?latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_mean&timezone=auto&temperature_unit='.$temperature_unit;
    $debug_api_url = 'https://open-meteo.com/en/docs/historical-weather-api#latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_mean&timezone=auto&temperature_unit='.$temperature_unit;
    debug('curl url : '.$curl_url);
    debug('debug API : '.$debug_api_url);
    $curlopt = [
        CURLOPT_URL => $curl_url,
        CURLOPT_HTTPHEADER => $config['curl_opt_httpheader'],
    ];
    curl_setopt_array($curl, $config['curl_opt'] + $curlopt);
    $data = curl_exec($curl);
    $curl_error = curl_error($curl);
    $http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    // Traitement curl
    if ($http_code != intval(200)) {
        http_response_code(503);
        $return['message'] = 'API error, contact administrator';
        $return['error']['http_code'] = $http_code;
        $return['error']['response'] = json_decode($data);
        $return['error']['curl_error'] = $curl_error;
        echo json_encode($return);
        file_put_contents($dataFilePath.'.error.json', $data);
        exit(254);
    } else {
        debug('API return '.$http_code.', save data : '.$dataFilePath);
        file_put_contents($dataFilePath, $data);
    }
} else {
    debug('Cache exist !');
    $data = file_get_contents($dataFilePath);
}

####################################
# Traitement des données 
# On cherche le DJU par jour
####################################

//~ var_dump(json_decode($data));
$data_decode = json_decode($data);
// Init variable
$data_decode->monthly = array();
$data_decode->yearly = array();
$n=0;
foreach ($data_decode->daily->time as $key => $date) { 
    $date_explode = explode("-", $date);
    $yearNow = $date_explode[0];
    $monthNow = $date_explode[1];
    
    // ------ DJU journélier
    // si S ≤ Moy : DJ = 0
    if ($s <= $data_decode->daily->temperature_2m_mean[$key]) {
        $data_decode->daily->dju[$key] = 0;
    }
    // si S > Moy : DJ = S - Moy
    if ($s > $data_decode->daily->temperature_2m_mean[$key]) {
        $data_decode->daily->dju[$key] = round($s-$data_decode->daily->temperature_2m_mean[$key], 1);
    }
    // ------ DJU mensuelle
    if (array_key_exists("$yearNow-$monthNow", $data_decode->monthly)) {
        // Si existe, on additionn
        $data_decode->monthly["$yearNow-$monthNow"] = round($data_decode->monthly["$yearNow-$monthNow"]+$data_decode->daily->dju[$key]);
    } else {
        // Si existe pas, on crée
        $data_decode->monthly["$yearNow-$monthNow"] = $data_decode->daily->dju[$key];
    }
    
    // ------ DJU annuelle
    if (array_key_exists($yearNow, $data_decode->yearly)) {
        // Si existe, on additionn
        $data_decode->yearly[$yearNow] = round($data_decode->yearly[$yearNow]+$data_decode->daily->dju[$key]);
    } else {
        // Si existe pas, on crée
        $data_decode->yearly[$yearNow] = $data_decode->daily->dju[$key];
    }

}
//~ var_dump($data_decode);

$sum = array_sum($data_decode->yearly); // Obtenir la somme de toutes les valeurs du tableau
$average = round($sum / count($data_decode->yearly)); // Le calcul 

debug("Somme DJU période : ".$sum);
debug("Moyenne DJU période ".$average);

$data_decode->yearly_average = $average;

if (empty($_GET['verbose'])) {
    unset($data_decode->daily);
}

debug('Json return : ');
echo json_encode($data_decode);
?>
