var _dok = app.activeDocument;
_dok.pages[0].textFrames[0].move(_dok.pages[1]); // Auf Seite verschieben 
_dok.pages[1].textFrames[0].move([20,20]); // Auf Position verschieben 
_dok.pages[0].textFrames[0].move(undefined, [10,10]); // Objekt relativ zur Originalposition verschieben