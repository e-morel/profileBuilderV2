'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('[role=application]')
  cozy.client.init({
    cozyURL: app.dataset.cozyStack,
    token: app.dataset.token,
    version: 3
  })
})

function updateDocumentList(){
	console.log("Je passe par updateDocumentList")
	var res = cozy.client.data.defineIndex("questionnaire", ['numero', 'temps']);
	console.log(res);
	console.log("Define index");
}
document.querySelector('.valide').addEventListener('click', updateDocumentList);
