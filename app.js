function updateDocumentList(){
	cozysdk.defineView('questionnaire', 'all', 'function(doc){ emit(doc); }', function(err, res) {
		if(err != null) return alert(err);
		cozysdk.queryView('questionnaire', 'all', {}, function(err, res) {
			if (err != null) return alert(err);
			var questionnaires = JSON.parse("" + res);
			render(questionnaires);
		});
	});
}

function deleteQuestionnaire(){
	console.log("je passe par delete")
	cozysdk.destroyByView('questionnaire', 'all', {});
}

function render(questionnaires){
	console.log("Je passe par render")
  var HTML = ''
  for (var i = 0; i < questionnaires.length; i++) {
    HTML += '<tr data-id="' + questionnaires[i].id + '">' +
          +   '<td><label>' + questionnaires[i].key + '</label></td>'
          + '</tr>';
  }
  document.querySelector('.questionnaire-list').innerHTML = HTML;
}
var el = document.getElementsByClassName("delete"); 
el.addEventListener("click", deleteQuestionnaire, false); 
document.addEventListener("DOMContentLoaded", updateDocumentList);
