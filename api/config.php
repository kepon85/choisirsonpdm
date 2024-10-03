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

// DJU
$config['paramDefault']['s']=18;


?>
