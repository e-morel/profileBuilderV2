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
  var HTML = ''
  for (var i = 1; i < questionnaires.length; i++) {
    HTML += '<tr data-id="' + i + '">' +
          +   '<td><label>' + JSON.stringify(questionnaires[i].key.id) + '</label></td>'
          + '</tr>';
  }
  document.querySelector('.questionnaire-list').innerHTML = HTML;
}
var el = document.getElementsByClassName("delete"); 
el[0].addEventListener("click", deleteQuestionnaire, false); 
document.addEventListener("DOMContentLoaded", updateDocumentList);
