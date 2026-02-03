import { hexWithOpacity, isLightColor } from "../../../components/utils";

export const hasMatchingOrgOrSubOrg = (
  org: any,
  searchTerm: string
): boolean => {
  if (!searchTerm) return true;

  const lowerSearch = searchTerm.toLowerCase();

  // Check if org name matches
  if (org.orgName?.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  // Check all subOrgGrps in this org
  if (org.subOrgGrp?.length > 0) {
    return org.subOrgGrp.some((subOrgGrp: any) =>
      hasMatchingSubOrg(subOrgGrp, searchTerm)
    );
  }

  return false;
};

// Helper function to check if subOrg or any nested subOrg matches search
export const hasMatchingSubOrg = (
  subOrgGrp: any,
  searchTerm: string
): boolean => {
  if (!searchTerm) return true;

  const lowerSearch = searchTerm.toLowerCase();

  // Check if group name matches
  if (subOrgGrp.subOrgGrpName?.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  // Check all subOrgs in this group
  return (
    subOrgGrp.subOrg?.some((subOrg: any) => {
      // Check if this subOrg name matches
      if (subOrg.subOrgName?.toLowerCase().includes(lowerSearch)) {
        return true;
      }

      // Recursively check nested subOrgGrp
      if (subOrg.subOrgGrp?.length > 0) {
        return subOrg.subOrgGrp.some((nested: any) =>
          hasMatchingSubOrg(nested, searchTerm)
        );
      }

      return false;
    }) || false
  );
};

// Check if psGrp or any of its ps members match search
export const hasMatchingPsGrpOrPs = (
  psGrp: any,
  searchTerm: string
): boolean => {
  if (!searchTerm) return true;

  const lowerSearch = searchTerm.toLowerCase();

  // Check if psGrp name matches
  if (psGrp.psGrpName?.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  // Check if any ps in this group matches
  return (
    psGrp.ps?.some((ps: any) =>
      ps.psName?.toLowerCase().includes(lowerSearch)
    ) || false
  );
};

// Check if roleGrp or any of its roles match search
export const hasMatchingRoleGrpOrRole = (
  roleGrp: any,
  searchTerm: string
): boolean => {
  if (!searchTerm) return true;

  const lowerSearch = searchTerm.toLowerCase();

  // Check if roleGrp name matches
  if (roleGrp.roleGrpName?.toLowerCase().includes(lowerSearch)) {
    return true;
  }

  // Check if any role in this group matches
  return (
    roleGrp.roles?.some((role: any) =>
      role.roleName?.toLowerCase().includes(lowerSearch)
    ) || false
  );
};

// ============= HIGHLIGHT TEXT HELPER =============
export const highlightText = (
  text: string,
  searchTerm: string,
  accentColor: string
) => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span
            key={i}
            style={{ backgroundColor: hexWithOpacity(accentColor, 0.3) }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};