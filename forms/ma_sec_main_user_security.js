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
 * @properties={typeid:24,uuid:"29A695AB-DB68-45D0-A4A5-F2029F3208E9"}
 * @AllowToRunInFind
 */
function onDataChangeOrganizationID(oldValue, newValue, event)
{
	filterOrganization();
	
	if(globals.ma_utl_isFoundSetNullOrEmpty(sec_user_org_to_sec_user_in_group))
		forms.ma_sec_main_user_key_applied_tbl.foundset.clear();
	else
		forms.ma_sec_main_user_key_applied_tbl.loadRecords();
	
	return true;
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"8778A958-8B6C-4ACC-A96F-0DC2C3A7964B"}
 */
function filterOrganization()
{
	foundset.find();
	foundset.organization_id = organizationID;
	foundset.search();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3F6FEF9B-54F3-4435-B925-8A9A25042857"}
 */
function onRecordSelection(event) 
{
	enableDisableForm();
	forms.ma_sec_main_user_key_applied_tbl.loadRecords();
}

/**
 * @properties={typeid:24,uuid:"429D4EFB-AE99-4648-94CD-12AE53354BCD"}
 */
function setValueList() {
	var _vlRealValues = new Array();
	var _vlDisplayValues = new Array();
	var _vlFirstValue = '';
	
	if (databaseManager.hasRecords(forms.ma_sec_main_user.foundset.sec_user_to_sec_user_org)) {
		var _fsUserOrganizations = forms.ma_sec_main_user.foundset.sec_user_to_sec_user_org.duplicateFoundSet();
		_fsUserOrganizations.unrelate();
			
		for (var i = 1; i <= _fsUserOrganizations.getSize(); i++) {
			_fsUserOrganizations.setSelectedIndex(i);
			_vlRealValues[i - 1] = _fsUserOrganizations.organization_id;
			// MAVariazione - Also display the owner's name
			_vlDisplayValues[i - 1] = (_fsUserOrganizations.sec_user_org_to_sec_organization.name && _fsUserOrganizations.sec_user_org_to_sec_organization.sec_organization_to_sec_owner ? _fsUserOrganizations.sec_user_org_to_sec_organization.name + ' - ' + _fsUserOrganizations.sec_user_org_to_sec_organization.sec_organization_to_sec_owner.name : '');
			
			if (i == 1) {
				_vlFirstValue = _fsUserOrganizations.organization_id;
			}
		}
	}
	
	application.setValueListItems('svy_sec_user_organizations', _vlDisplayValues, _vlRealValues);
	organizationID = _vlFirstValue;
	
//	filterOrganization();
}

/**
 * @properties={typeid:24,uuid:"8ED3B65F-66C6-4870-8F00-DF73F570AF8B"}
 */
function enableDisableForm() {
	var _enable = false;
	if (organizationID) {
		_enable = true;
	}
	
	controller.enabled = _enable;
	forms.ma_sec_main_user_group_tbl.controller.enabled = _enable;
	forms.ma_sec_main_user_key_tbl.controller.enabled = _enable;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8C7AAA8A-FCB3-4961-9C79-57E43647B3C7"}
 */
function addGroup(event) {
	forms.ma_sec_main_user_group_tbl.addRecord(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B7B6AA4F-941E-4659-9E79-AC1930CA4789"}
 */
function addKey(event) {
	forms.ma_sec_main_user_key_tbl.addRecord(event);
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1AC2A8BA-8175-4425-8BC6-602CA3EA81DB"}
 */
function onHide(event) 
{
	foundset.loadAllRecords();
	return true
}
