/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2BAE9944-8A63-437C-AC16-8E2E27A39F9D"}
 */
function onShowForm(firstShow, event) 
{
	refreshTree();
}

/**
 * @properties={typeid:24,uuid:"11459301-3931-4EB2-85B9-D5DEDDE8DD53"}
 */
function refreshTree()
{
	forms[elements.tab_organizations.getTabFormNameAt(1)].refreshTree(owner_id);
}

/**
 * @properties={typeid:24,uuid:"B60A66B0-4593-4DDC-BEB7-74E885F50FB5"}
 */
function addOrganization(event)
{
	forms.ma_sec_main_organization_tree.addRecord();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B34E133E-AAD8-4A3B-B159-67C91041A0DA"}
 */
function onRecordSelection(event) 
{
	refreshTree();
	forms.ma_sec_main_organization_tree.clear();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"90A76612-C8B8-4368-8D0F-13656CAC5F45"}
 */
function deleteOrganization(event) 
{
	forms.ma_sec_main_organization_tree.deleteRecord();
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A2E37AD3-85B4-40B4-B249-BE1E878B9754"}
 */
function openPopupMenu(event) 
{
	var popupMenu = plugins.window.createPopupMenu();
	popupMenu.addMenuItem(i18n.getI18NMessage('ma.aut.lbl.add_child'), addChild);
		
	popupMenu.show(event.getSource());
}

/**
 * @properties={typeid:24,uuid:"6BE2C342-3DD7-4BA3-B2BA-55FBE189010F"}
 */
function addChild(item_idx, parent_item_idx, is_selected, parent_menu_text, menu_text, organization_ID)
{
	forms.ma_sec_main_organization_tree.addChild();
}

/**
 * @properties={typeid:24,uuid:"B2E1DE8C-AC3B-4740-8110-F95E8952C2B2"}
 * @AllowToRunInFind
 */
function doSearch() 
{
	if (forms.ma_sec_main.searchArgument) 
	{
		/** @type {JSFoundSet<db:/svy_framework/sec_organization>}*/
		var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization');
		fs.find();
		fs.owner_id = forms.ma_sec_main_owner_organization.owner_id;
		fs.name = '#%' + forms.ma_sec_main.searchArgument + '%';
		
		var size = fs.search();

		if(size > 1)
			globals.ma_utl_showWarningDialog('Più records corrispondono al filtro selezionato, verrà visualizzato solo il primo risultato ottenuto. <br/>\
			                                 Utilizzare un filtro più stringente per migliorare la ricerca.','Filtra ruoli utenti');
		
		forms.ma_sec_main_organization_tree.updateCurrentRecord(fs.organization_id);
		
	} else 
		foundset.loadAllRecords();
}
