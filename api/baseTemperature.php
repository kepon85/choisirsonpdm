<?php
$config['cache_dir']='../../tmp';
$config['cache_timelife']=9999999999; # in seconde
$config['paramDefault']['nbYearsArchive']=10;
$config['api_url']='https://archive-api.open-meteo.com/v1/archive';

$config['curl_opt'] = [
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 15,
	CURLOPT_CONNECTTIMEOUT => 15,
	CURLOPT_SSL_VERIFYPEER => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
];
$config['curl_opt_httpheader'] = [
	"Accept: application/json",
	"Content-Type: application/json",
	"User-Agent: baseTemperature (https://framagit.org/kepon/choisirsonpdm/-/blob/main/api)"
];

if (empty($_GET['debug'])) {
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    // header("Access-Control-Max-Age: 3600");
}

if (! is_writable($config['cache_dir'])) {
    exit('Cache dir ('.$config['cache_dir'].') is not writable');
}

function debug($msg) {
    global $_GET;
    if (isset($_GET['debug'])) {
        echo $msg."<br />";
    }
}

if (empty($_GET['latitude']) || empty($_GET['longitude'])) {
    exit('latitude & longitude param is required.');
} 
$latitude=$_GET['latitude'];
$longitude=$_GET['longitude'];
if (isset($_GET['nbYearsArchive'])) {
    $nbYearsArchive=$_GET['nbYearsArchive'];
} else {
    $nbYearsArchive=$config['paramDefault']['nbYearsArchive'];
}

####################################
# Récupération des données
####################################

# Nom du fichier
$dataFileName=$latitude.'_'.$longitude.'_'.$nbYearsArchive.'.json';
# Chemin du fichier
$dataFilePath=$config['cache_dir'].'/'.$dataFileName;
debug('path file : '.$dataFilePath);

if (!is_file($dataFilePath) || filemtime($dataFilePath)+$config['cache_timelife'] < time()) {
    debug('Cache expir or not exist, download...');
    $end_date=date('Y-m-d');
    $start_date=date('Y-m-d', strtotime(' - '.$nbYearsArchive.' years'));
    debug('Date : start_date='.$start_date.'&end_date='.$end_date);
    $curl = curl_init();
    $curl_url = $config['api_url'].'?latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_min&timezone=auto';
    $debug_api_url = 'https://open-meteo.com/en/docs/historical-weather-api#latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_min&timezone=auto';
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

var_dump($data);

?>
