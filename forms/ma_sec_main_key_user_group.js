
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"89DE6BAB-6816-49BD-BAB4-F495C5A6814C"}
 */
function addGroup(event) {
	forms.ma_sec_main_key_user_group_group_tbl.addRecord(event);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 * 
 * @private
 * 
 * @properties={typeid:24,uuid:"E13FB265-E8BF-43AA-A129-663D8A84A803"}
 */
function addUser(event)
{
	forms.ma_sec_main_key_user_group_user_tbl.addRecord(event);
}

/**
 * @AllowToRunInFind
 * 
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"D7E86906-47A3-40F8-BD12-2AD75AC5CBA8"}
 */
function onRecordSelection(event)
{
	forms.ma_sec_main_key_user_group_group_tbl.foundset.find();
	forms.ma_sec_main_key_user_group_group_tbl.foundset.group_id = '>0';
	forms.ma_sec_main_key_user_group_group_tbl.foundset.search();

	forms.ma_sec_main_key_user_group_user_tbl.foundset.find();
	forms.ma_sec_main_key_user_group_user_tbl.foundset.user_org_id = '>0';
	forms.ma_sec_main_key_user_group_user_tbl.foundset.search();
	
	forms.ma_sec_main_key_user_applied_tbl.loadRecords();
}