#targetengine "saveWithBackup" 
var _action = app.scriptMenuActions.add("Mit Backup speichern");
_action.eventListeners.add("onInvoke", saveWithBackup);
_action.eventListeners.add("beforeDisplay", canRun);
var _hm = app.menus.itemByName("$ID/Main");
var _dm = _hm.submenus.itemByName("$ID/FileDestinationPanel");
if (_dm.menuItems.itemByName("Mit Backup speichern") == null) {
	_dm.menuItems.add(_action, LocationOptions.AFTER,_dm.menuItems.itemByName("$ID/Save"));
}

function saveWithBackup () {
	_date = new Date();
	var _dok = app.activeDocument;
	var _backupFolder = Folder (Folder.myDocuments + "/indd_backup");
	if (_backupFolder.exists != false) _backupFolder.create();
	_backupFolder = Folder(_backupFolder + "/" + formatDatum(_date));
	if (!_backupFolder.exists != false) _backupFolder.create();
	var _backupFile = File (_backupFolder + "/" + formatZeit(_date) + "__" + _dok.name);
	_dok.fullName.copy(_backupFile);
	_dok.save();
}
function canRun(_event) {
	var _action = _event.parent;
	if (app.documents.length > 0 && app.activeDocument.saved == true && app.activeDocument.modified == true) {
		_action.enabled = true;		
	} else {
		_action.enabled = false;				
	}
}

// Funktion 
function formatDatum (_date) {
	var _year = _date.getFullYear();
	var _month = _date.getMonth() + 1;
	if (_month.toString().length == 1) _month = "0" +_month;
	var _day = _date.getDate();
	if (_day.toString().length == 1) _day = "0" +_day;
	return _year + "-" + _month + "-" + _day;
}
function formatZeit (_date) {
	var _hours = _date.getHours();
	if (_hours.toString().length == 1) _hours= "0" +_hours;
	var _minutes = _date.getMinutes();
	if (_minutes.toString().length == 1) _minutes= "0" +_minutes;
	var _seconds = _date.getSeconds();
	if (_seconds.toString().length == 1) _seconds = "0" +_seconds; 
	return _hours + "-" + _minutes + "-" + _seconds;
}
// Zum formatieren von Daten siehe auch http://blog.stevenlevithan.com/archives/date-time-format