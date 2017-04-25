function updateDocumentList(){
	console.log("Je passe par updateDocumentList")
	byId = function(doc){  emit(doc._id);}
	cozysdk.defineView('questionnaire', 'id', byId, function(err, res) {
		if(err != null) return alert(err);
		console.log("defineView passé")
		cozysdk.queryView('questionnaire', 'id', {include_docs : true}, function(err, res) {
			if (err != null) return alert(err);
			console.log("queryView passé")
			render(res);
		});
	});
}

function render(questionnaire){
	console.log("Je passe par render")
  var HTML = '<tr> <th>Personne n°</th> <th>Sexe</th> <th>Age</th> <th>Rapidité</th> <th>Lieu d habitation</th> <th>Lieu d habitation(15 ans av)</th> <th>Top 3 sushis set A</th></tr>'
  var profil = new Object();
  var profilPref = new Object();
  console.log(questionnaire);
  for(var i=0; i<questionnaire.length; i++){
	var id = document.querySelector('.send').value;
	  if(questionnaire[i]["doc"]["id"]==id){
		cozysdk.find('questionnaire', questionnaire[i]["id"] , function(err, personne){ 
			if(err != null) return alert(err);
			console.log(personne);
			//construction du profil
            if JSON.stringify(personne["genre"])>0{
                profil["sexe"]="feminin";
            }else{
                profil["sexe"]="masculin";
            }
            
            if JSON.stringify(personne["age"])<1{
                profil["age"]="adolescent 15-19 ans";
            }else if JSON.stringify(personne["age"])<2{
                profil["age"]="jeune 20-29 ans";
            }else if JSON.stringify(personne["age"])<3{
                profil["age"]="trentenaire 30-39 ans";
            }else if JSON.stringify(personne["age"])<4{
                profil["age"]="quadragenaire 40-49 ans";
            }else if JSON.stringify(personne["age"])<5{
                profil["age"]="quiquagenaire 50-59 ans";
            }else if JSON.stringify(personne["age"])<6{
                profil["age"]="retraité 60 ans et plus";
            }
    
            if JSON.stringify(personne["temps"])<343{
                profil["rapidite"]="rapide"+" "+JSON.stringify(personne["temps"])+" secondes";
            }else if 343<=JSON.stringify(personne["temps"]) && JSON.stringify(personne["temps"])<521{
                profil["rapidite"]="modéré"+" "+JSON.stringify(personne["temps"])+" secondes";
            }else if 521<=JSON.stringify(personne["temps"]) && JSON.stringify(personne["temps"])<699{
                profil["rapidite"]="lent"+" "+JSON.stringify(personne["temps"])+" secondes";
            }else if 699<=JSON.stringify(personne["temps"]){
                profil["rapidite"]="très lent"+" "+JSON.stringify(personne["temps"])+" secondes";
            }
                
            switch JSON.stringify(personne["idPrefATM"]) {
                case 1:
                    profil["habitation"]="Aomori dans la région de Tohoku à l'Est du Japon";
                default:
                    profil["habitation"]="Prefecture non reconnue";
            }
            
            if JSON.stringify(personne["changement"])>0{
                switch JSON.stringify(personne["idPref"]){
                    case 4:
                        profil["origine"]="Hokinawa dans la région de Okinawa à l'Ouest du Japon";
                    default:
                       profil["origine"]="Prefecture non reconnue";
                }
            }else{
                profil["origine"]="Même lieu d'habitation qu'actuellement";
            }
            
            for j:=0;j<3;j++{
                switch JSON.stringify(personne["prefSetA"]){
                    case 1:
                        profilPref[j]="anago";
                    case 2:
                        profilPref[j]="maguro";
                    case 5:
                        profilPref[j]="ikura";
                }
            }
    
    HTML += '<tr data-id="' + i + '">'
          +   '<td><label>' + id + '</label></td>'
          +   '<td><label>' + profil["sexe"] + '</label></td>'
          +   '<td><label>' + profil["age"] + '</label></td>'
          +   '<td><label>' + profil["rapidite"] + '</label></td>'
          +   '<td><label>' + profil["habitation"] + '</label></td>'
          +   '<td><label>' + profil["origine"] + '</label></td>'
          +   '<td><label>' + profilPref[0]+ ' ' + profilPref[1] + ' ' + profilPref[2] + '</label></td>'
          + '</tr>';
  console.log("i = "+i)
  document.querySelector('.questionnaire-list').innerHTML = HTML;
		 });
		}
	}
}
document.querySelector('.valide').addEventListener('click', updateDocumentList);
