var _antwort = confirm("Soll eine Abfrage angezeigt werden?");
if (_antwort) {
	var _eingabe = prompt("Wieviele Seiten sollen erstellt werden?");
	for (var i =0; i < parseFloat(_eingabe); i++) {
		app.activeDocument.pages.add();
	}
} 
else {
	alert("Dies ist nur ein Hinweis.");
}