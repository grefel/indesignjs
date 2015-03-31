#target InDesign
var _dokument = app.documents[0];
if (_dokument.textFrames.itemByName("tf")== null) {
	alert ("Kein Textrahmen mit dem Namen 'tf' vorhanden!");
}

// Ab InDesign CS4:
//~ var _dokument = app.documents[0];
//~ if (_dokument.textFrames.itemByName("tf").isValid == false) {
//~ 	alert ("Kein Textrahmen mit dem Namen 'tf' vorhanden!");
//~ }
