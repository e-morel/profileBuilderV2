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
	console.log("MODIFE")
	var res = cozy.client.data.defineIndex('io.cozy.apps', ['type', 'id']);
	/*const results = cozy.client.data.query(res, {
  "selector": {type: 'io.cozy.apps'},
  "limit": 3,
  "skip": 0
	});*/
	console.log(res);
	console.log("Define index");
}
document.querySelector('.valide').addEventListener('click', updateDocumentList);
