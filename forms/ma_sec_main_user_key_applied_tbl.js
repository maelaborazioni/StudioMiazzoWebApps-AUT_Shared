/**
 * @properties={typeid:24,uuid:"228D91B1-0195-4446-BF0C-0BE9F57A541F"}
 */
function loadRecords() {
	var _ds = databaseManager.createEmptyDataSet(0, ['security_key_id']);
	
	if (forms.ma_sec_main_user_security.foundset.user_org_id) {		
		//_ds = globals.svy_sec_getUserOrgSecurityKeys(forms.ma_sec_main_user_security.foundset.user_org_id)
		_ds = globals.ma_sec_getSecurityKeys
			(
				  forms.ma_sec_main_user_security.foundset.user_org_id
				, forms.ma_sec_main_user_security.user_id
				, forms.ma_sec_main_user_security.sec_user_org_to_sec_organization.owner_id.toString()
				, -1
			);
	}
	
	foundset.loadRecords(_ds);
}
