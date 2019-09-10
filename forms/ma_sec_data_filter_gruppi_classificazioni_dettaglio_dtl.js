/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"CF200891-141D-4F03-A903-DC6016A58948",variableType:8}
 */
var selectedGroup = null;
/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"07DB89D3-8BE2-472E-8242-5559CF259978",variableType:8}
 */
var selectedClassifGroup = null;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"96796CD4-2C01-4E16-89AC-E55B557C7AD4",variableType:4}
 */
var vExclude = 0;
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"D9E3F5D8-46A5-4481-B999-E51FEA75CF90"}
 */
function selectValues(event)
{
	/** @type {JSFoundSet<db:/ma_anagrafiche/gruppi>} */
	var fsGruppi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.GRUPPI);
	if(fsGruppi.loadAllRecords() && fsGruppi.getSize() == 1)
		selectedGroup = fsGruppi.idgruppo;
	else
		selectedGroup = globals.ma_utl_showLkpWindow({ event: event,
										               lookup: 'AG_Lkp_Gruppi',
													   allowInBrowse : true });
	
	selectedClassifGroup = globals.ma_utl_showLkpWindow({ event: event,
		                                           lookup: 'AG_Lkp_Gruppi_Classificazioni',
												   allowInBrowse : true,
												   methodToAddFoundsetFilter : 'filterGruppiClassificazioni'});
	if (selectedClassifGroup)
	{
		var selectedValues = globals.ma_utl_showLkpWindow({ event: event,
			                                                lookup: 'AG_Lkp_Gruppi_ClassificazioniDettaglio', 
															multiSelect: true, 
															methodToAddFoundsetFilter: 'filterGruppiClassificazioniDettaglio' });
		updateValues(selectedValues);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"FDF644A2-B4BD-4FA0-8C27-900C743D0D89"}
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
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0F9DD38C-477D-4396-BCBF-7D5999F15F69"}
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
 * TODO generated, please specify type and doc for the params
 * @param ids
 *
 * @properties={typeid:24,uuid:"A40D1004-C752-4AC1-AE5C-0A6E5A3B0474"}
 * @AllowToRunInFind
 */
function updateValues(ids)
{
	// inserimento classificazioni dettaglio selezionate 
	try
	{
		var form = forms[elements.values.getTabFormNameAt(1)];
		/** @type {JSFoundSet<db:/ma_framework/sec_filtriclassificazioni>} */
		var fs   = form.foundset.duplicateFoundSet();
		
		var currentSelection = globals.foundsetToArray(form.foundset, 'idclassificazione');
		
		// Take all records which were not selected before
		/** @type {Array}*/
		var addList = ids.filter(function(gruppoClassif){ return currentSelection.indexOf(gruppoClassif) < 0; });
		// Take all records no more selected
		/** @type {Array}*/
		var delList = currentSelection.filter(function(gruppoClassif){ return ids.indexOf(gruppoClassif) < 0; });
		
		globals.ma_utl_startTransaction();
		
		if(fs.find())
		{
			fs.idclassificazione = delList;
			if(fs.search() > 0)
				fs.deleteAllRecords();
		}
		
		addList.forEach(
			function(idGruppoClassif)
			{ 
				fs.newRecord(); 
				fs.idclassificazione = idGruppoClassif; 
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
 * Filtra i gruppi di classificazione per il gruppo selezionato
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"C8AA199F-50C7-41FB-B7C2-A9A7F5BC61B0"}
 */
function filterGruppiClassificazioni(_fs)
{
	_fs.addFoundSetFilterParam('idgruppo','=',selectedGroup);
	return _fs;
}

/**
 * Filtra i dettagli per il gruppo classificazione selezionato
 * 
 * @param {JSFoundset} _fs
 *
 * @properties={typeid:24,uuid:"A7B41E42-05CA-46E1-A707-8F18F8ABA4A6"}
 */
function filterGruppiClassificazioniDettaglio(_fs)
{
	_fs.addFoundSetFilterParam('idgruppoclassificazione','=',selectedClassifGroup);
	return _fs;
}