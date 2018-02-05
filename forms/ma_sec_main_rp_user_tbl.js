
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"999B3582-CBE0-4BC2-9A05-7036C9B7E861"}
 */
function onActionBtnDelete(event) 
{
	if(!foundset.deleteRecord())
		globals.ma_utl_showErrorDialog('Errore durante l\'eliminazione dell\'utente','')
}
