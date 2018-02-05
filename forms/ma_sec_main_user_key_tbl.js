/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C3B573E8-B5EF-4339-BB9B-C4568285A5C6"}
 */
function deleteRecord(event) {
	foundset.deleteRecord();
	
	forms.svy_sec_main_user_key_applied_tbl.loadRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E7B6E6BA-CB05-44F8-9F40-0FBB74881A78"}
 */
function addRecord(event) 
{
	if(forms.ma_sec_main_user_security.foundset.getSize() == 0)
	{
		globals.ma_utl_showWarningDialog('Nessuna chiave disponibile','Aggiungi chiave singola');
	    return;
	}
	
	var _dataSet = globals.ma_sec_getAvailableSecurityKeys
	(
		  forms.ma_sec_main_user_security.foundset.user_org_id
		, forms.ma_sec_main_user_security.foundset.user_id
		, forms.ma_sec_main_user_security.foundset.sec_user_org_to_sec_organization.owner_id.toString()
	);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_security_key', _dataSet, ['security_key_id'], ['name'], ['Keys'], [200], 600, true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_security_key'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.security_key_id = tempFoundset['security_key_id'];
			}
		}
		
		databaseManager.saveData();		
		forms.ma_sec_main_user_key_applied_tbl.loadRecords();
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
 * @properties={typeid:24,uuid:"D411DE61-3854-4AE6-8395-B73252A3C1AA"}
 */
function onDataChangeIsDenied(oldValue, newValue, event) {
	databaseManager.saveData();
	
	forms.ma_sec_main_user_key_applied_tbl.loadRecords();
	
	return true
}
