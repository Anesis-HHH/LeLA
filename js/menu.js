function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

var menu=function(){
	this.prop={
		dossierList:[],
		genreList:[],
		auteurList:[]
	}

	this.crawler=function(callback){
		// on charge le scope général de la fonction dans une variable afin de ne pas le perdre quand on sera plus profond
		var that=this;
		// on lance l'ajax dans un objet déféré
		$.when(
			$.ajax({
				type: "POST",
				url: "classes/crawler.class.php",
				data: {type:"dossier"},
				dataType:"json"
			}).done(function(data) {
				// console.log(data)
					var tempArr=[];
					for(var b=0; b<data.length;b++){
						tempArr.push(data[b].titre);
					}
					tempArr.sort();
					for(var a=0; a<tempArr.length;a++){
						for(var i=0; i<data.length;i++){
							
							if(data[i].titre==tempArr[a]){
							// console.log(data[i])
								// on pousse tout dans l'objet
								that.prop.dossierList.push(data[i]);
								// on en profite pour constituer les listes de filtre
								var verif=that.prop.auteurList.indexOf(data[i].auteur);
								if(verif<0){
									that.prop.auteurList.push(data[i].auteur);
								}
								verif=that.prop.genreList.indexOf(data[i].genre1);
								if(verif<0){
									that.prop.genreList.push(data[i].genre1);
								}
								verif=that.prop.genreList.indexOf(data[i].genre2);
								if(verif<0){
									if(data[i].genre2!='-')
									that.prop.genreList.push(data[i].genre2);
								}
								verif=that.prop.genreList.indexOf(data[i].genre3);
								if(verif<0){
									if(data[i].genre3!='-')
									that.prop.genreList.push(data[i].genre3);
								}
								
							}
						}
					}
					// console.log(that.prop)
			}).fail(function() {
				$( document ).ajaxError(function( event, request, settings ) {
					  console.log(request,settings);
				});
			})
		).then(function(){
			// puis on execute le callback une fois que c'est terminé
			callback();
			
		});
	
	}
	
	this.composeMenu=function(elem){
		if(typeof elem!="undefined"){
			var filtre=$(elem).text();
			var typeFiltre=$(elem).attr("data-type");
		}
		var html='';
		for(var i=0; i<this.prop.dossierList.length;i++){
			if(typeof elem!="undefined"){
				if(typeFiltre=="genreList"){
					if(filtre==this.prop.dossierList[i].genre1 || filtre==this.prop.dossierList[i].genre2 || filtre==this.prop.dossierList[i].genre3){
						html+='<div class="release blacksmoked"><span class="titre">'+this.prop.dossierList[i].titre+'</span><div class="moreinfo"><span class="fa fa-info"></span></div></div>';
					}
				}
				if(typeFiltre=="auteurList"){
					if(filtre==this.prop.dossierList[i].auteur){
						html+='<div class="release blacksmoked"><span class="titre">'+this.prop.dossierList[i].titre+'</span><div class="moreinfo"><span class="fa fa-info"></span></div></div>';
					}
				}
			}
			else{
				html+='<div class="release blacksmoked"><span class="titre">'+this.prop.dossierList[i].titre+'</span><div class="moreinfo"><span class="fa fa-info"></span></div></div>';
			}
		
			
		}
		$('#boitearelease').html(html);
		$("nav").scrollTop(0);
	}
	
	/******** interface **********/
	this.moreInfoClick=function(titre,img){
		var volumes=this.prop.dossierList;
		for(var i=0; i<volumes.length;i++){
			if(volumes[i].titre==titre){
				var auteur=volumes[i].auteur;
				var genre=volumes[i].genre1;
				var resume=volumes[i].resume;
				if(volumes[i].genre2!="-"){
					genre+=","+volumes[i].genre2;
				}
				
				if(volumes[i].genre3!="-"){
					genre+=","+volumes[i].genre3;
				}
			}	
		}
		
		$("#curtain").prepend('<div id="moreinfbox">'
			+'<div id="closeinfoxbox" class="fa fa-times"></div>'
				+'<p>'
					+'<img class="image" src="volumes/'+titre+'/mini/'+img+'">'
					+'<span class="titre">'+titre+'</span>'
					+'<span class="auteur">'+auteur+'</span>'
					+'<span class="genre">'+genre+'</span>'
					+'<span class="resume">'+nl2br(resume)+'</span>'
				+'</p>'
			+'</div>');
		
		$("#curtain").fadeIn(200);
	}
	
	this.displayFiltre=function(elem){
		if(typeof elem!="undefined"){
			var type=$(elem).attr('data-type');
			var liste=this.prop[type];
			if($("#listefiltre").length>0){
				$("#listefiltre").remove();
			}
			$(elem).after('<div id="listefiltre"></div>');
			for(var i=0;i<liste.length;i++){
				$("#listefiltre").append('<div class="singlefiltre" data-type="'+type+'">'+liste[i]+'</div>');
			}
		}
		else{
			if($("#menufiltre").attr("data-deployed")!='true'){
				$("#menufiltre").append('<div data-type="genreList" class="filtretitre blacksmoked">Par genre</div><div data-type="auteurList" class="filtretitre blacksmoked">Par auteur</div>');
				$("#menufiltre").attr("data-deployed",true);
				$("#menufiltre span").text("Reset filtre");
			}else{
				this.composeMenu();
				$('.filtretitre,#listefiltre').remove();
				$("#menufiltre").removeAttr("data-deployed");
				$("#menufiltre span").text("Filtrer");
			}		
		}
	}
	
	this.displayHelp=function(callback){
		$.post('handreading.html','',function(data){
			$("#curtain").prepend(data);
			callback();
		});
		
	}
	
	this.deploymenu=function(force){
		if($("nav").is('.deployed')){
			$("nav").scrollTop(0);
			$("nav").removeClass('deployed');
		}else{
		$("nav").addClass('deployed');
		}

		if(force==true){
			$("nav").scrollTop(0);
			$("nav").removeClass('deployed');
		}
	}

}