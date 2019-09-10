/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"541EB7DD-DCCE-42B0-B08E-FEEBA58C46C8",variableType:4}
 */
var vExclude = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EEBD5DCC-A985-4983-BAC9-41549E88B9C1",variableType:4}
 */
var vCompanyID;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4A30C16E-76DA-45DD-8516-F9760ED1FFBF"}
 */
var vCompanyCode = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9E448CED-9282-4A48-A056-6FBC5FD77F39"}
 */
var vCompanyDescription = '';

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D8881AE4-5400-4348-87DA-699E77879268"}
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
 * @properties={typeid:24,uuid:"A275AADE-5B1C-4293-BFF7-35E4E27825C3"}
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
 * @properties={typeid:24,uuid:"E1D3A0A6-B1BB-437F-A629-F6583DE1D6F5"}
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
 * @properties={typeid:24,uuid:"DB93380E-66AC-49D8-8776-73602C0318A7"}
 * @AllowToRunInFind
 */
function selectValues(event)
{
	if(!vCompanyID)
	{
		globals.ma_utl_showWarningDialog('Selezionare una ditta');
		return;
	}
	
	var selectedValues = globals.ma_utl_showLkpWindow(
		{ 
			event: event
			, lookup: 'AG_Lkp_Sede'
			, multiSelect: true
			, methodToAddFoundsetFilter: 'filterSede'
			, disabledElements : globals.foundsetToArray(foundset, 'iddittasede') 
		}
	);
	if (selectedValues)
		updateValues(selectedValues);
}

/**
 * @properties={typeid:24,uuid:"93BF8074-F891-4F12-942C-40472D4F023B"}
 * @AllowToRunInFind
 */
function filterSede(fs)
{	
	if(!vCompanyID)
	{
		globals.ma_utl_showWarningDialog('Selezionare una ditta');
		return null;
	}
	
	/** @type {JSFoundSet<db:/ma_anagrafiche/ditte>} */
	var fsDitte = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.DITTE);
	if(fsDitte.find())
	{
		fsDitte.idditta = vCompanyID;
		if(fsDitte.search())
		{
			if(fsDitte.tipologia == globals.Tipologia.ESTERNA
					&& fsDitte.ditte_to_ditte_legami.tipoesterni == 0)
				vCompanyID = fsDitte.ditte_to_ditte_legami.iddittariferimento;
		}
	}
	
	if(fs)
		fs.addFoundSetFilterParam('idditta', globals.ComparisonOperator.EQ, vCompanyID);

	return fs;
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"1609823E-802A-4522-887C-0AB13B362589"}
 */
function getDitteFtr()
{
	/** @type{JSFoundSet<db:/ma_framework/sec_filtriditte>} */
	var fsDitteFtr = databaseManager.getFoundSet(globals.Server.MA_FRAMEWORK,'sec_filtriditte');
	if(fsDitteFtr.find())
	   fsDitteFtr.search();
	
	if(fsDitteFtr.getSize())
		return globals.foundsetToArray(fsDitteFtr,'idDitta')
	else
		return null;
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"F1315DF6-56F7-4C10-B360-59E5CB631B74"}
 */
function updateValues(ids)
{
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/ma_framework/sec_filtridittesedi>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'iddittasede');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(sede){ return currentSelection.indexOf(sede) < 0; });
//		// Take all records no more selected
//		/** @type {Array}*/
//		var delList = currentSelection.filter(function(sede){ return ids.indexOf(sede) < 0; });
		
		globals.ma_utl_startTransaction();
		
//		if(fs.find())
//		{
//			fs.iddittasede = delList;
//			if(fs.search() > 0)
//				fs.deleteAllRecords();
//		}
		
		addList.forEach(
			function(sede)
			{ 
				fs.newRecord(); 
				fs.iddittasede = sede;
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"12C1495D-CEA9-4328-BF28-E3FBA203B4F7"}
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
 * @properties={typeid:24,uuid:"DCBD3325-FF5C-4B8A-A4F8-82C0DFFFB9FB"}
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
 * @properties={typeid:24,uuid:"316B8DA1-9CF7-4119-AB57-A46DDCF7282D"}
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
 * @properties={typeid:24,uuid:"CF852010-97CD-4073-B044-C01139BB5CCC"}
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
