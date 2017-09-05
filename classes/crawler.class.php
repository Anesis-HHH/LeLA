<?php
require_once('../../include/connexionBdd.php');

// requete d'importation des intégrales
$sql="
	select
	proj.titre AS titre,
	dl.dl AS lien
	from projets proj
	inner join download dl on proj.titre=dl.titre
	where proj.id > 0 and dl.numero_chapitre='integrale'
	order by proj.titre
";

function doSql($request=""){
	$retourArray=[];
	global $bdd;
	if(!empty($request)){
		$req=$bdd->prepare($request);
		$req->execute();
		while($retour=$req->fetch(PDO::FETCH_ASSOC)){
			$retourArray[]=$retour;
		
		}
	}
	$req->closeCursor();
	return $retourArray;
}
// echo '<pre>';
// print_r(doSql($sql));
// echo '</pre>';

//crawler de dossier
if(isset($_POST['type']) && $_POST['type']=='dossier'){
	$path='../volumes/';
	$titleArray=[];
	if (is_dir($path)) {
		if ($dossier = opendir($path)) {
			while (($file = readdir($dossier)) !== false) {
				if($file!='.' && $file!='..'){
					$file=str_replace("'","''",$file);
					$titleArray['titre'][]=$file;			
				}
			}
			$inSql="'".implode("','",$titleArray['titre'])."'";
			$titleArray['inSql']=$inSql;
		
			$data=doSql("select
						titre,
						genre1,
						genre2,
						genre3,
						auteur,
						resume
						from projets
					where titre in($inSql)"); 
		}

		closedir($dossier);
		// $titleArray['inSql']=$inSql;
		// echo json_encode($titleArray);
		echo json_encode($data);
	}
}

// crawler de projet
if(isset($_POST['type']) && $_POST['type']=='projet'){
	$path='../volumes/'.$_POST['titre'];
	$imgArray=['mini'=>[],'maxi'=>[]];
	// Ouvre un dossier bien connu, et liste tous les fichiers
	if (is_dir($path)) {
		if ($dossier = opendir($path)) {
			// on remplit le tableau avec les image HD
			while (($file = readdir($dossier)) !== false) {
				if($file!='.' && $file!='..' && $file!='mini'){
					$imgArray['maxi'][]=$file;
					// on récupère la hauteur
					$tempSize=getimagesize($path.'/'.$file);
					$imgArray['height'][]=$tempSize[1];

				}
				// quand on tombe sur le dossier des miniature
				elseif($file!='.' && $file!='..' && $file=='mini'){
					// on l'ouvre
					$dossiermini = opendir($path.'/'.$file);
					// et on remplit le tableau avec les miniatures
					while (($file = readdir($dossiermini)) !== false) {
						if($file!='.' && $file!='..'){
							$imgArray['mini'][]=$file;
						}
					}
					closedir($dossiermini);
				}
			}
			closedir($dossier);
			echo json_encode($imgArray);
		}
	}else{
		echo 'le dossier spécifié n\'existe pas';
	}
}


?>
