function updateDocumentList(){
	console.log("Je passe par updateDocumentList")
	cozysdk.defineView('questionnaire', 'all', 'function(doc){ emit(doc); }', function(err, res) {
		if(err != null) return alert(err);
		cozysdk.queryView('questionnaire', 'all', {}, function(err, res) {
			if (err != null) return alert(err);
			render(res);
		});
	});
}

function deleteQuestionnaire(){
	console.log("je passe par delete")
	cozysdk.destroyByView('questionnaire', 'all', {}, function(err){ if (err != null) return alert(err);});
}

function render(questionnaires){
	console.log("Je passe par render")
  var HTML = '<tr> <th>ID</th> <th>Genre</th> <th>Age</th> <th>Temps</th> <th>IdPref</th> <th>IdReg</th> <th>IdEO</th> <th>IdPrefATM</th> <th>IdRegATM</th> <th>IdEOATM</th> <th>Changement</th> <th>PrefSetA</th> <th>PrefSetB</th></tr>'
  for (var i = 0; i < questionnaires.length; i++) {
    HTML += '<tr data-id="' + i + '">'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.id) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.genre) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.age) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.temps) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idPref) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idReg) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idEO) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idPrefATM) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idRegATM) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.idEOATM) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.changement) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.prefSetA) + '</label></td><br>'
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.prefSetB) + '</label></td><br>'
          + '</tr>';
  }
  console.log("i = "+i)
  document.querySelector('.questionnaire-list').innerHTML = HTML;
}
var el = document.getElementsByClassName("delete"); 
el[0].addEventListener("click", deleteQuestionnaire, false); 
document.addEventListener("DOMContentLoaded", updateDocumentList);
