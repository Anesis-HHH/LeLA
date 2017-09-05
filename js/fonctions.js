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

/*** TOOLBOX ***/

//on récupère les dimensions internes du navigateur.
	var dimensions={
			largeur:window.innerWidth,
			hauteur:window.innerHeight
	}

/*
@param string titreVolume : le titre du volume récupéré au click
@param page : la page de départ de la lecture, par défaut : 0
*/


function crawler(titreVolume,page){
	// les propriétés
	this.prop={
		// id du conteneur principal
		container:"theatre",
		// id du conteneur de miniature
		imgMiniContainer: "imgminicontainer",
		// id du conteneur d'image HD
		imgContainer: "imghdcontainer",
		// id de l'image HD actuel
		imgActual: "imgactual",
		// id du panneau de controle
		controlContainer: "controlcontainer",
		// chemin vers le dossier du fichier
		pathToFile:"volumes/"+titreVolume+"/",
		// le titre du volume
		titreVolume:titreVolume,
		// la limite du nombre d'image HD à précharger au départ
		maxiLimit:3,
		// la limite du nombre de miniatures à afficher
		miniatureLimitToDisplay:24,
		// le nombre de miniature par lignes
		miniaturesByRow:6,
		//la page de départ de la lecture ou des miniature, par défaut : 0
		currentPage : page || 0,
		// le numero de la picture
		currentPicture:0,
		// le nombre de page maximum
		maxPage:0,
		// le nombre de miniature qu'on a affiché depuis le début du tableau
		miniatureDisplayed:0,
		// l'objet qui contiendra toutes les données relatives aux images à afficher
		volumeObject:{
			// on créer deux tableaux distinct, au cas où les miniatures n'aurait pas le meme nom que les images HD. Meme si dans la plupart des cas les noms de fichiers seront les meme (pour un poid différent)
			// le tableau des miniatures
			mini:[],
			// le tableau des HD
			maxi:[],
			// la hauteur de l'images
			height:[]
		},
		// la vue actuellement à l'écran
		actualView:'mini',
	},

	this.loader=function(kill){
	// on manipule le DOM comme un enfoiré
		if(kill==true){

			$("#cadreimghd").removeClass("nooverflow");

			$("#loader").fadeOut(200,function(){
				$("#loader div img").removeClass("animated");
			});
			if(this.prop.actualView=="mini"){
				$("body").removeClass("nooverflow");
				$("#"+this.prop.container).removeClass("blur");
			}
			if(this.prop.actualView=="hd"){
				$("#"+this.prop.imgActual).removeClass("blur");
			}

		}
		else{
			$("html,#imghdcontainer #cadreimghd.zoom").scrollTop(0);
			$("body, #cadreimghd").addClass("nooverflow");
			$("#loader").fadeIn(200,function(){
				$("#loader div img").addClass("animated");
			});
			if(this.prop.actualView=="mini"){
				$("#"+this.prop.container).addClass("blur");
			}
			if(this.prop.actualView=="hd"){
				$("#"+this.prop.imgActual).addClass("blur");
			}
		}

	}

	//la boite de controle
	this.controlBox=function(type){
        // si c'est la boite de controle des pages HD
        if(type=="maxi"){
            var html=//'<div id="'+this.prop.controlContainer+'" class="maxi">'
				'<div id="hdTitre">'+$('#miniatureTitle').text()+'</div>'
				+'<div id="imgname"></div>'
				+'<div id="hdpaginationcontainerleft" data-sens="paginprev" class="paginationbox">'
				+'<div data-type="'+type+'" class="fa fa-chevron-left"></div>'
				+'</div>'
				+'<div id="hdpaginationcontainerright" data-sens="paginnext" class="paginationbox">'
                +'<div data-type="'+type+'" class="fa fa-chevron-right"></div>'
				+'</div>'
				+'<div id="closehd" class="fa fa-times"></div>';
            //+'</div>';
        }
		// si c'est la boite de controle des miniatures
		if(type=="mini"){
			// calcul de la pagination
			var pagesTotal=parseInt(this.prop.volumeObject.mini.length/this.prop.miniatureLimitToDisplay);
			// si le modulo du total du tableau par la limite est supérieur à 0, on rajoute une page pour les images restantes
			if(this.prop.volumeObject.mini.length%this.prop.miniatureLimitToDisplay>0){pagesTotal+=1; this.prop.maxPage=pagesTotal}

			// construction html des boites à pagination
			var pagination="";
			for(var i=0; i<pagesTotal; i++){
				pagination+='<div data-type="'+type+'" data-sens="fixe" class="paginationbox">'+(i+1)+'</div>';
			}
			var html='<div id="'+this.prop.controlContainer+'" class="mini smoked">'
					+'<div data-type="'+type+'" data-sens="paginprev" class="paginationbox fa fa-chevron-left"></div>'
					+pagination
					+'<div data-type="'+type+'" data-sens="paginnext" class="paginationbox fa fa-chevron-right"></div>'

			+'</div>';
		}
		return html;

	}

	// les méthodes
	this.getRelease=function(callback){
		// on charge le scope général de la fonction dans une variable afin de ne pas le perdre quand on sera plus profond
		var that=this;
		// on lance l'ajax dans un objet déféré
		$.when(
			$.ajax({
				type: "POST",
				url: "classes/crawler.class.php",
				data: {titre:titreVolume,type:"projet"},
				dataType:"json"
			}).done(function(data) {
				for(key in data){
					// on trie les tableaux de l'objet
					data[key].sort();
					// on remplit l'objet des images
					for(var i=0; i<data[key].length;i++){
						// on pousse tout dans l'objet
						that.prop.volumeObject[key].push(data[key][i]);
					}
				}
			}).fail(function() {
				$( document ).ajaxError(function( event, request, settings ) {
					  console.log(request,settings);
					  $("#theatre").html('<h1 id="releasenotready">Le volume n\'est pas encore disponible</h1>');
					  //return "noRelease";
				});
			})
		).then(function(){
			// puis on execute le callback une fois que c'est terminé
			callback();
		});
	},

	this.nextPage=function(){
		if(this.prop.currentPage<this.prop.maxPage)
		this.prop.currentPage+=1;
	},

	this.previousPage=function(){
		if(this.prop.currentPage>1)
		this.prop.currentPage-=1;
	},

	// quand on clique sur suivant dans le maxi
	this.nextPict=function(){
		if(this.prop.currentPicture<this.prop.volumeObject.maxi.length-1)
		this.prop.currentPicture++;
	}

	// quand on clique sur précédent dans le maxi
	this.prevPict=function(){
		if(this.prop.currentPicture>0)
		this.prop.currentPicture--;
	}

	this.fixedPage=function(page){

		this.prop.currentPage=page;
	},

	// Gestion des miniature
	this.displayMiniature=function(update,sens){
		var that=this;
		var allLoaded=0;
		// on lance le loader
		this.loader();
		// si c'est la première fois qu'on affiche les miniatures ou qu'on avance dans elles
			// premiere fois
			if(!update){
				// on créer le container
				$("#"+this.prop.container).html('<div class="decomini smoked"></div><div id="miniatureTitle" class="smoked">'+this.prop.titreVolume+'</div><div id="'+this.prop.imgMiniContainer+'"></div>'+this.controlBox("mini")+'<div class="decomini smoked"></div>');
				this.nextPage();
			}

			// si c'est une update, qu'on est à la fin et qu'on retourne en arriere
			if(update && sens=="paginprev" && this.prop.currentPage>0 && this.prop.miniatureDisplayed!=this.prop.miniatureLimitToDisplay){
				//on compte le nombre de miniatures présentes et on les soustrait au nombre de miniatures total, puis on prépare la page précédente
					this.prop.miniatureDisplayed-=$(".miniatures").length;
					this.prop.miniatureDisplayed-=this.prop.miniatureLimitToDisplay;

			}
			$(".paginationbox").removeAttr("style");
			$(".paginationbox:contains("+this.prop.currentPage+")").css("border-bottom","1px solid #EB3C3C");


			var html="";
			// on génère le tableau d'images
			for(var i=this.prop.miniatureLimitToDisplay*(this.prop.currentPage-1);i<this.prop.miniatureLimitToDisplay*this.prop.currentPage;i++){
				// si on a encore des images dans le bouzin
				if(typeof this.prop.volumeObject.mini[i]!="undefined"){
					// on créer le html à insérer, l'index des pages correspond a leur place dans le tableau général
					html+='<div class="miniatures"><img data-index="'+i+'" src="'+this.prop.pathToFile+'mini/'+this.prop.volumeObject.mini[i]+'"/></div>';
					this.prop.miniatureDisplayed+=1;
				}else{
					break;
				}

			}
			// si on affiche pour la première fois, qu'on revient pas en arrière et qu'on est pas arrivé à la fin ou si c'est une mise à jour du contenu
			if(update && this.prop.currentPage>0 && this.prop.currentPage<=this.prop.maxPage && html.length>0|| !update){
				$("#"+this.prop.imgMiniContainer).html(html);
			}
			// on centre la pagination
			$("#"+this.prop.controlContainer+".mini").css("left",($("#"+this.prop.container).width()-$("#"+this.prop.controlContainer+".mini").width())/2-70);
			$("#miniatureTitle").css("left",($("#"+this.prop.container).width()-$("#miniatureTitle").width())/2-70);

			$(".miniatures img").load(function(){
				allLoaded++;
				// si toutes les images ont été chargées
				if(allLoaded==$(".miniatures").length){
					// on tue le loader
					that.loader(true);
				}
			});
			// console.log(">>>>>>> \r\n prop.miniatureDisplayed : "+this.prop.miniatureDisplayed, "currentPage : "+this.prop.currentPage);
	}

	this.paginationControl=function(elem){
		var sens=elem.attr("data-sens");
		var type=elem.attr("data-type");
		var page=parseInt(elem.text());
		if(sens=="paginnext"){
			if(type=="mini"){
				this.nextPage();
				// on envoi le steak
				this.displayMiniature(true, sens);
			}else{
				this.nextPict();
				// on affiche de quoi sbranler
				this.displayHd();
			}

		}
		if(sens=="paginprev"){
			if(type=="mini"){
				this.previousPage();
				// on envoi le steak
				this.displayMiniature(true, sens);
			}else{
				this.prevPict();
				// on affiche de quoi sbranler
				this.displayHd();
			}
		}
		if(sens=="fixe"){
			this.fixedPage(page);
			// on envoi le steak
			this.displayMiniature(true, sens);
		}

	}

	this.giveFileName=function(fileName){
		$("#imgname").text(fileName);

	}

	this.openHd=function(){
		// on génère la div conteneur
		$("#"+this.prop.container).before('<div id="'+this.prop.imgContainer+'"></div>');
		// on cache les miniatures
		$("#"+this.prop.container).addClass("blur");
		// on cree le recepteur de l'image actuel
		$("#"+this.prop.imgContainer).html('<div id="cadreimghd"><img id="'+this.prop.imgActual+'" src=""/></div>');
		// on cree les recepteur des images en preload
		$("#"+this.prop.imgContainer).append('<div id="hdPreloadContainer">'
												+'<img class="imgpreload" src=""/>'
												+'<img class="imgpreload" src=""/>'
												+'<img class="imgpreload" src=""/>'
											+'</div>');
		// on ajoute le controlbox
		$("#"+this.prop.imgContainer).prepend(this.controlBox("maxi"));

		// on dit que la vue actuel est en hd
		this.prop.actualView='hd';

		// sauce this
		this.displayHd();
	}

	// lors du click sur la miniature
    this.onMiniatureClick=function(elem){
        var index = elem.attr("data-index");
		this.prop.currentPicture=index;

		this.openHd();

    }

	this.onCloseHd=function(elem){
		// on supprime l'overlay hd
		$("#"+this.prop.imgContainer).remove();
		// on réaffiche le theatre de base
		$("#"+this.prop.container).removeClass("blur");
		$("body").removeClass("nooverflow");
		// on dit que l'on passe en mode mini
		this.prop.actualView='mini';
	}

	this.onExitUrgence=function(){
		$("#exitUrgence, #iframe_urg").css("display","none");
	}

	this.displayUrgence=function(){
		$("#exitUrgence").css("display","block");
		$("#iframe_urg").css("display","block");
	}

    this.onHdClick=function(){
        // # CLICK SUR IMAGE HD
        // switch d'etat entre le zoom ou l'etat normal
        if($("#"+this.prop.imgContainer).hasClass("zoom")){
            // on supprime la classe zoom aux deux élements
            $("#"+this.prop.imgContainer).removeClass("zoom");
        }
        else{
            // on affecte la classe zoom aux deux élements
            $("#"+this.prop.imgContainer).addClass("zoom");
        }
    }

	this.displayHd=function(){
		// on reset le scroll
		$("#imghdcontainer #cadreimghd.zoom").scrollTop(0);
		// on lance le loader
		this.loader();
        // on remplit le container par le haut car position absolute des images
        $("#"+this.prop.imgActual).attr("src",this.prop.pathToFile+this.prop.volumeObject.maxi[this.prop.currentPicture]);
		// on change le nom  de la page
		$("#imgname").html(this.prop.volumeObject.maxi[this.prop.currentPicture]);

		// on active la miniature correspondante
		this.updateActiveMiniature();

		// on cree un alias pour this
		var that=this;
		// on charge deux images après et une avant
		$("#"+this.prop.imgActual).load(function(){
			that.imgHdScroll("top");
			// on tue le loader
			that.loader(true);
            // on défini l'ensemble d'éléments preload
            var preloadElems = $("#hdPreloadContainer .imgpreload");
			// preload de l'image suivante si elle existe
			preloadElems.eq(0).attr("src",function(){
					if(parseInt(that.prop.currentPicture)<that.prop.volumeObject.maxi.length-1){
						return that.prop.pathToFile+that.prop.volumeObject.maxi[+that.prop.currentPicture+1];
					}
				}
			);
			// on attend que l'image suivante sois load avant de load les prochaines
			preloadElems.eq(0).load(function(){
				// preload de l'image suivante si elle existe
				preloadElems.eq(1).attr("src",function(){
						if(parseInt(that.prop.currentPicture)<that.prop.volumeObject.maxi.length-2){
							return that.prop.pathToFile+that.prop.volumeObject.maxi[+that.prop.currentPicture+2];
						}
					}
				);
				// preload de l'image avant si elle existe
				preloadElems.eq(2).attr("src",function(){
						if(parseInt(that.prop.currentPicture)>0){
							return that.prop.pathToFile+that.prop.volumeObject.maxi[+that.prop.currentPicture-1];
						}
					}
				);
			});
		});
	}

	// sert a déplacer limage activée
	this.updateActiveMiniature=function(){
		var tempCurrentPage=Math.floor(this.prop.currentPicture/this.prop.miniatureLimitToDisplay+1);
		// on change de page des miniatures
		if (this.prop.currentPage!=tempCurrentPage){
			this.fixedPage(Math.floor(this.prop.currentPicture/this.prop.miniatureLimitToDisplay)+1);
			this.displayMiniature(true, "fixe");
		}
		// on active la miniature
		$("#"+this.prop.imgMiniContainer+" img.currentimage").removeClass("currentimage");
		$("#"+this.prop.imgMiniContainer+" img[data-index="+this.prop.currentPicture+"]").addClass("currentimage");
	}

	// pour déplacer le scroll de l'image hd
	// direction up, down (et top pour le déplacer tout en haut
	this.imgHdScroll=function(direction,value){
		// si value n'existe pas alors, on lui attribue 10
		if(typeof value=="undefined") value=20;
		var cadre=$("#cadreimghd");
		// pour scroll tout en haut
		if(direction=="top"){
			cadre.scrollTop(0);
		return;}

		var upOrDown=0;
		if(direction=="up")upOrDown=-1;
		if(direction=="down")upOrDown=+1;

		// on déplace le scroll
		cadre.scrollTop(+cadre.get(0).scrollTop+(value*upOrDown));
	}
/******************************** KEYBOARD READING  *******************************

	escape*2 -> entre en mode URGENCE / sortir du mode URGENCE

	Sur miniature
		right -> déplacement vers la droite de l'image sélectionne
		left -> déplacement vers la gauche de l'image sélectionne
		up -> déplacement vers le haut de l'image sélectionne
		down -> déplacement vers le haut de l'image sélectionne
		space -> déplacement d'une page(+1)  de l'image sélectionne
		shift+space -> déplacement d'une page(-1) de l'image sélectionne
		enter -> ouverture de l'image HD sélectionnée

	Sur HD
		right -> page suivante
		left -> page précédente
		space -> zoom/dé-zoom
		up -> monter dans le zoom de l'image
		down -> descendre dans le zoom de l'image
		escape -> sortir de l'image HD (close hd)

*********************************************************************************/
	// définition dest touche de controle
	this.keys={
		left:[65,81,113,97,37], // q,a,<
		right:[68,100,39], // d,>
		up:[87,90,119,122,38], // w,z,^
		down:[83,115,40], // s,`down`
		space:[32], // `space`
		enter:[13,70,102],  // `enter`, f
		escape:[27,101,69], // `escape`,e

		// la dernière fois que la touche echap a été appuyée
		lastEscapeTimeStamp:0,

		// savoir si l'évenement à une coresspondance dans la cle transmise
		equals:function(key,keyEvent){
			for(var i=0; i<key.length ; i++){
				if(keyEvent.which==key[i]||keyEvent.keyCode==key[i]||keyEvent.charCode==key[i]){
					return true;
				}
			}
			return false;
		}
	};

	this.keyboardController=function(keyEvent){
		var that=this;
		if(this.keys.equals(this.keys.escape,keyEvent)){
			// et si la dernière elle a été répétée a moins de 0.6s
			if(keyEvent.timeStamp-this.keys.lastEscapeTimeStamp<600){
				// on test si l'élement existe
				if($("#exitUrgence").css("display")==="block"){
					this.onExitUrgence();
				}
				else{
					this.displayUrgence();
					//event sortir du mode URGENCE
					var that=this;
					$("#exitUrgence").on("click",function(){
						that.onExitUrgence();
					});
				}
			return;}
			this.keys.lastEscapeTimeStamp=keyEvent.timeStamp;
		}
		if(this.prop.actualView=="mini"){
			// quand on est en miniature
			if (this.keys.equals(this.keys.left,keyEvent)){

				this.prevPict();
				// on déplace la miniature activee
				this.updateActiveMiniature();

			}
			if (this.keys.equals(this.keys.right,keyEvent)){

				this.nextPict();
				// on déplace la miniature activee
				this.updateActiveMiniature();
			}
			if (this.keys.equals(this.keys.up,keyEvent)){
				// changement de ligne
				for(var i=0;i<this.prop.miniaturesByRow;i++){
					this.prevPict();
				}
				this.updateActiveMiniature();
			}
			if (this.keys.equals(this.keys.down,keyEvent)){
				// changement de ligne
				for(var i=0;i<this.prop.miniaturesByRow;i++){
					this.nextPict();
				}
				this.updateActiveMiniature();
			}
			if (this.keys.equals(this.keys.space,keyEvent)){
				// Changement de page
				if(keyEvent.shiftKey){
					for(var i=0;i<this.prop.miniatureLimitToDisplay;i++){
						this.prevPict();
					}
					this.updateActiveMiniature();
				return;}
				// changement de page
				for(var i=0;i<this.prop.miniatureLimitToDisplay;i++){
					this.nextPict();
				}
				this.updateActiveMiniature();
			}
			if (this.keys.equals(this.keys.enter,keyEvent)){
				// on ouvre la hd
				this.openHd();
			}
		}
		if(this.prop.actualView=="hd"){
			// quand on est en HD
			if (this.keys.equals(this.keys.left,keyEvent)){
				// on passe à la picture précédente
				this.prevPict();
				this.displayHd();
			}
			if (this.keys.equals(this.keys.right,keyEvent)){
				// on passe à la picture Suivante
				this.nextPict();
				this.displayHd();
			}
			if (this.keys.equals(this.keys.up,keyEvent)){
				// gestion du scroll vers le haut
				this.imgHdScroll("up");
			}
			if (this.keys.equals(this.keys.down,keyEvent)){
				// gestion du scroll vers le bas
				this.imgHdScroll("down");
			}
			if (this.keys.equals(this.keys.space,keyEvent)){
				// zoom / dezoom de l'image hd
				this.onHdClick();
			}
			if (this.keys.equals(this.keys.escape,keyEvent)){
				// on ferme la fenetre hd
				this.onCloseHd();
			}

		}
	}
}
