<?php
include('./config.php');
header("Access-Control-Allow-Origin: *");

(empty($_GET['debug'])) && header('Content-Type: application/json; charset=utf-8');  

$cache_file=$config['cache']['directory']."/cache_".$_SERVER['QUERY_STRING'];
if (!is_file($cache_file) || filemtime($cache_file)+$config['cache']['expire'] < time()) {

    // Si le dossier cache n'existe pas on le crée
    if (!is_dir($config['cache']['directory'])) {
        mkdir($config['cache']['directory']);
    }

    // DB connexion
    try {
        $db = new PDO('mysql:host='.$config['mysql']['hostname'].';dbname='.$config['mysql']['db'].'', $config['mysql']['username'], $config['mysql']['password'],
            array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database connexion fail' . $e->getMessage() ]); 
        http_response_code(500);
        exit();
    }

    // Check param
    $print=false;
    if (isset($_GET['print'])) {
        if (preg_match_all('/^(tree)$/', $_GET['print'])) {
            $print=$_GET['print'];
        } else {
            echo json_encode(['error' => 'Print format error']); 
            http_response_code(400);
            exit();
        }
    }
    $lang='';
    if (isset($_GET['lang'])) {
        if (preg_match_all($config['get']['langregex'], $_GET['lang'])) {
            $lang=$_GET['lang'];
        } else {
            echo json_encode(['error' => 'Lang format error']); 
            http_response_code(400);
            exit();
        }
    }
    $src='';
    if (isset($_GET['src'])) {
        if (preg_match_all($config['get']['srcregex'], $_GET['src'])) {
            $src="AND source_libelle = '".addslashes($_GET['src'])."'";
        } else {
            echo json_encode(['error' => 'Source inconnu']); 
            http_response_code(400);
            exit();
        }
    }
    $spec='';
    if (isset($_GET['spec'])) {
        if (preg_match_all('/^(lambda|p|u|c|h)$/', $_GET['spec'])) {
            $spec="AND ".$_GET['spec']." != ''";
        } else {
            echo json_encode(['error' => 'Spec inconnu']); 
            http_response_code(400);
            exit();
        }
    }
    $cath='';
    if (isset($_GET['cath'])) {
        if (preg_match_all($config['get']['cathregex'], $_GET['cath'])) {
            $cath="AND (cath.libelle LIKE \"%".$_GET['cath']."%\" OR trad_cath.libelle LIKE \"%".$_GET['cath']."%\")";
        } else {
            echo json_encode(['error' => 'Cath non conforme']); 
            http_response_code(400);
            exit();
        }
    }
    $search='';
    if (isset($_GET['search'])) {
        if (preg_match_all($config['get']['searchregex'], $_GET['search'])) {
            $search="AND (materiaux.libelle LIKE \"%".$_GET['search']."%\" OR trad_materiaux.libelle LIKE \"%".$_GET['search']."%\")";
        } else {
            echo json_encode(['error' => 'Search non conforme']); 
            exit();
        }
    }

    // Init Data
    $data=[];

    if ($print == 'tree') {
        $orderby = 'ORDER BY trad_cath_libelle ASC, cath_libelle ASC, `materiaux`.`generique`  DESC, materiaux.libelle ASC';
    }else{
        $orderby = 'ORDER BY `materiaux`.`generique`  DESC, materiaux.libelle ASC';
    }

    // Init query
    $sqlquery = "
        SELECT materiaux.id id, materiaux.libelle libelle, trad_materiaux.libelle trad_libelle, materiaux.cath_id cath_id, cath.libelle cath_libelle, trad_cath.libelle trad_cath_libelle, generique, lambda, p, c, u, h, source_libelle, source_link, contrib, lastupdate
        FROM materiaux
        INNER JOIN cath on materiaux.cath_id = cath.id
        LEFT JOIN trad_materiaux on materiaux.id = trad_materiaux.materiaux_id AND  trad_materiaux.lang = :lang
        LEFT JOIN trad_cath on cath.id = trad_cath.cath_id AND  trad_cath.lang = :lang
        WHERE status = 5  
        ".$src."
        ".$spec."
        ".$cath."
        ".$search."
        ".$orderby."
    ";

    function cleanToNull($data) {
        if ($data == '') {
            return null;
        } else {
            return $data;
        }
    }

    // Mise en forme des données
    try{ 
        $param = array('lang' => $lang);
        $req=$db->prepare($sqlquery);
        $req->execute($param);
        $materiaux = $req->fetchAll();
        foreach ($materiaux as $materiau) {
            $dataChild = (object)[];
            $dataChild->{'id'}=$materiau['id'];
            if ($materiau['trad_libelle'] != null)  {
                $dataChild->{'libelle'}=$materiau['trad_libelle'];
            } else {
                $dataChild->{'libelle'}=$materiau['libelle'];
            }
            $dataChild->{'generic'}=cleanToNull($materiau['generique']);
            $dataChild->{'cath_id'}=$materiau['cath_id'];
            if ($materiau['trad_cath_libelle'] != null)  {
                $dataChild->{'cath'}=$materiau['trad_cath_libelle'];
            } else {
                $dataChild->{'cath'}=$materiau['cath_libelle'];
            }
            $dataChild->{'spec'}= (object)[];
            if ((isset($_GET['spec']) && $_GET['spec'] == 'lambda') || empty($_GET['spec'])) {
                $dataChild->{'spec'}->{'lambda'}=cleanToNull($materiau['lambda']);
            }
            if ((isset($_GET['spec']) && $_GET['spec'] == 'p') || empty($_GET['spec'])) {
                $dataChild->{'spec'}->{'p'}=cleanToNull($materiau['p']);
            }
            if ((isset($_GET['spec']) && $_GET['spec'] == 'c') || empty($_GET['spec'])) {
                $dataChild->{'spec'}->{'c'}=cleanToNull($materiau['c']);
            }
            if ((isset($_GET['spec']) && $_GET['spec'] == 'u') || empty($_GET['spec'])) {
                $dataChild->{'spec'}->{'u'}=cleanToNull($materiau['u']);
            }
            if ((isset($_GET['spec']) && $_GET['spec'] == 'h') || empty($_GET['spec'])) {
                $dataChild->{'spec'}->{'h'}=cleanToNull($materiau['h']);
            }
            $dataChild->{'src'}= (object)[];
            $dataChild->{'src'}->{'name'}=cleanToNull($materiau['source_libelle']);
            $dataChild->{'src'}->{'link'}=cleanToNull($materiau['source_link']);
            $dataChild->{'src'}->{'contrib'}=cleanToNull($materiau['contrib']);
            $dataChild->{'lastupdate'}=cleanToNull($materiau['lastupdate']);
            if ($print == 'tree') {
                $data[$dataChild->{'cath'}][]=$dataChild;
            } else {
                $data[]=$dataChild;
            }
        }
    }
    catch(PDOException $pdo_e){
        echo json_encode(['error' => 'PDO error '.$pdo_e]); 
        http_response_code(500);
        exit();
    }
    catch(Exception $e){
        echo json_encode(['error' => 'Error '.$e]); 
        http_response_code(500);
        exit();
    }

    (isset($_GET['debug'])) && $data['debug']->{'sql'}=$sqlquery;

    // Put cache
    if (!file_put_contents($cache_file, json_encode($data))) {
        echo json_encode(['error' => 'Error write cache']); 
        http_response_code(500);
        exit(12);
    }

    echo json_encode($data); 
    http_response_code(200);
} else {

    // Get cache
    echo file_get_contents($cache_file);
    http_response_code(200);

}
exit();

?>
