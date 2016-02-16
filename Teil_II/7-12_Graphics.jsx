ar _bild = app.selection[0].graphics[0];
if (_bild.getElements()[0].constructor.name == "Image") {
	alert ("Der Rahmen enthält ein Rasterbild!");
}
else if (_bild.getElements()[0].constructor.name == "EPS") {
	alert ("Der Rahmen enthält eine EPS-Datei!");
}
else if (_bild.getElements()[0].constructor.name == "PDF") {
	alert ("Der Rahmen enthält eine PDF-Datei!");
}
else {
	alert("Der Rahmen enthält: " + _bild.getElements()[0].constructor.name);
}