app.doScript(main, ScriptLanguage.JAVASCRIPT , ["erster","zweiter"], UndoModes.ENTIRE_SCRIPT, "Name für Menu" ); 		

function main (_args) {
	var _ersterParameter = _args[0];
	var _zweiterParameter = _args[1];
	$.writeln(_ersterParameter + " " + _zweiterParameter);
	// ...
}