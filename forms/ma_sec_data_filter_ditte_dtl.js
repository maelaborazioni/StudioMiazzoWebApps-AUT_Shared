/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C4241976-E3BE-4B36-80EC-A37688012664",variableType:4}
 */
var vExclude = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"CB98204E-79A2-47C1-99D7-E1041E8242D4"}
 */
function selectAll(event) 
{
	forms[elements.values.getTabFormNameAt(1)].foundset.loadAllRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"BAE0F2F8-3C72-4F5A-A4B1-6BE5071A91F1"}
 */
function selectNone(event)
{
	try
	{
		globals.ma_utl_startTransaction();
		
		foundset.deleteAllRecords();
		
		globals.ma_utl_commitTransaction();
	}
	catch(error)
	{
		globals.ma_utl_rollbackTransaction();
		globals.ma_utl_logError(error, LOGGINGLEVEL.ERROR);
		globals.ma_utl_showErrorDialog(error.message);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"10103A36-04B2-4FEF-A57C-C0154900E8E8"}
 * @AllowToRunInFind
 */
function selectValues(event)
{
	var selectedValues = globals.ma_utl_showLkpWindow({ event: event, lookup: 'AG_Lkp_Ditta', multiSelect: true, selectedElements: globals.foundsetToArray(foundset, 'idditta') });
	if (selectedValues)
		updateValues(selectedValues);
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"F6CA5FBC-6E88-459B-AE68-3D0D4674FAC7"}
 */
function updateValues(ids)
{
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/ma_framework/sec_filtriditte>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'idditta');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(ditta){ return currentSelection.indexOf(ditta) < 0; });
		// Take all records no more selected
		/** @type {Array}*/
		var delList = currentSelection.filter(function(ditta){ return ids.indexOf(ditta) < 0; });
		
		globals.ma_utl_startTransaction();
		
		if(fs.find())
		{
			fs.idditta = delList;
			if(fs.search() > 0)
				fs.deleteAllRecords();
		}
		
		addList.forEach(
			function(ditta)
			{ 
				fs.newRecord();
				fs.idditta = ditta;
				fs.exclude = vExclude;
			}
		);
		
		return globals.ma_utl_commitTransaction();
	}
	catch(error)
	{
		globals.ma_utl_rollbackTransaction();
		globals.ma_utl_logError(error, LOGGINGLEVEL.ERROR);
		globals.ma_utl_showErrorDialog(error.message);
		
		return false;
	}
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"03E95E05-F60A-4F8D-9817-B81C3A289FF5"}
 */
function onDataChangeExclude(oldValue, newValue, event) 
{
	var fs = foundset;
	var fsUpdater = databaseManager.getFoundSetUpdater(fs);
	if (fsUpdater)
	{
		fsUpdater.setColumn('exclude', newValue);
		if(!fsUpdater.performUpdate())
			throw new Error('onDataChangeExclude: Errore durante l\'aggiornamento del campo \'exclude\'');
	}
	
	return true;
}
