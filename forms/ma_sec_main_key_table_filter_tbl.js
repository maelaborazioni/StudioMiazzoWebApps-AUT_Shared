/**
 * @properties={typeid:24,uuid:"B11A5F90-B9C5-4A91-AA13-7BAFC84EC83D"}
 */
function deleteRecord(event)
{
	_super.deleteRecord(event);
	
	if(globals.ma_utl_isFoundSetNullOrEmpty(sec_table_filter_to_sec_security_key))
		forms.ma_sec_main_key_tbl.foundset.deleteRecord();
}

/**
 * Edit, open dialog
 *
 * @author Sanneke Aleman
 * @since 2008-05-04
 *
 * @properties={typeid:24,uuid:"1CBDBBA7-2FC1-423D-BEDE-94A2AB534A94"}
 * @AllowToRunInFind
 */
function editRecord() 
{
	forms.ma_sec_table_filter_dtl.controller.loadRecords(foundset);
	
	if(filter_value)
	{
		var selectedValues = foundset.filter_value.split(',').map(function(value){ return parseInt(value); });
		
		forms.ma_sec_table_filter_dtl.elements.values.removeAllTabs();
		forms.ma_sec_table_filter_dtl.updateValues(selectedValues);
	}
	
	globals.svy_mod_showFormInDialog(forms.ma_sec_table_filter_dtl, null, null, null, null, null, true, false, 'table_filter');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E131843E-D8CA-48B3-8776-FEE5AB4D851A"}
 */
function addRecord(event) {
	controller.newRecord();
	forms.ma_sec_table_filter_dtl.controller.loadRecords(foundset);
	forms.ma_sec_table_filter_dtl.elements.values.removeAllTabs();
	
	globals.svy_mod_showFormInDialog(forms.ma_sec_table_filter_dtl, null, null, null, null, null, true, false, 'table_filter');
}
