import React, { useState, useRef, useEffect, useContext } from "react";
import { DownArrow, SearchIcon } from "./svgApplication";
import useClickOutside from "./useClickOutsideRef";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { useGravityThemeClass } from "../utils/useGravityUITheme";
import { Text } from "@gravity-ui/uikit";

const CustomGrpMemberDropdown = ({
    data,
    groupKey,
    memberKey,
    memberCodeKey,
    memberNameKey,
    groupCodeKey,
    groupNameKey,
    selected,
    setSelected,
    isDisabled = false,
    parentKey = null,
}: any) => {
    const [isOpen, setOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false); // New state to track dropdown position
    const customDropDownRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { property, setProperty } = useContext(TotalContext) as TotalContextProps
    let brandcolor: string = property?.brandColor ?? "#0736c4"
    const themeClass = useGravityThemeClass();

    useClickOutside(customDropDownRef, () => setOpen(false));

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = 200; // Approximate height of dropdown (adjust if necessary)
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            setDropUp(spaceBelow < dropdownHeight);
        }
    }, [isOpen]);

    const filteredData = Object.entries(data)
        .filter(([key, value]) => {
            const hasNonEmptyValue: any = (val: any) => {
                if (typeof val === "string") {
                    return (
                        val.trim() !== "" &&
                        val.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                } else if (Array.isArray(val)) {
                    return val.some((role) => {
                        return Object.values(role).some((v) => {
                            return (
                                typeof v === "string" &&
                                v.trim() !== "" &&
                                v.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                        });
                    });
                }
                return Object.values(val).some((v) => {
                    return hasNonEmptyValue(v);
                });
            };

            if (typeof value === "string") {
                return (
                    value.trim() !== "" &&
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else if (Array.isArray(value)) {
                return value.some((role) => {
                    return Object.values(role).some((val) => {
                        return (
                            typeof val === "string" &&
                            val.trim() !== "" &&
                            val.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    });
                });
            } else {
                return Object.values(value as any).some((val) => hasNonEmptyValue(val));
            }
        })
        .map(([key, value]: any) => ({ ...value, originalIndex: key }));

    const handleSelectGrp = (grp: any) => {
        if (
            selected.some((item: any) => item[groupCodeKey] === grp[groupCodeKey])
        ) {
            setSelected(
                selected.filter((item: any) => item[groupCodeKey] !== grp[groupCodeKey])
            );
        } else {
            setSelected([...selected, grp]);
        }
    };

    const handleSelectMember = (
        grpCode: any,
        member: any,
        isGrpSelected: boolean
    ) => {
        const copyOfSelected = structuredClone(selected);
        if (isGrpSelected) {
            const indexOfSelectedGrp = copyOfSelected.findIndex(
                (grp: any) => grp[groupCodeKey] === grpCode
            );
            const indexOfMemberToBeRemoved = copyOfSelected[indexOfSelectedGrp][
                memberKey
            ].findIndex(
                (memberItem: any) => memberItem[memberCodeKey] === member[memberCodeKey]
            );
            if (copyOfSelected[indexOfSelectedGrp][memberKey].length === 1) {
                copyOfSelected.splice(indexOfSelectedGrp, 1);
            } else {
                copyOfSelected[indexOfSelectedGrp][memberKey].splice(
                    indexOfMemberToBeRemoved,
                    1
                );
            }
        } else {
            const existingIndexOfGrp = copyOfSelected.findIndex(
                (grp: any) => grp[groupCodeKey] === grpCode
            );
            if (existingIndexOfGrp != -1) {
                const existingMemberInGrpIndex = copyOfSelected[existingIndexOfGrp][
                    memberKey
                ].findIndex((m: any) => m[memberCodeKey] === member[memberCodeKey]);
                if (existingMemberInGrpIndex != -1) {
                    if (copyOfSelected[existingIndexOfGrp][memberKey].length === 1) {
                        copyOfSelected.splice(existingIndexOfGrp, 1);
                    } else {
                        copyOfSelected[existingIndexOfGrp][memberKey].splice(
                            existingMemberInGrpIndex,
                            1
                        );
                    }
                } else {
                    copyOfSelected[existingIndexOfGrp][memberKey].push(member);
                }
            } else {
                const grpData = data.find((grp: any) => grp[groupCodeKey] === grpCode);
                const memberData = grpData[memberKey].find(
                    (m: any) => m[memberCodeKey] === member[memberCodeKey]
                );
                copyOfSelected.push({ ...grpData, [memberKey]: [memberData] });
            }
        }
        setSelected(copyOfSelected);
        // setOpen(false);
    };

    const handleParentHierarchy = (grp: any) => {
        if (parentKey) {
            return (
                <Text variant="code-1" >
                    {grp[parentKey]}
                </Text>
            );
        }
    };

    return (
        <div className={`relative m-2 g-root ${themeClass}`} ref={customDropDownRef}>
            <button
                ref={buttonRef}
                style={{
                    borderColor : 'var(--g-color-line-generic)'
                }}
                className={`p-3 outline-none ${groupKey == "orgGrp"
                        ? "w-[220px]"
                        : groupKey == "roleGrp"
                            ? "w-[180px]"
                            : groupKey == "psGrp"
                                ? "w-[200px]"
                                : "w-[220px]"
                    } flex justify-between items-center border rounded disabled:opacity-50 `}
                onClick={() => setOpen(!isOpen)}
                disabled={isDisabled}
            >
                <span>Select {groupKey}</span>
                <span>
                    <DownArrow fill={themeClass.includes ('dark') ? "#ffffff" : "#000000"} />
                </span>
            </button>

            {isOpen && (
                <div
                    style={{
                      borderColor : 'var(--g-color-line-generic)',
                      backgroundColor: 'var(--g-color-base-background)',
                    }}
                    className={`flex flex-col gap-1 absolute z-20 ${dropUp ? "bottom-full mb-0.5" : "top-full mt-0.5"
                        } ${filteredData.length > 2 ? "h-[21.5vh] overflow-y-auto" : ""} ${groupKey == "orgGrp"
                            ? "w-[220px]"
                            : groupKey == "roleGrp"
                                ? "w-[180px]"
                                : groupKey == "psGrp"
                                    ? "w-[200px]"
                                    : ""
                        } p-2 rounded border`}
                >
                    {/* Search input */}
                    <div
                        className="flex rounded-md items-center w-full p-1 gap-2"
                        style={{
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                                borderColor: "#00000026",
                            }}
                        onClick={() => searchInputRef.current?.focus()}
                    >
                            <SearchIcon
                                fill={"#000000"}
                                height="16"
                                width="16"
                            />
                        <input
                            autoFocus
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="border-none outline-none w-full"
                            
                        />
                    </div>

                    {/* Dropdown Content */}
                    {Array.isArray(filteredData) &&
                        filteredData.map((grp: any, index: number) => {
                            const isParentSelected = selected.some(
                                (item: any) => JSON.stringify(item) === JSON.stringify(grp)
                            );

                            return (
                                <div className="flex flex-col gap-1" key={index}>
                                    <button
                                        className="flex gap-1 items-center outline-none"
                                        key={grp[groupCodeKey]}
                                        onClick={() => handleSelectGrp(grp)}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{ accentColor: brandcolor }}
                                            checked={isParentSelected}
                                            readOnly
                                        />
                                        <Text variant="body-2">{grp[groupNameKey]}</Text>
                                        <span className="w-full text-end">
                                            {handleParentHierarchy(grp)}
                                        </span>
                                    </button>

                                    {/* Members */}
                                    <div className="flex flex-col gap-1 ml-3">
                                        {grp[memberKey].map((member: any, memberIndex: number) => {
                                            const existingGrp = selected.find(
                                                (grpdata: any) =>
                                                    grpdata[groupCodeKey] === grp[groupCodeKey]
                                            );
                                            const isMemberSelected = existingGrp
                                                ? existingGrp[memberKey].some(
                                                    (item: any) =>
                                                        item[memberCodeKey] === member[memberCodeKey]
                                                )
                                                : false;

                                            return (
                                                <button
                                                    key={memberIndex}
                                                    className="flex gap-1 items-center outline-none"
                                                    onClick={() =>
                                                        handleSelectMember(
                                                            grp[groupCodeKey],
                                                            member,
                                                            isParentSelected
                                                        )
                                                    }
                                                    aria-label={member[memberCodeKey]}
                                                >
                                                    <input
                                                    type="checkbox"
                                                        style={{ accentColor: brandcolor }}
                                                        checked={isMemberSelected}
                                                        readOnly
                                                    />
                                                    <span>{member[memberNameKey]}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default CustomGrpMemberDropdown;