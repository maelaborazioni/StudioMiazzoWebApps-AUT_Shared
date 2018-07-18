/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C512C009-FB27-4D6B-9A53-524EDFE72D07"}
 */
function addRecord(event) 
{
	elements.tab_security_details.enabled = true;

	foundset.newRecord();
	owner_id = forms.ma_sec_main.owner_id;
	is_client = 1;
	is_client_selectable = 1;
}

/**
 * @properties={typeid:24,uuid:"A6FD0C4A-8B59-4AD6-A223-DE7C18CF662A"}
 */
function loadKeys(owner_ID) 
{
	foundset.removeFoundSetFilterParam('ftr_self_owner');
	foundset.addFoundSetFilterParam('owner_id', '^||' + globals.ComparisonOperator.EQ, owner_ID, 'ftr_self_owner');
	foundset.loadAllRecords();
}

/**
 * @properties={typeid:24,uuid:"B3794C00-DD9D-431C-9DC0-739533227F86"}
 */
function onLoad(event)
{
	foundset.addFoundSetFilterParam('is_client', globals.ComparisonOperator.EQ, 1, 'ftr_is_client');
}

/**
 * @properties={typeid:24,uuid:"1CAFD51E-8EDF-421F-844E-923F6920D5A9"}
 * @AllowToRunInFind
 */
function onShow(event, firstShow) 
{
	if (firstShow) {
		switchTab(null, 'rights');
	}
	
	doSearch();
	
	elements.tab_security_details.enabled = foundset && foundset.getSize() > 0;
	
//	/** @type {JSFoundSet<db:/ma_anagrafiche/gruppi>} */
//	var fsGruppi = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.GRUPPI);
//	fsGruppi.loadAllRecords();
//	var enableTabGruppi = fsGruppi.getSize() ? true : false;
//	elements.lbl_groups.visible =
//		elements.tab_groups.visible = 
//			elements.tab_left_groups.visible = 
//				elements.tab_right_groups.visible = enableTabGruppi;
}

/**
 * @properties={typeid:24,uuid:"5BE703CF-257E-411B-94EB-2D256A74DD39"}
 * @AllowToRunInFind
 */
function doSearch() 
{
	foundset.find();
	foundset.owner_id = _to_sec_owner$owner_id.owner_id;
	
	if (forms.ma_sec_main.searchArgument) 
		foundset.name = '#%' + forms.ma_sec_main.searchArgument + '%';
	else 
	{
		foundset.is_client = 1;
		foundset.is_client_selectable = 1;
	}
	foundset.search();	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 * @param {String} tab the selected tab
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A0017416-1A85-4BF8-A674-057B86A24C2E"}
 */
function switchTab(event, tab) {
	var tabs = ['rights','users_groups','groups','owners_modules'];
	
	for (var i = 0; i < tabs.length; i++) {
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
	elements.tab_security_details.tabIndex = 'tab_' + tab;
}
