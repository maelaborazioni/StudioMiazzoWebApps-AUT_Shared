
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1BCAEF15-DAA5-4676-AF83-A896F9DD24D4"}
 */
function onActionBtnExclude(event) {
	databaseManager.startTransaction();
	databaseManager.commitTransaction();
}
