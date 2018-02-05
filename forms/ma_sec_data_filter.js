/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9CBAB9B9-3E4E-42C9-9EC4-268A08D3AE74"}
 */
function onLoad(event) 
{
	/**
	 * Disabilita i filtri sui gruppi se non disponse del modulo autorizzazioni
	 */
	if(!globals.ma_utl_hasModule(globals.Module.AUTORIZZAZIONI))
		elements.filtri.setTabEnabledAt(5, false);
}
