var _button = app.activeDocument.pages[0].buttons.add();
_button.geometricBounds = [10,10,100,100];
_button.fillColor = app.activeDocument.swatches[4];
var _urlBehavior = _button.gotoURLBehaviors.add();
_urlBehavior.url = "http://indesignjs.de/";
_urlBehavior.behaviorEvent = BehaviorEvents.MOUSE_UP;