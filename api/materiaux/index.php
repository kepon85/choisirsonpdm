<?php
include('./config.php');

// Debug
(empty($_GET['debug'])) && header('Content-Type: application/json; charset=utf-8');  

// DB connexion
try {
    $db = new PDO('mysql:host='.$config['mysql']['hostname'].';dbname='.$config['mysql']['db'].'', $config['mysql']['username'], $config['mysql']['password'],
        array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
} catch (PDOException $e) {
    exit('Database connexion fail : ' . $e->getMessage());
}

// Check param
$print=false;
if (isset($_GET['print'])) {
    if (preg_match_all('/^(tree)$/', $_GET['print'])) {
        $print=$_GET['print'];
    } else {
        echo json_encode(['error' => 'Print format error']); 
        exit();
    }
}
if (isset($_GET['lang'])) {
    if (preg_match_all('/^[a-z]{2}$/', $_GET['lang'])) {
        $lang=$_GET['lang'];
    } else {
        echo json_encode(['error' => 'Lang format error']); 
        exit();
    }
}
$src='';
if (isset($_GET['src'])) {
    if (preg_match_all('/^(acermi|ParcEcoHabitat)$/', $_GET['src'])) {
        $src="AND source_libelle = '".addslashes($_GET['src'])."'";
    } else {
        echo json_encode(['error' => 'Source inconnu']); 
        exit();
    }
}
$spec='';
if (isset($_GET['spec'])) {
    if (preg_match_all('/^(lambda|p|u|c|h)$/', $_GET['spec'])) {
        $spec="AND ".$_GET['spec']." != ''";
    } else {
        echo json_encode(['error' => 'Spec inconnu']); 
        exit();
    }
}


// Init Data
$data=[];

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
    ORDER BY `materiaux`.`generique`  DESC, materiaux.libelle ASC
";

//$data['debug']->{'sql'}=$sqlquery;


function cleanToNull($data) {
    if ($data == '') {
        return null;
    } else {
        return $data;
    }
}

try{ 
    $param = array('lang' => $lang);
    $req=$db->prepare($sqlquery);
    $req->execute($param);
    $materiaux = $req->fetchAll();
    //isset($_GET['debug']) && print_r($materiaux);
    foreach ($materiaux as $materiau) {
        $dataChild = new stdClass();
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
        $dataChild->{'src'}->{'name'}=cleanToNull($materiau['source_libelle']);
        $dataChild->{'src'}->{'link'}=cleanToNull($materiau['source_link']);
        $dataChild->{'src'}->{'contrib'}=cleanToNull($materiau['contrib']);
        $dataChild->{'lastupdate'}=cleanToNull($materiau['lastupdate']);
        $data[]=$dataChild;
    }
}
catch(PDOException $pdo_e){
    echo json_encode(['error' => 'PDO error '.$pdo_e]); 
    exit();
}
catch(Exception $e){
    echo json_encode(['error' => 'Error '.$e]); 
    exit();
}

if ($print == 'tree') {
    $dataTree=[];


    $param = array('lang' => $lang);
    $req=$db->prepare("
        SELECT cath.id id, cath.libelle libelle, trad_cath.libelle trad_libelle, parent_id
        FROM `cath`
        LEFT JOIN trad_cath on cath.id = trad_cath.cath_id AND  trad_cath.lang = :lang
        ORDER BY trad_libelle ASC, libelle ASC
        ");
    $req->execute($param);
    $caths = $req->fetchAll();
    // Catégorie principal
    foreach ($caths as $cath) {
        if ($cath['parent_id'] == null) {
            if ($cath['trad_libelle'] != null)  {
                $cath_libelle=$cath['trad_libelle'];
            } else {
                $cath_libelle=$cath['libelle'];
            }
            // Sous catégorie
            foreach ($caths as $subcath) {
                if ($subcath['parent_id'] == $cath['id']) {
                    if ($subcath['trad_libelle'] != null)  {
                        $dataTree[$cath_libelle]->{$subcath['trad_libelle']}->{'libelle'}=$subcath['trad_libelle'];
                    } else {
                        $dataTree[$cath_libelle]->{$subcath['libelle']}->{'libelle'}=$subcath['libelle'];
                    }
                }
            }
            // Liste les matéraixu de la cathégorie principal
            foreach ($materiaux as $materiau) {
                if ($materiau['cath_id'] == $cath['id']) {
                    if ($materiau['trad_libelle'] != null)  {
                        $dataTree[$cath_libelle]->{$materiau['id']}->{'libelle'}=$materiau['trad_libelle'];
                    } else {
                        $dataTree[$cath_libelle]->{$materiau['id']}->{'libelle'}=$materiau['libelle'];
                    }
                    if ((isset($_GET['spec']) && $_GET['spec'] == 'lambda') || empty($_GET['spec'])) {
                        $dataTree[$cath_libelle]->{$materiau['id']}->{'spec'}->{'lambda'}=cleanToNull($materiau['lambda']);
                    }
                }
            }
            
        }
    }

    echo json_encode($dataTree); 
} else {
    echo json_encode($data); 
}
exit();

?>