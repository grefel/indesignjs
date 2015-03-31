#target InDesign
var _dokObjekt = app.documents[0];
var _rahmenObjekt = _dokObjekt.pageItems[0];
_rahmenObjekt.rotationAngle = 45;
_rahmenObjekt.geometricBounds = [10,10,100,100];
alert (_dokObjekt.name + " Der Name ist als String gespeichert");
var _seitenObjekt = _dokObjekt.pages[0];
_seitenObjekt.textFrames[0].paragraphs[0].alignToBaseline = true;