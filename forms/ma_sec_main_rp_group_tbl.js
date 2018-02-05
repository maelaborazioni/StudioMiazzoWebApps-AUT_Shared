
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"804E7102-C8D3-438A-8621-ADD8787F3014"}
 */
function onActionBtnDelete(event) 
{
	if(!foundset.deleteRecord())
		globals.ma_utl_showErrorDialog('Errore durante l\'eliminazione dell\'organizzazione','')
}
