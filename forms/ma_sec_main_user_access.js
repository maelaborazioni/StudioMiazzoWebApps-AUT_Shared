/**
 * Predispone l'associazione del lavoratore ad uno o più ruoli 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3FF3F6E2-FA57-480A-B88A-7398443D4481"}
 */
function addOrganization(event) {
	forms.ma_sec_main_user_organization_tbl.addRecord(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E0F8A79B-E8A8-4520-8A66-21325236CBF6"}
 */
function addPassword(event) 
{
	forms.ma_sec_main_user_password_tbl.addRecord(event);
}
