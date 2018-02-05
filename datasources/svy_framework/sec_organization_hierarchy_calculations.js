/**
 * @properties={type:12,typeid:36,uuid:"2C726587-AC8F-4A96-AE55-F01911BE902A"}
 */
function icon_calc()
{
	if(parent_organization_id)
		return 'media:///program_orange.png';
	else
		return 'media:///folder_16.png';
}

/**
 * @type {UUID}
 * @properties={type:12,typeid:36,uuid:"3AC4A7C1-71AD-47AD-83B7-38D28F030427"}
 */
function owner_id_calc()
{
	return sec_organization_hierarchy_to_sec_organization.owner_id;
}

/**
 * @properties={type:12,typeid:36,uuid:"3C786D2F-585D-4015-B7F7-D6E10F683602"}
 */
function name_calc_org_hierarchy()
{
	return 'sec_organization_hierarchy_to_sec_organization.name asc';
}
