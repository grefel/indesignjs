var _mso = app.activeDocument.pages[0].multiStateObjects.add();
_mso.name = "MeinObjektstatus";
for (var i = 0; i < app.selection.length; i++) {
	_mso.addItemsAsState(app.selection[i]);
	_mso.states[-1].name  = "meinStatus-" + i;
}
_mso.states.itemByRange(0,1).remove();