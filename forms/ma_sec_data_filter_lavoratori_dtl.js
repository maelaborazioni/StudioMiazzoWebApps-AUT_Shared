/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A52B7898-3892-49BC-9A98-2453F14DD570",variableType:4}
 */
var vExclude = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"282582E0-81D0-4E0A-88E4-18928BECF0C1"}
 */
var vCompanyCode = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"629EE32E-110F-4143-8590-432CB9EFBD70"}
 */
var vCompanyDescription = '';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"10735A3F-1041-4977-AE96-6CDB4B8A6EE6",variableType:4}
 */
var vCompanyID;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"59B7B41D-9D9E-430D-B753-81713FCC7734"}
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
 * @properties={typeid:24,uuid:"B7F055C7-A0B9-4834-82C9-84B618B62759"}
 */
function selectNone(event)
{
	try
	{
		globals.ma_utl_startTransaction();
		
		foundset.deleteRecord();
		
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
 * @properties={typeid:24,uuid:"2D696A12-D63A-45DD-8F7A-CBC61838DAAE"}
 */
function deleteSelected(event)
{
	try
	{
		globals.ma_utl_startTransaction();
		
		foundset.deleteRecord();
		
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
 * @properties={typeid:24,uuid:"0C403A47-810F-4096-AFFE-6680379F5DAB"}
 * @AllowToRunInFind
 */
function selectValues(event)
{
	if(!vCompanyID)
	{
		globals.ma_utl_showWarningDialog('Selezionare una ditta');
		return;
	}
	
	var selectedValues = globals.ma_utl_showLkpWindow({ event: event,
		                                                lookup: 'AG_Lkp_Lavoratori',
														multiSelect: true,
														methodToAddFoundsetFilter: 'filterLavoratori',
														disabledElements: globals.foundsetToArray(foundset, 'idlavoratore') });
	if (selectedValues)
		updateValues(selectedValues);
}

/**
 * @properties={typeid:24,uuid:"732247CC-BE78-416E-9273-989252F3F5B9"}
 */
function filterLavoratori(fs)
{
	if(fs)
		fs.addFoundSetFilterParam('idditta', globals.ComparisonOperator.EQ, vCompanyID);
	
	return fs;
}

/**
 * @properties={typeid:24,uuid:"0BD7A055-9493-49F9-816F-FE186B51CDC7"}
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
 * @properties={typeid:24,uuid:"1D8E43BB-DE58-4FFB-B161-D2CC966612FD"}
 */
function updateValues(ids)
{
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/ma_framework/sec_filtrilavoratori>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'idlavoratore');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(lavoratore){ return currentSelection.indexOf(lavoratore) < 0; });
//		// Take all records no more selected
//		/** @type {Array}*/
//		var delList = currentSelection.filter(function(lavoratore){ return ids.indexOf(lavoratore) < 0; });
		
		globals.ma_utl_startTransaction();
		
//		if(fs.find())
//		{
//			fs.idlavoratore = delList;
//			if(fs.search() > 0)
//				fs.deleteAllRecords();
//		}
		
		addList.forEach(
			function(lavoratore)
			{ 
				fs.newRecord(); 
				fs.idlavoratore = lavoratore; 
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
 * @properties={typeid:24,uuid:"CEF7E05A-0C24-4155-81AC-1D5C8C50AEAA"}
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
 * @properties={typeid:24,uuid:"CC7A50B3-D5B9-40E7-8111-484BA3EF5B32"}
 * @AllowToRunInFind
 */
function onDataChangeCodDitta(oldValue, newValue, event)
{
	if(newValue)
	{
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
 * @properties={typeid:24,uuid:"EAE2BEA3-3517-406C-82D4-B9A49E3E13ED"}
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
 * @properties={typeid:24,uuid:"03A3B29C-A2DA-4BB8-A87C-B38BFB9E9B65"}
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
