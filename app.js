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

document.addEventListener("DOMContentLoaded", updateDocumentList);
