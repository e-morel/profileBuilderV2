'use strict'

//Méthode pour initialiser l'API cozy-client-js et la Cozy-Bar
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('[role=application]')
  cozy.client.init({
    cozyURL: '//' + app.dataset.cozyDomain,
    token: app.dataset.token,
    version: 2
  })/*
  cozy.bar.init({
    appName: app.dataset.appName,
    lang: app.dataset.locale
  })*/
  updateDocumentList();
})

//Support à modifier en fonction de celui calculé sur le jeu de données
var SUPPORT = 1;

//Fonction executant les requêtes auprès de la BDD
async function updateDocumentList(){
	const userByNum = await cozy.client.data.defineIndex('org.emorel.user',['numero']);
	const user = await cozy.client.data.query(userByNum, {
	  "selector": {numero: 5},
	  "fields": ["_id", "display_name", "location", "last_access_date", "creation_date", "reputation", "views", "up_votes", "down_votes"]
	})
	//Données concernant les users
	renderUser(user[0]);
	
	const allPosts = await cozy.client.data.defineIndex('org.emorel.post',['_id']);
	const posts = await cozy.client.data.query(allPosts, {
	  "selector": {
		"_id": {"$gte": null}
	    }
	})
	//Données sur les posts
	renderPosts(posts);
	serieTemporelle(posts);
}

//Requête sur les données concernant les sushis
async function sushis(){
	var id=document.querySelector('.send').value;
	const questionnaireByNum = await cozy.client.data.defineIndex('org.emorel.questionnaire',['numero']);
	const questionnaires = await cozy.client.data.query(questionnaireByNum, {
		"selector": {
			"numero": Number(id)
		}
	})
	//Vérification si l'ID saisi existe
	if(questionnaires.length==0){
		var HTML = "L'identifiant saisi ne correspond à personne dans la base";
		document.getElementById("infosSushis").innerHTML = HTML;
		document.getElementById("profileSuite").innerHTML = "";
		document.getElementById("prefsSushisSetA").innerHTML = "";
		document.getElementById("prefsSushisSetB").innerHTML = "";
	}else{
		renderQuestionnaire(questionnaires);
	}
}

//Fonction d'affichage des infos principales sur profil StackExchange
var HTML = '';
function renderUser(user){
	HTML = '<img src="img/tete.png" width="90" height="90"><br/>';
	HTML += '<b>Pseudo : </b>' + user.display_name + '<br/>';
	HTML += '<b>Habitation : </b>' + user.location + '<br/>';
	var HTML2 = '<b>Dernière connexion : </b>' + toDate(user.last_access_date) + '<br/>';
	HTML2 += '<b>Création de compte : </b>' + toDate(user.creation_date) + '<br/>';
	HTML2 += '<b>Réputation : </b>' + user.reputation + '<br/>';
	HTML2 += '<img src="img/eye.png" width="30" height="30"> : ' + user.views;
	HTML2 += ' <img src="img/air.png" width="30" height="30"> : ' + user.up_votes;
	HTML2 += ' <img src="img/bas.png" width="30" height="30"> : ' + user.down_votes + '<br/>';
	document.getElementById("profile").innerHTML += HTML;
	document.getElementById("infos").innerHTML += HTML2;
}

