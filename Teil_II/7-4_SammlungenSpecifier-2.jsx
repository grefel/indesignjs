#target InDesign
var _alleAbsaetze = app.activeDocument.stories.everyItem().paragraphs.everyItem().getElements();
for (var i =0; i < _alleAbsaetze.length; i++) {
	$.writeln(i +" | " + _alleAbsaetze[i].contents);
}
_alleAbsaetze = app.activeDocument.stories.everyItem().paragraphs;
for (var i =0; i < _alleAbsaetze.length; i++) {
	$.writeln(i +" | " + _alleAbsaetze[i].contents);
}