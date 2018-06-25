/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C3B573E8-B5EF-4339-BB9B-C4568285A5C6"}
 */
function deleteRecord(event) 
{
	foundset.deleteRecord();
	forms.ma_sec_main_user_key_applied_tbl.loadRecords();	
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
	
	var _query = "SELECT \
		ssk.security_key_id \
	FROM \
		sec_security_key ssk \
	WHERE \
		ssk.security_key_id NOT IN \
		(\
			SELECT \
				security_key_id \
			FROM \
				sec_user_right \
			WHERE \
				group_id = ? \
		)\
		AND \
		(\
			ssk.owner_id = ? \
			OR \
			ssk.owner_id IS NULL \
			AND \
			ssk.module_id IN \
			(\
				SELECT \
					som.module_id \
				FROM \
					sec_owner_in_module som \
				WHERE \
					som.owner_id = ? \
					AND \
					(som.start_date IS NULL OR som.start_date <= ?) \
					AND \
					(som.end_date IS NULL OR som.end_date >= ?) \
			) \
			AND \
			ssk.is_client_selectable = 1 \
		) \
		ORDER BY ssk.name asc;";


	var owner_ID = forms.ma_sec_main.owner_id.toString();
	var group_ID = forms.ma_sec_main_user_group_tbl.group_id;
	var _arguments = 
	[
		group_ID
		, owner_ID
		, owner_ID
		, new Date()
		, new Date()
	];

	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);

	// select new key and add as a user key
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_security_key', _dataSet, ['security_key_id'], ['name'], ['Keys'], [200], 600, true) == 'select') 
	{
		var tempFoundset = forms['svy_sec_selection_dialog_sec_security_key'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) 
		{
			tempFoundset.setSelectedIndex(i);

			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.security_key_id = tempFoundset['security_key_id'];
				foundset.user_id = forms.ma_sec_main_user.user_id;
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
