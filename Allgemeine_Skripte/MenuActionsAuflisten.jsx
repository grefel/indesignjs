// From  Marijan Tompa  https://forums.adobe.com/thread/1040870?q=undo

var  
	menuActions = app.menuActions,  
	menuActionsLength = menuActions.length,  
	menuActionsList = [],  
	newDoc = app.documents.add (),  
	docPage = newDoc.pages [ 0 ],  
	docMargins = docPage.marginPreferences,  
	actionsTextFrameBounds = [  
		docPage.bounds [ 0 ] + docMargins.top,  
		docPage.bounds [ 1 ] + docMargins.left,  
		docPage.bounds [ 2 ] - docMargins.bottom,  
		docPage.bounds [ 3 ] - docMargins.right, ],  
	actionsTextFrame = newDoc.pages [ 0 ].textFrames.add ( { geometricBounds : actionsTextFrameBounds } ),  
	actionsTable = actionsTextFrame.insertionPoints [ 0 ].tables.add ( { columnCount : 3, bodyRowCount : menuActionsLength } ),  
	i = 0;  
  
for ( i ; i < menuActionsLength ; i++ )  
	menuActionsList.push ( menuActions [ i ].name.toString () ),  
	menuActionsList.push ( menuActions [ i ].area.toString () ),  
	menuActionsList.push ( menuActions [ i ].id.toString () );  
  
actionsTable.contents = menuActionsList;  