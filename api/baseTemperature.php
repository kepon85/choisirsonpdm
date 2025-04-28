<?php

include('config.php');

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

// Gestion du cache
if (isset($_GET['cache'])) {
    $useCache = filter_var($_GET['cache'], FILTER_VALIDATE_BOOLEAN);
} else {
    $useCache = $config['paramDefault']['cache'];
}
$cacheTimelife = $useCache ? $config['cache_timelife'] : 0;

// Ajout du paramètre mode
if (isset($_GET['mode'])) {
    $mode = $_GET['mode'];
    if ($mode !== 'contiguousDay' && $mode !== 'uncontiguousDay') {
        $mode = $config['paramDefault']['mode'];
    }
} else {
    $mode = $config['paramDefault']['mode'];
}

// Gestion du nombre de jours
if (isset($_GET['nbDays'])) {
    $nbDays = intval($_GET['nbDays']);
    if ($nbDays < 1 || $nbDays > 30) {  // Limite arbitraire de 30 jours
        $nbDays = $config['paramDefault']['nbDays'];
    }
} else {
    $nbDays = $config['paramDefault']['nbDays'];
}

// Gestion de l'année de fin
if (isset($_GET['endYearArchive'])) {
    $endYearArchive = intval($_GET['endYearArchive']);
    $currentYear = intval(date('Y'));
    // Vérification que l'année est valide (entre 1985 et l'année courante)
    if ($endYearArchive < 1985 || $endYearArchive > $currentYear) {
        $endYearArchive = $config['paramDefault']['endYearArchive'];
    }
} else {
    $endYearArchive = $config['paramDefault']['endYearArchive'];
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

if (!is_file($dataFilePath) || filemtime($dataFilePath)+$cacheTimelife < time()) {
    debug('Cache expir or not exist, download...');
    $end_date = $endYearArchive . '-12-31';
    $start_date = ($endYearArchive - $nbYearsArchive) . '-01-01';
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
    if ($mode === 'contiguousDay') {
        $byYear[$yearNow]['record']['temperature_min']=99;
        $byYear[$yearNow]['record']['temperature_min_nb_day']=$nbDays;
        $byYear[$yearNow]['record']['temperature_min_days'] = 'Error';
    } else {
        $byYear[$yearNow]['record']['temperature_min']=99;
        $byYear[$yearNow]['record']['temperature_min_nb_day']=$nbDays;
        $byYear[$yearNow]['record']['temperature_min_days'] = 'Error';
    }
    $byYear[$yearNow]['time'][$n] = $date;
    $byYear[$yearNow]['temperature_min'][$n] = $data_decode->daily->temperature_2m_min[$key];
    $n++;
}

# Addition par tranche de x jours et recherche du record de l'année
foreach ($byYear as $year => $data) {
    debug("Year : $year");
    $countTemperature=count($data['temperature_min']);
    debug("Count temperature : ".$countTemperature);
    
    if ($mode === 'contiguousDay') {
        // Calcul pour les jours contigus
        $breakEndYear=false;
        for ($i = 0; $i <= $countTemperature - $nbDays; $i++) {
            $recordAddition=0;
            $recordId='';
            for ($contiguousDay = 0; $contiguousDay < $nbDays; $contiguousDay++) {
                $currentIndex = $i + $contiguousDay;
                if (!isset($data['temperature_min'][$currentIndex])) {
                    $breakEndYear=true;
                    break;
                }
                if ($currentIndex >= $countTemperature) {
                    $breakEndYear=true;
                    break;
                }
                $recordAddition += $data['temperature_min'][$currentIndex];
                $recordId .= '|' . $currentIndex;
            }
            if ($breakEndYear == true) {
                continue;
            }
            $recordMoy=$recordAddition/$nbDays;
            debug('ID : '.$recordId .', Addition : '. $recordAddition .", Moyenne : ".$recordMoy);
            if ($recordMoy <= $byYear[$year]['record']['temperature_min']) {
                $byYear[$year]['record']['temperature_min'] = $recordMoy;
                $byYear[$year]['record']['temperature_min_days']= '';
                $recordIdExplode = explode("|", trim($recordId, '|'));
                foreach($recordIdExplode as $dayId) {
                    if ($dayId !== '' && isset($data['time'][$dayId])) {
                        $byYear[$year]['record']['temperature_min_days'].=" ".$data['time'][$dayId];
                    }
                }
            }
        }
    } else {
        // Calcul pour les jours non contigus
        $tempArray = $data['temperature_min'];
        asort($tempArray);
        $selectedDays = array_slice($tempArray, 0, $nbDays, true);
        
        // Calcul de la moyenne des X jours les plus froids
        $uncontiguousSum = array_sum($selectedDays);
        $uncontiguousMean = $uncontiguousSum / $nbDays;
        $byYear[$year]['record']['temperature_min'] = $uncontiguousMean;
        
        // Enregistrement des dates correspondantes
        $byYear[$year]['record']['temperature_min_days'] = '';
        foreach(array_keys($selectedDays) as $dayIndex) {
            if (isset($data['time'][$dayIndex])) {
                if ($dayIndex !== '' && isset($data['time'][$dayIndex])) {
                    $byYear[$year]['record']['temperature_min_days'] .= " " . $data['time'][$dayIndex];
                }
            }
        }
    }
    
    debug("Record pour l'année ".$year." : ".$byYear[$year]['record']['temperature_min']." qui a eu lieu le : ".$byYear[$year]['record']['temperature_min_days']);
    
    if (empty($_GET['verbose'])) {
        unset($byYear[$year]['time']);
        unset($byYear[$year]['temperature_min']);
    }
}

# Moyenne des années
$recordAddition=0;
debug(count($byYear));
foreach ($byYear as $year => $data) {
    $recordAddition += $byYear[$year]['record']['temperature_min'];
}
debug("Température record additionnée : ".$recordAddition);
debug("Temperature de base ".round($recordAddition/count($byYear), 2));

$byYear['base'] = round($recordAddition/count($byYear), 2);
$byYear['mode'] = $mode;
$byYear['cache_used'] = $useCache;
$byYear['nb_days'] = $nbDays;
$byYear['end_year'] = $endYearArchive;  // Ajout de l'année de fin dans la réponse

debug('Json return : ');
echo json_encode($byYear);
?>
