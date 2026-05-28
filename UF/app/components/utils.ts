import _ from "lodash";


export function isLightColor(hex:string) {
  hex = hex.replace("#", "");
  // Ensure valid 6-character hex format
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join(""); // Convert shorthand (e.g., #abc) to full hex
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color format");
  }
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  // Calculate relative luminance (per WCAG standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // If dark (luminance <= 0.5), return white (#fff), else return black (#000)
  return luminance <= 0.5 ? "#fff" : "#000";
}


export function findPath(obj: any, searchValue: any, path = "") {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (JSON.stringify(obj[key]) === JSON.stringify(searchValue)) {
        return path + key;
      } else if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          const result: any = findPath(
            obj[key][i],
            searchValue,
            path + key + "." + i + "."
          );
          if (result) {
            return result;
          }
        }
      } else if (typeof obj[key] === "object") {
        const result: any = findPath(obj[key], searchValue, path + key + ".");
        if (result) {
          return result;
        }
      }
    }
  }
  return null;
}

export const handleDeleteGroupAndMembers = (
  data: any,
  selectedItems: any,
  setSelectedItems: any,
  onUpdate: any,
  saveFunction: (isDeletion: boolean, data?: any) => void
) => {
  var updatedData = _.cloneDeep(data);
  const groupKeys = new Set();
  const memberKeys = new Set();
  Object.entries(selectedItems).forEach(([key, value]) => {
    if (value && key.split(".").length === 1) {
      groupKeys.add(key);
    } else if (value) {
      memberKeys.add(key);
    }
  });

  if (groupKeys.size == 0 && memberKeys.size == 0) {
    return { error: "no selected keys" };
  }
  Array.from(groupKeys)
    .sort((a, b) => Number(b) - Number(a))
    .forEach((key) => {
      updatedData = updatedData.filter(
        (item: any, index: number) => index !== Number(key)
      );
      setSelectedItems((prev: any) => {
        const updatedItems = { ...prev };
        delete updatedItems[key as string];
        return updatedItems;
      });
    });

  Array.from(memberKeys)
    .sort((a, b) => {
      const aParts = (a as string).split(".").map(Number); // Split and convert parts to numbers
      const bParts = (b as string).split(".").map(Number);

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        if ((bParts[i] || 0) !== (aParts[i] || 0)) {
          return (bParts[i] || 0) - (aParts[i] || 0); // Sort descending
        }
      }
      return 0; // Equal parts
    })
    .forEach((key) => {
      if (groupKeys.has((key as string).split(".")[0])) return;
      const parentPath = (key as string).split(".").slice(0, -1).join(".");
      const parentData = _.get(updatedData, parentPath);
      const memberObj = _.get(updatedData, `${key}`);
      if (!parentData) return;
      _.remove(parentData, (obj) => obj === memberObj);
      setSelectedItems((prev: any) => {
        const updatedItems = { ...prev };
        delete updatedItems[key as string];
        return updatedItems;
      });
      _.set(updatedData, parentPath, parentData);
    });
  onUpdate(updatedData);
  saveFunction(true, updatedData);
  setSelectedItems({});
  return { success: "success" };
};

export const handleDelete = (
  data: any,
  selectedRows: any,
  setSelectedRows: any,
  onUpdate: any,
  saveFunction: (isDeletion: boolean, data?: any[]) => void,
  primaryColumn: string
) => {
  const updatedData = new Set(data);
  if (selectedRows.has("all")) {
    updatedData.clear();
  } else {
    selectedRows.forEach((row: any) => {
      updatedData.forEach((item: any) => {
        if (item[primaryColumn] === row) {
          updatedData.delete(item);
        }
      });
    });
  }
  setSelectedRows(new Set([]));
  onUpdate(Array.from(updatedData));
  saveFunction(true, Array.from(updatedData));
};

export function hexWithOpacity(hex: string, opacity: number) {
  // Ensure opacity is between 0 and 1
  opacity = Math.round(opacity * 255);

  // Remove the hash if present
  hex = hex.replace("#", "");

  // Ensure the hex code is valid
  if (hex.length !== 6) {
    throw new Error("Invalid hex color");
  }

  // Convert the opacity to a 2-character hex string
  let alpha = opacity.toString(16).padStart(2, "0").toUpperCase();

  // Return the original hex color with appended alpha value
  return `#${hex}${alpha}`;
}