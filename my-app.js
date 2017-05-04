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
	var res = cozy.client.data.create('org.emorel.questionnaire', {"a" : "b", "b" : "c"});
	console.log(res);
}
document.querySelector('.valide').addEventListener('click', updateDocumentList);
