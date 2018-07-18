/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"62394373-554C-4BC4-B84C-3153E67E8968",variableType:4}
 */
var vExclude = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B746423B-5732-446F-BD5F-B5ACB51DEA03",variableType:4}
 */
var vCompanyID;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C93A3CCA-DF9C-4821-8A13-CE954B3EA1A4"}
 */
var vCompanyCode = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D208F946-FDC3-44AC-9489-FD6D097FDD41"}
 */
var vCompanyDescription = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"124595C3-73F0-41F4-899B-5FECE24DD8D5"}
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
 * @properties={typeid:24,uuid:"FE78948F-4040-4C00-AA7A-995B34A5EB11"}
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
 * @properties={typeid:24,uuid:"F5C21C0D-1C39-41A1-B6FA-09BF13A3CA04"}
 * @AllowToRunInFind
 */
function selectValues(event)
{
	if(!vCompanyID)
	{
		globals.ma_utl_showWarningDialog('Selezionare una ditta');
		return;
	}
	
	var selectedValues = globals.ma_utl_showLkpWindow({ event: event, lookup: 'AG_Lkp_Classificazioni', multiSelect: true, methodToAddFoundsetFilter: 'filterClassificazioni', selectedElements: globals.foundsetToArray(foundset, 'idclassificazione') });
	if (selectedValues)
		updateValues(selectedValues);
}

/**
 * @properties={typeid:24,uuid:"9007364F-33A1-4DC4-BF51-5B90821FD78C"}
 */
function filterClassificazioni(fs)
{
	if(fs)
		fs.addFoundSetFilterParam('idditta', globals.ComparisonOperator.EQ, vCompanyID);
	
	return fs;
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"D5F41BAD-38A9-444E-8291-A41B18D84E62"}
 */
function updateValues(ids)
{
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/ma_framework/sec_filtriclassificazioni>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'idclassificazione');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(classificazione){ return currentSelection.indexOf(classificazione) < 0; });
		// Take all records no more selected
		/** @type {Array}*/
		var delList = currentSelection.filter(function(classificazione){ return ids.indexOf(classificazione) < 0; });
		
		globals.ma_utl_startTransaction();
		
		if(fs.find())
		{
			fs.idclassificazione = delList;
			if(fs.search() > 0)
				fs.deleteAllRecords();
		}
		
		addList.forEach(
			function(classificazione)
			{ 
				fs.newRecord(); 
				fs.idclassificazione = classificazione; 
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"069FC37C-455B-4C8F-8BB2-746FC8E294EC"}
 */
function lookupDitta(event) 
{
	vCompanyID = globals.ma_utl_showLkpWindow({ event: event, lookup: 'AG_Lkp_Ditta', methodToExecuteAfterSelection: 'updateDitta' });
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
 * @properties={typeid:24,uuid:"8B5E0709-DD52-4776-A4CF-FA4BB3B1C509"}
 * @AllowToRunInFind
 */
function onDataChangeCodDitta(oldValue, newValue, event)
{
	if(newValue)
	{
		/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
		var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE);
		if (fs && fs.find())
		{
			fs.codice = newValue;
			fs.tipologia = 0;
			
			if(fs.search() > 0)
				updateDitta(fs.getSelectedRecord());
			else
				return false;
		}
	}
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"591724F2-588E-4750-825D-2C7550B40005"}
 */
function updateDitta(rec)
{
	vCompanyID = rec.idditta;
	vCompanyCode = rec.codice;
	vCompanyDescription = rec.ragionesociale;
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
 * @properties={typeid:24,uuid:"E8A2863E-14AE-4EFB-8C37-C6C62F73A791"}
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
