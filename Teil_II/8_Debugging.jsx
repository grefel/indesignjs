#target InDesign
var _dok = app.activeDocument;
$.writeln("Der Name des Dokuments ist: " + _dok.name);
_dok.pages.add();
_dok.pages.add();
for (var i = 0; i <= _dok.pages.length; i++) {
	$.writeln("Der Wert von i ist: " + i);
	$.writeln("Die Seite ist: " + _dok.pages[i].name + "\n");
}