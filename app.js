function updateDocumentList(){
	console.log("Je passe par updateDocumentList")
	var id = document.querySelector('.send').value;
	byId = function(doc){  emit(doc); }
	cozysdk.defineView('questionnaire', 'id', byId, function(err, res) {
		if(err != null) return alert(err);
		console.log("defineView passé")
		cozysdk.queryView('questionnaire', 'id', {key: '8151'}, function(err, res) {
			if (err != null) return alert(err);
			console.log("queryView passé")
			render(res);
		});
	});
	cozysdk.find('questionnaire', 'a9441f483790fd5d3bc4d4cdcd379e81' , function(err, note){ 
		if(err != null) return alert(err);
		render(note);
		 });
}

function render(questionnaire){
	console.log("Je passe par render")
  var HTML = '<tr> <th>Personne n°</th> <th>Sexe</th> <th>Age</th> <th>Rapidité</th> <th>Lieu d habitation</th> <th>Lieu d habitation(15 ans av)</th> <th>Top 3 sushis set A</th></tr>'
  var profil = new Object();
  var profilPref = new Object();
            console.log(questionnaire);
            console.log(typeof questionnaire[0]["key"]["id"]);
            //construction du profil
            /*if JSON.stringify(questionnaire["key"]["genre"])>0{
                profil["sexe"]="feminin";
            }else{
                profil["sexe"]="masculin";
            }
            
            if JSON.stringify(questionnaire["key"]["age"])<1{
                profil["age"]="adolescent 15-19 ans";
            }else if JSON.stringify(questionnaire["key"]["age"])<2{
                profil["age"]="jeune 20-29 ans";
            }else if JSON.stringify(questionnaire["key"]["age"])<3{
                profil["age"]="trentenaire 30-39 ans";
            }else if JSON.stringify(questionnaire["key"]["age"])<4{
                profil["age"]="quadragenaire 40-49 ans";
            }else if JSON.stringify(questionnaire["key"]["age"])<5{
                profil["age"]="quiquagenaire 50-59 ans";
            }else if JSON.stringify(questionnaire["key"]["age"])<6{
                profil["age"]="retraité 60 ans et plus";
            }
    
            if JSON.stringify(questionnaire.key.temps)<343{
                profil["rapidite"]="rapide"+" "+JSON.stringify(questionnaire.key.temps)+" secondes";
            }else if 343<=JSON.stringify(questionnaire.key.temps) && JSON.stringify(questionnaire.key.temps)<521{
                profil["rapidite"]="modéré"+" "+JSON.stringify(questionnaire.key.temps)+" secondes";
            }else if 521<=JSON.stringify(questionnaire.key.temps) && JSON.stringify(questionnaire.key.temps)<699{
                profil["rapidite"]="lent"+" "+JSON.stringify(questionnaire.key.temps)+" secondes";
            }else if 699<=JSON.stringify(questionnaire.key.temps){
                profil["rapidite"]="très lent"+" "+JSON.stringify(questionnaire.key.temps)+" secondes";
            }
                
            switch JSON.stringify(questionnaire.key.idPrefATM) {
                case 1:
                    profil["habitation"]="Aomori dans la région de Tohoku à l'Est du Japon";
                default:
                    profil["habitation"]="Prefecture non reconnue";
            }
            
            if JSON.stringify(questionnaire.key.changement)>0{
                switch JSON.stringify(questionnaire.key.idPref){
                    case 4:
                        profil["origine"]="Hokinawa dans la région de Okinawa à l'Ouest du Japon";
                    default:
                       profil["origine"]="Prefecture non reconnue";
                }
            }else{
                profil["origine"]="Même lieu d'habitation qu'actuellement";
            }
            
            for j:=0;j<3;j++{
                switch JSON.stringify(questionnaire.key.prefSetA){
                    case 1:
                        profilPref[j]="anago";
                    case 2:
                        profilPref[j]="maguro";
                    case 5:
                        profilPref[j]="ikura";
                }
            }
    
    HTML += '<tr data-id="' + i + '">'
          +   '<td><label>' + JSON.stringify(questionnaire.key.id) + '</label></td>'
          +   '<td><label>' + profil["sexe"] + '</label></td>'
          +   '<td><label>' + profil["age"] + '</label></td>'
          +   '<td><label>' + profil["rapidite"] + '</label></td>'
          +   '<td><label>' + profil["habitation"] + '</label></td>'
          +   '<td><label>' + profil["origine"] + '</label></td>'
          +   '<td><label>' + profilPref[0]+ ' ' + profilPref[1] + ' ' + profilPref[2] + '</label></td>'
          + '</tr>';
  console.log("i = "+i)
  document.querySelector('.questionnaire-list').innerHTML = HTML;*/
}
document.querySelector('.valide').addEventListener('click', updateDocumentList);
