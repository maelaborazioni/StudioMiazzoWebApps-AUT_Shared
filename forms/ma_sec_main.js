/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"15AE9F49-C268-4FCD-9A50-2D30319452DE"}
 */
var vOwner_ID = null;

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BCDB6ED8-DD86-48CF-9D63-B5A1AAC84E7C"}
 */
function onLoad(event)
{
	foundset.loadAllRecords();
	foundset.sort('name asc');
	vOwner_ID = foundset.owner_id;
	changeOwner(null, vOwner_ID, event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} tab the selected tab
 *
 * @properties={typeid:24,uuid:"A17D3908-45D4-42B2-B847-AD8DC02E3EDA"}
 */
function switchTab(event, tab) {
	var tabs = ['owners', 'modules', 'users', 'groups', 'keys'];
	
	for (var i = 0; i < tabs.length; i++) {
		if(elements['tab_'+ tabs[i]])
		{
			if (tabs[i] == tab) {
				elements['tab_left_' + tabs[i]].setImageURL('media:///tab_blue_left.png');
				elements['tab_right_'+ tabs[i]].setImageURL('media:///tab_blue_right.png');
				elements['tab_'+ tabs[i]].setImageURL('media:///tab_blue_btw.png');
				elements['lbl_'+ tabs[i]].setFont('Verdana, 1, 10');
				elements['lbl_'+ tabs[i]].fgcolor = '#ffffff';
			} else {
				elements['tab_left_'+ tabs[i]].setImageURL('media:///tab_grey_left.png');
				elements['tab_right_'+ tabs[i]].setImageURL('media:///tab_grey_right.png');
				elements['tab_'+ tabs[i]].setImageURL('media:///tab_grey_btw.png');
				elements['lbl_'+ tabs[i]].setFont('Verdana, 0, 10');
				elements['lbl_'+ tabs[i]].fgcolor = '#000000';
			}
		}
	}
	
	elements.tab_main.tabIndex = 'tab_' + tab;
}

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
 * @properties={typeid:24,uuid:"4DA384A0-8B3C-46BE-8FDB-FE5B43905D75"}
 */
function changeOwner(oldValue, newValue, event) 
{
	if(newValue)
		globals.lookupFoundset(newValue, foundset);
	
	return true;
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"29C9DEC7-47FE-4F3A-B073-5DA00E2E9C2F"}
 */
function onRecordSelection(event) 
{
	forms.ma_sec_main_key.loadKeys(foundset.owner_id);
}

/**
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8622BF0B-F968-45D5-AC86-6179D3C9CA57"}
 */
function onShow(firstShow, event) 
{
	_super.onShow(firstShow, event);
	switchTab(event,'users');
}
