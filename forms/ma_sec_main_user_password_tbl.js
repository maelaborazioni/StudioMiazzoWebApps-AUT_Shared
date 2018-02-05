/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"BFB14D43-2F0B-491D-9AFB-8A552DE9DF97"}
 */
function addRecord(event) {
	if (!forms.ma_sec_main_user_access.owner_id) {
		globals.svy_mod_dialogs_global_showErrorDialog(i18n.getI18NMessage('svy.fr.dlg.error'), i18n.getI18NMessage('svy.fr.dlg.cannot_add_password_no_owner'), 'OK');
	} else {
		globals.svy_sec_trigger_form = controller.getName();
		var frm = forms.ma_sec_password_new;
		frm.vChkGestore = true;
		globals.svy_mod_showFormInDialog(frm, null, null, null, null, null, true, false, 'svy_sec_password_new');
	}
}
