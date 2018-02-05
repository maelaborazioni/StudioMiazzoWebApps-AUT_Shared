/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C0C5E960-F740-4142-AB33-3AFFCF15E2CD"}
 */
function addRecord(event) {
	addTableFilter(event);
//	switch(elements.tabs_70.tabIndex)
//	{
//		case 1:
//			addElementFilter(event);
//			break;
//		case 2:
//			addProgramFilter(event);
//			break;
//		case 3:
//			addTable(event);
//			break;
//		case 4:
//			addTableFilter(event);
//			break;
//	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D6D6EF1C-57B2-43AF-8F70-058D1BD05D98"}
 */
function addTableFilter(event) {
	forms.ma_sec_main_key_table_filter_tbl.addRecord(event);
}
