<!--
                         ___     ___
                ___   __|   |   |   |__   ___
               /  /  / /|   |   |   |\ \  \  \
              /  /  / / |   |___|   | \ \  \  \
             /  /__/ /  |           |  \ \__\  \
            /  __   /   |    ___    |   \   __  \
           /  / /  /    |   |   |   |    \  \ \  \
 _________/__/ /__/_____|___|   |___|_____\__\ \__\__________
|############################################################|
|       HARDCORE           HENTAI           HEADQUARTER      |
|############################################################|
|############################################################|
|#########__Lecture en Ligne - POLE DEVELOPPEMENT___#########|

-->
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="UTF-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<title>Lecture en ligne Hentai - HHH</title>
		<meta name="description" content="Lecture en ligne Hentai - HHH"/>
		<meta name="keywords" content="La lecture en ligne HHH"/>
		<meta name="author" content="Lukia" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="shortcut icon" href="favicon.ico">
		<link rel="icon" type="image/x-icon" href="favicon.ico" />
		<link rel="apple-touch-icon" href="apple-touch-icon-precomposed.png">
		<link rel="stylesheet" href="css/css.css?=refresh"></link>
		<link rel="stylesheet" href="css/imghd.css?=refresh"></link>
		<!--<link rel="stylesheet" href="css/small-screen-fix.css?=refresh"></link>-->
		<link rel="stylesheet" href="css/font-awesome.min.css"></link>
		<link href='https://fonts.googleapis.com/css?family=Play' rel='stylesheet' type='text/css'>
		<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
		<script src="js/menu.js?=refresh"></script>
		<script src="js/fonctions.js?=refresh"></script>
		<script src="js/interface.js?=refresh"></script>

	</head>
	<body>
	<div id="curtain"></div>
	<nav>
		<div id="menu">
			<span id="burger" class="fa fa-bars"></span>
		</div>
		<div id="menufiltre" class="menuaction smoked gras"><span>Filtrer</span></div>
		<div class="menuaction smoked" id="menuaide">Lecture au clavier</div>
		<div id="boitearelease">
		</div>
	</nav>
	<div id="loader"><div><img src="img/loader.png"></div></div>
	<div id="theatre"></div>

	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-29875776-7', 'auto');
	  ga('send', 'pageview');

	</script>
	<div id="credit">HHH LEL - Développé par Lukia,Westixy et Albirew</div>
	<?php if(!empty($_GET['r'])){
		echo '<script> getTitle =  "'.$_GET['r'].'"; </script>';
	?>
	<script>
		affichage = new crawler(getTitle);
		affichage.getRelease(function() {
			affichage.displayMiniature(false, "forward");
		});
	</script>
	<?php } ?>
	</body>
</html>