//Calcul des préférences sur les tags
function renderPosts(posts){
	var tags= new Array();
	//Extraction des tags
	for (var m = 0; m < posts.length; m++) {
		if(posts[m].tags!=null){
			var temp = posts[m].tags.split('<');
			for(var n = 1; n < temp.length; n++){
				temp[n] = temp[n].substring(0,temp[n].length-1);
                    		tags.push(temp[n]);
			}
		}
	}
	var counts = new Array();
	//Comptage des occurences des tags
    tags.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var temp = counts;
    tags= new Array();
    //Application du support
    for(var n in counts){
		if(counts[n]>SUPPORT){
			tags.push(n);
		}
	}
	//Ordonnancement des tags
    tags.sort(function(a,b){if(counts[a]<2){return -1;}else{return counts[a] - counts[b]}});
    tags.reverse();
    var HTML1 = 'Sujets plus fréquents : ';
	var fois = [];
	var vues=[];
	//Extraction du nombre de vues pour le dégradé
	for(var m = 0; m < tags.length; m++) { vues[m]=0;}
	for(var k = 0; k < tags.length; k++) {
		for (var m = 0; m < posts.length; m++) {
			if(posts[m].tags!=null){
				if(posts[m].tags.search(tags[k])!=-1){
					vues[k] +=parseInt(posts[m].view_count);
				}
			}
		}
	}
	var tmp="";
	//Modification des tags pour esthétisme
	for(var n = 0; n < tags.length; n++) {
		fois[n]=temp[tags[n]];
		tags[n]=tags[n][0].toUpperCase() + tags[n].substring(1);
		tmp=tags[n].split("-");
		tags[n]=tmp[0]+"_"+tmp[1];
	}
	//Création et implémentation du graphe Graphviz
	var HTML="digraph {";
	var preprevious=[];
	var previous=[tags[0]];
	/*fois[0]=11;
	fois[1]=11;*/
	var color=250;
	var diff=5;
	//Calcul de la couleur de fond
	HTML+=tags[0]+'[color="'+hslToHex(parseInt(color-(vues[0]/diff)),80,60)+'",style=filled,fontname = "Ubuntu"];';
	for(var n = 1; n < tags.length; n++) {
		HTML+=tags[n]+'[color="'+hslToHex(parseInt(color-(vues[n]/diff)),80,60)+'",style=filled,fontname = "Ubuntu"];';
		//Création des liens en fonction des ex aequo
		if(fois[n]<fois[n-1]){
			for(var c = 0; c < previous.length; c++) {
					HTML+=previous[c]+" -> "+tags[n]+";";
			}
			preprevious=previous;
			previous=[tags[n]];
		}else{
			if(preprevious!=[]){
				for(var c = 0; c < preprevious.length; c++) {
						HTML+=preprevious[c]+" -> "+tags[n]+";";
				}
			}
			previous.push(tags[n]);
		}
	}
	for(var h = 0; h < previous.length; h++) {
		if(HTML.search(previous[h])==-1){
			HTML+=previous[h]+";";
		}
	}
	HTML+="}";
	document.getElementById("prefs").innerHTML += Viz(HTML);
	document.getElementById("prefs").innerHTML += "</br>Dégradé de couleur (vues): + rouge -> bleu -";
}

//Exploitation des informations des questionnaires Sushis
async function renderQuestionnaire(questionnaire){
	var profil = new Object();
	var profilPrefA = new Object();
	var profilPrefB = new Object();
	var personne = questionnaire[0];
	//construction du profil
	if (JSON.stringify(personne.genre)>0){
		profil["sexe"]="feminin";
	}else{
		profil["sexe"]="masculin";
	}
		    
	if (JSON.stringify(personne.age)<1){
		profil["age"]="adolescent 15-19 ans";
	}else if (JSON.stringify(personne.age)<2){
		profil["age"]="jeune 20-29 ans";
	}else if (JSON.stringify(personne.age)<3){
		profil["age"]="trentenaire 30-39 ans";
	}else if (JSON.stringify(personne.age)<4){
		profil["age"]="quadragenaire 40-49 ans";
	}else if (JSON.stringify(personne.age)<5){
		profil["age"]="quiquagenaire 50-59 ans";
	}else if (JSON.stringify(personne.age)<6){
		profil["age"]="retraité 60 ans et plus";
	}
	    
	if (JSON.stringify(personne.temps)<343){
		profil["rapidite"]="rapide"+" "+JSON.stringify(personne.temps)+" secondes";
	}else if (343<=JSON.stringify(personne.temps) && JSON.stringify(personne.temps)<521){
		profil["rapidite"]="modéré"+" "+JSON.stringify(personne.temps)+" secondes";
	}else if (521<=JSON.stringify(personne.temps) && JSON.stringify(personne.temps)<699){
		profil["rapidite"]="lent"+" "+JSON.stringify(personne.temps)+" secondes";
	}else if (699<=JSON.stringify(personne.temps)){
		profil["rapidite"]="très lent"+" "+JSON.stringify(personne.temps)+" secondes";
	}
		        
	profil["habitation"]= await getAdresseATM(personne);
		    
	if (JSON.stringify(personne.changement)>0){
		profil["origine"]= await getAdresse(personne);
	}else{
		profil["origine"]="Même lieu d'habitation qu'actuellement";
	}
		    
	profilPrefA = await getSetA(personne);
	profilPrefB = await getSetB(personne);
	    
	//Affichage des préférences
	var HTML1 = '<ol class="center">'
	+ '<li>'+ profilPrefA[0]+ '</li>'
    + '<li>' + profilPrefA[1]+'</li>'
    + '<li>'+ profilPrefA[2]+'</li>';
	var HTML4 = '<ol class="center">'
	+ '<li>'+ profilPrefB[0]+ '</li>'
    + '<li>' + profilPrefB[1]+'</li>'
    + '<li>'+ profilPrefB[2]+'</li>';
	var HTML3 = '<b>Identifiant :</b> ' + personne.numero + '</br>'
	+   '<b>Rapidité réponse :</b> ' + profil["rapidite"] + '</br>'
	+   '<b>Habitation (obsolète) :</b> ' + profil["habitation"] + '</br>'
	+   "<b>Habitation d'enfance :</b> " + profil["origine"] + '</br>';
	var HTML2 = '<b>Sexe :</b> ' + profil["sexe"] + '</br>'
	+   '<b>Age :</b> ' + profil["age"] + '</br>';
	document.getElementById("prefsSushisSetA").innerHTML = HTML1;
	document.getElementById("prefsSushisSetB").innerHTML = HTML4;
	document.getElementById("profile").innerHTML = HTML+HTML2;
	document.getElementById("infosSushis").innerHTML = HTML3;
}

