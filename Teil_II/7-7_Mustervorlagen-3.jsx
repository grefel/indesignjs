var _dok = app.activeDocument;
var _page = app.activeDocument.pages[0]; 
var _musterVorlage = _dok.masterSpreads.itemByName("A-Mustervorlage");
_page.appliedMaster = _musterVorlage;
var _vorlagenObjekt = _musterVorlage.pageItems.itemByName("tfMusterseite");
// Alternativ zu Zeile 5 + 6: var _vorlagenObjekt = _page.appliedMaster.pageItems.itemByName("tfMusterseite");
_vorlagenObjekt.override(_page);
_dok.recompose();