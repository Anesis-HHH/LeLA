/*
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

*/

//PRELOAD
$(document).ready(function() {
    // preload de la frame d'urgence
    $("body").prepend('<iframe id="iframe_urg" style="display:none;position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:1000;border:0px;" src="#tmp"></iframe>');
    $("body").prepend('<div id="exitUrgence" style="display:none;">EXIT</div>');
    setTimeout(function(){
      $("#iframe_urg").attr("src","https://fr.wikipedia.org/wiki/Sortie_de_secours");
    }, 5);
});

$(window).load(function() {
    var lelMenu = new menu();
    lelMenu.crawler(function() {
        lelMenu.composeMenu();
    });





    $("body").on("click", "#boitearelease .moreinfo", function(e) {
        e.stopPropagation();
        var title = $(this).prev(".titre").text();
        var tempaff = new crawler(title);
        tempaff.getRelease(function() {
            var img = tempaff.prop.volumeObject.mini[0];
            lelMenu.moreInfoClick(title, img);
            $('#closeinfoxbox').click(function() {
                $("#curtain").fadeOut(200, function() {
                    $("#moreinfbox").remove();
                });
            });
        });
    });

    $("body").on("click", "#menufiltre #listefiltre .singlefiltre", function(e) {
		e.stopPropagation();
        lelMenu.composeMenu(this);
    });
    $("body").on("click", "#menuaide", function() {
        lelMenu.displayHelp(function(){
			$("#curtain").fadeIn(200);
			$('#closehandreading').click(function() {
                $("#curtain").fadeOut(200, function() {
                    $("#handreading").remove();
                });
            });
		});
    });
    $("body").on("click", "#menufiltre .filtretitre", function(e) {
		e.stopPropagation();
        lelMenu.displayFiltre(this);
    });
    $("body").on("click", "#menu", function() {
        lelMenu.deploymenu();
    });

    $("body").on("click", "#menufiltre", function() {
        lelMenu.displayFiltre();
    });

    $("body").on("click", "#closefiltre", function() {
        lelMenu.hideFiltre();
    });

    $("body").on("click", "#boitearelease .release", function(e) {
		e.stopPropagation();
        var title = $(".titre", this).text();
		lelMenu.deploymenu(true);
        affichage = new crawler(title);
        affichage.getRelease(function() {
            affichage.displayMiniature(false, "forward");
        });
    });

    $("body").on("click", ".paginationbox", function() {
        affichage.paginationControl($(this));
    });
    $("body").on("click", ".miniatures img", function() {
        affichage.onMiniatureClick($(this));
    });

    // action de cliquer sur le bouton de fermeture
    $("body").on("click", "#closehd", function() {
        affichage.onCloseHd($(this));
    });

    // quand on clique sur l'image
    $("body").on("click", "#cadreimghd img", function() {
        affichage.onHdClick();
    });

	// gestion de la navigation au clavier
	$(document).on("keydown",function(event){
		if(typeof affichage !== "undefined")
		affichage.keyboardController(event);

	});

    /*// fix pour les écrans plus petits
    $(window).on("resize",function(){
    if ($(window).width()<870)
    		$("#controlcontainer.mini").css("left","0");
    	else
    		$("#controlcontainer.mini").css("left",($("#theatre").width()-$("#controlcontainer.mini").width())/2-30);
    });*/


}); //end of DL
