var _dok = app.activeDocument;
var _page = app.activeDocument.pages[0]; 
var _musterVorlage = _dok.masterSpreads.itemByName("A-Mustervorlage");
_page.appliedMaster = _musterVorlage;
var _vorlagenObjekt = _musterVorlage.pageItems.itemByName("tf");
_vorlagenObjekt.override(_page);