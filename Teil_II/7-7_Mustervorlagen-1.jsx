#target InDesign
var _dok = app.activeDocument;
var _musterVorlage = _dok.masterSpreads.itemByName("A-Mustervorlage");
_dok.pages[0].appliedMaster = _musterVorlage;