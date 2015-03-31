#target InDesign
var _dok = app.activeDocument;
try {
	var _ps = _dok.paragraphStyles.add({name:"Formatvorlage"});
}
catch(_fehler) {
	alert ("Es ist ein Fehler aufgetreten! Die Fehlermeldung lautet:\n" + _fehler.message);
}