//Détection des pics d'activité
function serieTemporelle(posts){
	var moy=0;
	var ecartT=0;
	var nbTags=0;
	var tab= new Array();
	var vues= new Array();
	var date;
	var nbD= new Array();
	for (var m = 0; m < posts.length; m++) {
		if(posts[m].tags!=null){
			var date=posts[m].CreationDate.split("-");
			var date='"'+date[0].substring(2,date[0].length)+date[1]+'"';
			tab[date]= tab[date] || new Array();
			nbD[date]= nbD[date] || 0;
			var temp = posts[m].tags.split('<');
			for(var n = 1; n < temp.length; n++){
				temp[n] = temp[n].substring(0,temp[n].length-1);
				vues[temp[n]]=vues[temp[n]] || 0;
				vues[temp[n]]+=parseInt(posts[m].view_count);
                tab[date].push(temp[n]);
                nbD[date]++;
                nbTags++;
			}
		}
	}
	var nbPeriode=0;
	for(var date in tab){
		nbPeriode++;
	}
	moy=nbTags/nbPeriode;
	var cumul=0;
	for(var date in tab){
		cumul+=Math.pow(nbD[date]-moy,2);
	}
	ecartT=Math.sqrt(cumul/nbPeriode);
	for(var date in tab){
		if(tab[date].length>moy+ecartT){
			var pic= "haut";
			calcul_prefs(tab[date],vues,date,pic);
		}else if(tab[date].length<moy-ecartT){
			var pic= "bas";
			calcul_prefs(tab[date],vues,date,pic);
		}
	}
}

//Calcul des préférences en fonction des pics d'activité
function calcul_prefs(tags, views,date,pic){
	var id="prefs"+date.substring(1,5);
	document.getElementById("dates").innerHTML +='<li><a href="#">20'+date.substring(1,3)+'-'+date.substring(3,5)+'</a></li>';
	document.getElementById("issues").innerHTML +='<li id="'+id+'"><p class="center" id="'+id+'"></p></li>';	
	var counts = new Array();
    tags.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    var temp = counts;
    if(pic=="haut"){
		tags= new Array();
		for(var n in counts){
			if(counts[n]>SUPPORT){
				tags.push(n);
			}
		}
	}
    tags.sort(function(a,b){if(counts[a]<2){return -1;}else{return counts[a] - counts[b]}});
    tags.reverse();
    var HTML1 = 'Sujets plus fréquents : ';
	var fois = [];
	var vues=[];
	for(var m = 0; m < tags.length; m++) { vues[m]=0;}
	for(var k = 0; k < tags.length; k++) {
		vues[k]=views[tags[k]];
	}
	var tmp="";
	for(var n = 0; n < tags.length; n++) {
		fois[n]=temp[tags[n]];
		tags[n]=tags[n][0].toUpperCase() + tags[n].substring(1);
		tmp=tags[n].split("-");
		tags[n]=tmp[0]+"_"+tmp[1];
	}
	var HTML="digraph {";
	var preprevious=[];
	var previous=[tags[0]];
	/*fois[0]=11;
	fois[1]=11;*/
	var color=250;
	var diff=5;
	HTML+=tags[0]+'[color="'+hslToHex(parseInt(color-(vues[0]/diff)),80,60)+'",style=filled,fontname = "Ubuntu"];';
	for(var n = 1; n < tags.length; n++) {
		HTML+=tags[n]+'[color="'+hslToHex(parseInt(color-(vues[n]/diff)),80,60)+'",style=filled,fontname = "Ubuntu"];';
		if(fois[n]<fois[n-1]){
			for(var c = 0; c < previous.length; c++) {
					HTML+=previous[c]+" -> "+tags[n]+";";
			}
			preprevious=previous;
			previous=[tags[n]];
		}else{
			if(preprevious!=[]){
				for(var c = 0; c < preprevious.length; c++) {
						HTML+=preprevious[c]+" -> "+tags[n]+";";
				}
			}
			previous.push(tags[n]);
		}
	}
	for(var h = 0; h < previous.length; h++) {
		if(HTML.search(previous[h])==-1){
			HTML+=previous[h]+";";
		}
	}
	HTML+="}";
	document.getElementById(id).innerHTML += Viz(HTML);
	if(pic=="haut"){
		document.getElementById(id).innerHTML += "</br>Pic d'activité élevé";
	}else{
		document.getElementById(id).innerHTML += "</br>Pic d'activité faible";
	}
	document.getElementById(id).innerHTML += "</br>Dégradé de couleur (vues): + rouge -> bleu -";
	$(function(){
	$().timelinr();
	});
}

