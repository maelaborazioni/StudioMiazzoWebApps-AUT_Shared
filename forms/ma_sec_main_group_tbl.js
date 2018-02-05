/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
// * @private
 *
 * @properties={typeid:24,uuid:"DD49762B-2FCE-4F58-B739-9FFCFA5E392F"}
 */
function addRecord(event) {
	foundset.newRecord();
	forms.ma_sec_main_group.foundset.owner_id = globals.svy_sec_lgn_owner_id;
	forms.ma_sec_main_group.controller.focusFirstField();
}
