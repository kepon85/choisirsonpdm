<?php

####################################
# Config
####################################

$config['cache_dir']='../../tmp';
$config['cache_timelife']=432000; # 5 jours
$config['paramDefault']['nbYearsArchive']=20;
$config['paramDefault']['temperature_unit']='celsius';
$config['api_url']='https://archive-api.open-meteo.com/v1/archive';
$config['contiguousDay']=5;
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
    $curl_url = $config['api_url'].'?latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_min&timezone=auto&temperature_unit='.$temperature_unit;
    $debug_api_url = 'https://open-meteo.com/en/docs/historical-weather-api#latitude='.$latitude.'&longitude='.$longitude.'&start_date='.$start_date.'&end_date='.$end_date.'&daily=temperature_2m_min&timezone=auto&temperature_unit='.$temperature_unit;
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
####################################

#var_dump(json_decode($data));
$data_decode = json_decode($data);
# Classement par année
$n=0;
$yearNow='';
foreach ($data_decode->daily->time as $key => $date) { 
    $date_explode = explode("-", $date);
    if ($yearNow != $date_explode[0]) {
        $n = 0;
        $yearNow = $date_explode[0];
    }
    $byYear[$yearNow]['record']['temperatire_min_contiguous']=99;
    $byYear[$yearNow]['record']['temperatire_min_contiguous_nb_day']=$config['contiguousDay'];
    $byYear[$yearNow]['record']['temperatire_min_contiguous_days'] = 'Error';
    $byYear[$yearNow]['time'][$n] = $date;
    $byYear[$yearNow]['temperature_min'][$n] = $data_decode->daily->temperature_2m_min[$key];
    $n++;
}

# Addition par tranche de x jours et recherche du record de l'année
foreach ($byYear as $year => $data) {
    debug("Year : $year");
    //var_dump($data['temperature_min']);
    $countTemperature=count($data['temperature_min']);
    debug("Count temperature  : ".$countTemperature);
    $breakEndYear=false;
    for ($i = 0; $i <= $countTemperature; $i++) {
        $recordAddition=0;
        $recordId='';
        for ($contiguousDay = 0; $contiguousDay < $config['contiguousDay']; $contiguousDay++) {
            # Quand ça dépasse décembre, on retourne sur janvier
            if (($i+$contiguousDay) > $countTemperature) {
                $breakEndYear=true;
            } else {
                $recordAddition=$recordAddition + $data['temperature_min'][$i+$contiguousDay];
                $recordId = $recordId.'|'.($i+$contiguousDay);
            }            
        }
        if ($breakEndYear == true) {
            continue;
        }
        $recordMoy=$recordAddition/$config['contiguousDay'];
        debug('ID : '.$recordId .', Addition : '. $recordAddition .", Moyenne : ".$recordMoy);
        if ($recordMoy <= $byYear[$year]['record']['temperatire_min_contiguous']) {
            $byYear[$year]['record']['temperatire_min_contiguous'] = $recordMoy;
            $byYear[$year]['record']['temperatire_min_contiguous_days']= '';
            $recordIdExplode = explode("|", $recordId);
            foreach($recordIdExplode as $dayId) {
                $byYear[$year]['record']['temperatire_min_contiguous_days'].=" ".$data['time'][$dayId];
            }
            debug('Nouveau record : ID : '.$recordId .', Addition : '. $recordAddition .", Moyenne : ".$recordMoy." Days  : ".$byYear[$year]['record']['temperatire_min_contiguous_days']);
        }
    }
    debug("Reccord pour l'année ".$year." : ".$byYear[$year]['record']['temperatire_min_contiguous']." qui a eu lieu le : ".$byYear[$year]['record']['temperatire_min_contiguous_days']);
    if (empty($_GET['verbose'])) {
        unset($byYear[$year]['time']);
        unset($byYear[$year]['temperature_min']);
    }
}

# Moyenne des années
$reccordAddition=0;
debug(count($byYear));
foreach ($byYear as $year => $data) {
    $reccordAddition=$reccordAddition+$byYear[$year]['record']['temperatire_min_contiguous'];
}
debug("Température reccord additionné : ".$reccordAddition);
debug("Temperature de base ".round($reccordAddition/count($byYear), 2));
$byYear['base']=round($reccordAddition/count($byYear), 2);

debug('Json return : ');
echo json_encode($byYear);
?>