//Fonctions de simplification du code
async function getAdresseATM(personne){
	const prefectureByNum = await cozy.client.data.defineIndex('org.emorel.prefecture',['numero']);
	const prefecture = await cozy.client.data.query(prefectureByNum, {
	  "selector": {
		"numero": personne.idPrefATM
	    }
	})
	const regionByNum = await cozy.client.data.defineIndex('org.emorel.region',['numero']);
	const region = await cozy.client.data.query(regionByNum, {
	  "selector": {
		"numero": personne.idRegATM
	    }
	})
	if(region[0].numero<=5){
		return prefecture[0].prefecture + " dans la région de " + region[0].region + ", Est du Japon";
	}else{
		return prefecture[0].prefecture + " dans la région de " + region[0].region + ", Ouest du Japon";
	}
}

async function getAdresse(personne){
	const prefectureByNum = await cozy.client.data.defineIndex('org.emorel.prefecture',['numero']);
	const prefecture = await cozy.client.data.query(prefectureByNum, {
	  "selector": {
		"numero": personne.idPref
	    }
	})
	const regionByNum = await cozy.client.data.defineIndex('org.emorel.region',['numero']);
	const region = await cozy.client.data.query(regionByNum, {
	  "selector": {
		"numero": personne.idReg
	    }
	})
	if(region[0].numero<=5){
		return prefecture[0].prefecture + " dans la région de " + region[0].region + ", Est du Japon";
	}else{
		return prefecture[0].prefecture + " dans la région de " + region[0].region + ", Ouest du Japon";
	}
}

async function getSetA(personne){
	var temp = new Array();
	const setAByNum = await cozy.client.data.defineIndex('org.emorel.seta',['numero']);
	for(var i = 0;i<3;i++){
		const sushi = await cozy.client.data.query(setAByNum, {
	  	"selector": {
			"numero": personne.prefSetA[i]
	   	}
		})
		temp.push(sushi[0].sushi);
	}
	return temp;
}

async function getSetB(personne){
	var temp = new Array();
	const setBByNum = await cozy.client.data.defineIndex('org.emorel.setb',['numero']);
	for(var i = 0;i<3;i++){
		const sushi = await cozy.client.data.query(setBByNum, {
	  	"selector": {
			"numero": personne.prefSetB[i]
	   	}
		})
		temp.push(sushi[0].sushi);
	}
	return temp;
}

//Tranformation des dates
function toDate(entree){
	var date = entree.split('T');
	var heure = date[1].split(':');
	var minute = heure[2].split('.');
	var lastAccess = date[0] + ' ' + heure[0]+':'+heure[1]+':'+minute[0];
	return lastAccess;
}

//Conversion des couleurs
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

$(document).ready(function(){
	var h = ($("#coz-bar").height());
	$(".container-fluid").css('height', '100%').css('height', '-='+h+'px');
});

document.querySelector('.valide').addEventListener('click', sushis);
