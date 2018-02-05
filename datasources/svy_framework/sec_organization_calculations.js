/**
 * @properties={type:12,typeid:36,uuid:"DA99FAC0-1464-4568-9F0B-EBB8A64C2375"}
 */
function icon_calc()
{
	var fs = sec_organization_to_sec_organization_hierarchy_children;
	if(!fs || fs.getSize() === 0)
		return 'media:///program_orange.png';
	else
		return 'media:///folder_16.png';
}

/**
 * @properties={type:12,typeid:36,uuid:"AE020832-97AD-4476-BBDA-D79FB51C4DCA"}
 */
function name_calc_org()
{
	return 'name asc';
}
