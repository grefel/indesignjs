var _datei = File("~/Desktop/Testdatei.txt");
alert ("Die Variable _datei enthält den folgenden Pfad: " + _datei.fullName);
if (_datei.exists) {
	alert ("Die Datei existiert!");
}
else {
	alert ("Die Datei existiert nicht!");
}