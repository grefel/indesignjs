var _tvar = app.activeDocument.textVariables.itemByName("Textvariable");
var _tvarInstance = app.selection[0].textVariableInstances.add(); 
_tvarInstance.associatedTextVariable = _tvar; 