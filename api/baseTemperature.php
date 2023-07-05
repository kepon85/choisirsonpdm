<?php
$config['cache_dir']='../../tmp';
$config['cache_timelife']=1; # in seconde
$config['paramDefault']['nbYearsArchive']=10;
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
        echo $msg."<br />\n";
    }
}

// Vérification des paramètres
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
// Sécurité sur la quantité de données traités
if ($nbYearsArchive < 1 || $nbYearsArchive > 20) {
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
foreach ($data_decode->daily->time as $key => $date) { 
    $date_explode = explode("-", $date);
    // Classement par année 
    $byYear[$date_explode[0]]['time'][$key] = $date;
    $byYear[$date_explode[0]]['temperature_min'][$key] = $data_decode->daily->temperature_2m_min[$key];
}

//var_dump($byYear);

# Addition par tranche de 5 jours
foreach ($byYear as $year => $data) {
    debug("Year : $year");
    //var_dump($data['temperature_min']);
    $countTemperature=count($data['temperature_min']);
    debug("Count temperature  : ".$countTemperature);
    debug($data['temperature_min'][2]);
    $byYear[$year]['record']['temperatire_min_contiguous']=99;
    $byYear[$year]['record']['temperatire_min_contiguous_nb_day']=$config['contiguousDay'];
    $byYear[$year]['record']['days'] = 'Error';
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
            $byYear[$year]['record']['days'] = '';
            $recordIdExplode = explode("|", $recordId);
            foreach($recordIdExplode as $dayId) {
                $byYear[$year]['record']['days'] .= " ".$data['time'][$dayId];
            }
            debug('Nouveau record : ID : '.$recordId .', Addition : '. $recordAddition .", Moyenne : ".$recordMoy." Days  : ".$byYear[$year]['record']['days']);
        }
        #$record[]=$data['temperature_min'][$i]+$data['temperature_min'][$i+1]
    }
    debug("Reccord pour l'année ".$year." : ".$byYear[$year]['record']['temperatire_min_contiguous']." qui a eu lieu le : ".$byYear[$year]['record']['days']);
    //foreach ($data['temperature_min'] as $key => $temperature_min) {
        //debug("$key : $temperature_min");
    //}

}
?>
