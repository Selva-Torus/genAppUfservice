import React, { useState, useRef, useEffect, useContext } from "react";
import { DownArrow, SearchIcon } from "./svgApplication";
import useClickOutside from "./useClickOutsideRef";
import { TotalContext, TotalContextProps } from "@/app/globalContext";
import { useGravityThemeClass } from "../utils/useGravityUITheme";

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
                <span style={{ fontSize: "0.62vw" }}>
                    {grp[parentKey]}
                </span>
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
                        ? "w-[13.33vw]"
                        : groupKey == "roleGrp"
                            ? "w-[10.52vw]"
                            : groupKey == "psGrp"
                                ? "w-[12.18vw]"
                                : "w-[40vw]"
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
                    className={`flex flex-col gap-1 absolute z-20 ${dropUp ? "bottom-full mb-[0.5vw]" : "top-full mt-[0.5vw]"
                        } ${filteredData.length > 2 ? "h-[21.5vh] overflow-y-auto" : ""} ${groupKey == "orgGrp"
                            ? "w-[13.33vw]"
                            : groupKey == "roleGrp"
                                ? "w-[10.52vw]"
                                : groupKey == "psGrp"
                                    ? "w-[12.18vw]"
                                    : ""
                        } p-[0.5vw] rounded border`}
                >
                    {/* Search input */}
                    <div
                        className="relative items-center h-[4vh]"
                        onClick={() => searchInputRef.current?.focus()}
                    >
                        <span className="absolute inset-y-0 left-0 flex p-[0.58vw] h-[2.18vw] w-[2.18vw]">
                            <SearchIcon
                                fill={"#000000"}
                                height="0.83vw"
                                width="0.83vw"
                            />
                        </span>
                        <input
                            autoFocus
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            onFocus={(e) => (e.target.style.borderColor = brandcolor)}
                            onBlur={(e) =>
                                (e.target.style.borderColor = "#00000026")
                            }
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: "#000000",
                                fontSize: `0.72vw`,
                                borderColor: "#00000026",
                            }}
                            className={`${groupKey == "orgGrp"
                                    ? "w-[12.33vw]"
                                    : groupKey == "roleGrp"
                                        ? "w-[9.52vw]"
                                        : groupKey == "psGrp"
                                            ? "w-[11.18vw]"
                                            : ""
                                } p-[0.29vw] h-[4vh] focus:outline-none border pl-[1.76vw] font-medium rounded-md`}
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
                                        className="flex gap-[0.5vw] items-center outline-none"
                                        key={grp[groupCodeKey]}
                                        onClick={() => handleSelectGrp(grp)}
                                    >
                                        <input
                                            className="w-[0.72vw] h-[0.72vw]"
                                            type="checkbox"
                                            style={{ accentColor: brandcolor }}
                                            checked={isParentSelected}
                                            readOnly
                                        />
                                        <span>{grp[groupNameKey]}</span>
                                        <span className="w-full text-end">
                                            {handleParentHierarchy(grp)}
                                        </span>
                                    </button>

                                    {/* Members */}
                                    <div className="flex flex-col gap-1 ml-[1.5vw]">
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
                                                        className="w-[0.72vw] h-[0.72vw]"
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