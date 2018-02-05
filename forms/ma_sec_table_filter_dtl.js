/**
 * @properties={typeid:35,uuid:"19339D2A-8AFF-4B61-99E9-F62090957830",variableType:-4}
 */
var lookupPrograms = { };

/**
 * @properties={typeid:35,uuid:"FE1609E1-B766-4D59-9C81-0C654542EF26",variableType:-4}
 */
var tableForms = { };

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"33E4BF7B-93D2-4130-9DB7-CCF164E80D1F",variableType:-4}
 */
var selectedValues;

/**
 * @properties={typeid:24,uuid:"DA989F26-A7B7-4222-A460-89C462ABA1A7"}
 */
function onLoad(event)
{
	lookupPrograms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI)] = 'AG_Lkp_Lavoratori';
	lookupPrograms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE)] = 'AG_Lkp_Ditta';
	lookupPrograms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, 'ditte_sedi')] = 'AG_Lkp_Sede';
	
	tableForms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI)] = forms.agl_lavoratore_tbl.controller.getName();
	tableForms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, globals.Table.DITTE)] = forms.agd_ditta_tbl.controller.getName();
	tableForms[globals.ma_utl_getDataSource(globals.Server.MA_ANAGRAFICHE, 'ditte_sedi')] = forms.agd_sdl_sedidilavoro_tbl.controller.getName();
}

/**
 * @properties={typeid:24,uuid:"0F888E66-0A29-4B4E-8C9C-1DBA5A83637D"}
 */
function getValuesForm()
{
	try
	{
		var dataSource = globals.ma_utl_getDataSource(server_name, table_name);
		var formName = tableForms[dataSource];
		
		elements.values.removeAllTabs();
		elements.values.addTab(formName, formName);
	}
	catch(error)
	{
		globals.ma_utl_logError(error);
		globals.ma_utl_showErrorDialog(error.message);
	}
}

/**
 * Set the valuelist with the server names
 *
 * @author Sanneke Aleman
 * @since 2008-05-04
 *
 * @properties={typeid:24,uuid:"698C0B53-F496-40A3-A196-9DCEBCDA93F9"}
 */
function setVLserverNames()
{
	var _servers = [globals.Server.MA_ANAGRAFICHE];
	application.setValueListItems('svy_sec_servernames', _servers.sort())
}

/**
 * Set the valuelist with the table names
 *
 * @author Sanneke Aleman
 * @since 2008-05-04
 *
 * @properties={typeid:24,uuid:"E20920AD-3877-489B-BD3A-1E13852CEA31"}
 */
function setVLtableNames()
{
	var _tables = [globals.Table.LAVORATORI, globals.Table.DITTE, 'ditte_sedi'];
	application.setValueListItems('svy_sec_tablenames', _tables, _tables);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"8EC1DDC1-31D7-4742-ABD8-0FC61BCAE08A"}
 */
function selectAll(event) 
{
	if(elements.values.getMaxTabIndex() === 0)
		getValuesForm();
	
	forms[elements.values.getTabFormNameAt(1)].foundset.loadAllRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"31EC6ADE-565C-4397-B516-97ABFDCAD184"}
 */
function selectNone(event)
{
	if(elements.values.getMaxTabIndex() > 0)
		forms[elements.values.getTabFormNameAt(1)].foundset.clear();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"C1433AB8-A561-4F18-B731-0CD5FBB7459F"}
 * @AllowToRunInFind
 */
function selectValues(event)
{
	var lookup     = lookupPrograms[globals.ma_utl_getDataSource(server_name, table_name)];
	selectedValues = globals.ma_utl_showLkpWindow({ event: event, lookup: lookup, multiSelect: true });
	
	if(elements.values.getMaxTabIndex() === 0)
		getValuesForm();
	
	updateValues(selectedValues);
}

/**
 * @AllowToRunInFind
 * 
 * @properties={typeid:24,uuid:"55985364-1E2E-418D-BF1B-464DEF059004"}
 */
function updateValues(ids)
{
	var form;
	if(elements.values.getMaxTabIndex() > 0)
		form = forms[elements.values.getTabFormNameAt(1)];
	else
	{
		form = forms[tableForms[globals.ma_utl_getDataSource(server_name, table_name)]];
		elements.values.addTab(form.controller.getName(), form.controller.getName());
	}
	
	var fs = form.foundset;
	if (fs && fs.find())
	{
		var table = databaseManager.getTable(fs.getDataSource());
		var pk    = table.getRowIdentifierColumnNames()[0];
		
		fs[pk] = ids;
		fs.search();
	}
	
	selectedValues = ids;
}

/**
 * @properties={typeid:24,uuid:"C7869445-CB08-445B-8D1B-A6949477902F"}
 */
function closeForm(event)
{
	if(elements.values.getMaxTabIndex() > 0)
	{
		filter_value      = selectedValues.join(',');
		filter_field_name = databaseManager.getTable(server_name, table_name).getRowIdentifierColumnNames()[0];
	}
			
	_super.closeForm(event);
}
