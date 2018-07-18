/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"08CFDD26-1433-419B-92CB-011A3FB80900",variableType:4}
 */
var vExclude = 0;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"BBFED08C-13EC-4529-813A-98FC0AC2E39B"}
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
 * @properties={typeid:24,uuid:"7A33401F-46B5-48AE-A2A9-D2A13BFDBC02"}
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
 * @properties={typeid:24,uuid:"9030E0CB-C56E-461A-9DB8-41C16AF06C5B"}
 * @AllowToRunInFind
 */
function selectValues(event)
{	
	var selectedValues = globals.ma_utl_showLkpWindow({ event: event
		                                                , lookup: 'AUT_Lkp_Group'
		                                                , multiSelect: true
														, methodToAddFoundsetFilter : 'filterValues'
														, selectedElements: globals.foundsetToArray(foundset, 'group_id') });
	if (selectedValues)
		updateValues(selectedValues);
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"77A5921F-DC12-4F02-A64F-4A33B15443A0"}
 */
function updateValues(ids)
{
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/svy_framework/sec_group>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'group_id');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(group){ return currentSelection.indexOf(group) < 0; });
		// Take all records no more selected
		/** @type {Array}*/
		var delList = currentSelection.filter(function(group){ return ids.indexOf(group) < 0; });
		
		globals.ma_utl_startTransaction();
		
		if(fs.find())
		{
			fs.group_id = delList;
			if(fs.search() > 0)
				fs.deleteAllRecords();
		}
		
		addList.forEach(
			function(group)
			{ 
				fs.newRecord(); 
				fs.group_id = group; 
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
 * @properties={typeid:24,uuid:"EBC1D92D-1F1F-47CC-A7FC-33ADE75E8A24"}
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

/**
 * Filtra i gruppi dell'organigramma relativo al proprietario
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"210EDE10-B7EB-4FF5-B4E5-DA1ADFD7508C"}
 */
function filterValues(_fs)
{
	_fs.addFoundSetFilterParam('owner_id','=',_to_sec_owner$owner_id.owner_id);
	return _fs;
}