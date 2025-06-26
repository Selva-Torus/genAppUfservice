import React, { useEffect, useRef, useState } from "react";
import { DatePicker, DatePickerProps } from "@gravity-ui/date-components";
import { CiCalendar } from "react-icons/ci";
import { Button, Modal, Tabs, TextInput } from "@gravity-ui/uikit";
import { dateTime, DateTime, dateTimeParse } from "@gravity-ui/date-utils";
import { date, set } from "valibot";




interface TorusDatePickerProps extends DatePickerProps {
    range?: Boolean;
}



const formatISO = (date: DateTime | null) =>
    date ? date.toISOString() : "";

const formatDisplay = (date: DateTime | null) => {
    if (!date) return null;
    const str = date.toISOString();
    const [y, m, d] = str.split("T")[0].split("-").map(Number);
    return `${d}/${m}/${y}`;
}

const TorusDatePicker: React.FC<TorusDatePickerProps> = ({
    onUpdate,
    value,
    label,
    range,
    ...props
}) => {
    const handleUpdate = (data: any) => {
        if (onUpdate && dateTimeParse(data) !== undefined && dateTimeParse(data) !== null) {
            let updateVal = formatISO(data);
            onUpdate(updateVal as any);
        }
    };

    const handleUpdation = (data: any) => {
        if (onUpdate && data !== undefined && data !== null) {
            onUpdate(data);
        }
    };

    return range ? (
        <RangeDatePicker range value={value} onUpdate={handleUpdation} {...props} />
    ) : (
        <DatePicker
            {...props}
            value={value ? dateTimeParse(value) : null}
            onUpdate={handleUpdate}
            label={label}
        />
    );
}

export default TorusDatePicker;

function RangeDatePicker({ range, value, onUpdate, ...props }: TorusDatePickerProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("main");
    const [selected, setSelected] = useState("");

    const [tempStartDate, setTempStartDate] = useState<DateTime | null>(null);
    const [tempEndDate, setTempEndDate] = useState<DateTime | null>(null);

    useEffect(() => {
        if (value) {
            const dateToString = value.toString();
            const splited = dateToString.split(" - ");
            const start = dateTimeParse(splited[0]);
            const end = dateTimeParse(splited[1]);
            setTempStartDate(dateTimeParse(start) as DateTime);
            setTempEndDate(dateTimeParse(end) as DateTime);
        }
    }, [])

    useEffect(() => {
        if (selected) {
            setTempStartDate(dateFinaliser("start") as DateTime);
            setTempEndDate(dateFinaliser("end") as DateTime);
        }
    }, [selected]);

    const mainList = [
        { label: "One Day", key: "today" },
        { label: "Last Week", key: "lastWeek" },
        { label: "Next Week", key: "nextWeek" },
        { label: "Last Month", key: "lastMonth" },
        { label: "Last 30 Days", key: "last30Days" },
        { label: "Next Month", key: "nextMonth" },
    ];

    const dateFinaliser = (option: "start" | "end") => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        switch (selected) {
            case "today":
                startDate = now;
                endDate = now;
                break;
            case "lastWeek":
                startDate.setDate(now.getDate() - 7);
                endDate.setDate(now.getDate() - 1);
                break;
            case "nextWeek":
                startDate.setDate(now.getDate() + 1);
                endDate.setDate(now.getDate() + 7);
                break;
            case "lastMonth":
                startDate.setMonth(now.getMonth() - 1, 1);
                endDate = new Date(startDate);
                endDate.setMonth(now.getMonth(), 0);
                break;
            case "last30Days":
                startDate.setDate(now.getDate() - 30);
                endDate = now;
                break;
            case "nextMonth":
                startDate.setMonth(now.getMonth() + 1, 1);
                endDate = new Date(startDate);
                endDate.setMonth(startDate.getMonth() + 1, 0);
                break;
            default:
                return dateTime();
        }

        return option === "start" ? dateTimeParse(startDate) : dateTimeParse(endDate);
    };

    const handleApply = () => {
        if (onUpdate) {
            let mergedVal = `${formatISO(tempStartDate)} - ${formatISO(tempEndDate)}`;
            if (onUpdate && mergedVal !== undefined && mergedVal !== null) {
                if (mergedVal) {
                    onUpdate(mergedVal as any);
                }
            }
        }
        setOpen(false);
    };

    const handleStartUpdate = (data: any) => {
        if (setTempStartDate && dateTimeParse(data) !== undefined && dateTimeParse(data) !== null) {
            setTempStartDate(dateTimeParse(data) as DateTime);
        }
    }

    const handleEndUpdate = (data: any) => {
        if (setTempEndDate && dateTimeParse(data) !== undefined && dateTimeParse(data) !== null) {
            setTempEndDate(dateTimeParse(data) as DateTime);
        }
    }

    return (
        <>
            <div className="flex justify-center items-center gap-1 " >
                <TextInput
                    value={value ? `${formatDisplay(tempStartDate)}-${formatDisplay(tempEndDate)}` : ""}
                    placeholder={"Range date"}
                    autoComplete="off"
                    className="select-none"
                    size={props.size}
                    endContent={
                        <span
                            className="cursor-pointer rounded-md hover:shadow-sm"
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <CiCalendar size={14} />
                        </span>
                    }
                    view={"normal"}
                    readOnly
                />
            </div>


            <Modal
                open={open}
                onClose={() => setOpen(false)}
                contentClassName="flex justify-center items-center w-[100%] h-[100%] overflow-hidden "
                className="flex justify-center items-center w-[100%] h-[100%] "
                contentOverflow="visible"
            >
                <div className="p-2 bg-white shadow-md rounded-md w-full h-full flex flex-col gap-2 items-start justify-center">
                    <div className={` w-[30vw] h-[65vh] `}>
                        <div className="flex flex-col gap-2">

                            <TorusDatePicker
                                value={dateTimeParse(tempStartDate)}
                                onUpdate={handleStartUpdate}
                                label="Start Date"
                                size="l"
                                
                            />

                            <TorusDatePicker
                                value={dateTimeParse(tempEndDate)}
                                onUpdate={handleEndUpdate}
                                label="End Date"
                                size="l"

                            />

                            <div className="w-full flex justify-center items-center my-1" >
                                <Button
                                    width="max"
                                    view="flat"
                                    onClick={handleApply}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>

                        <div className="w-full h-[67%]">
                            <Tabs
                                activeTab={activeTab}
                                items={[
                                    { title: "Main", id: "main" },
                                    { title: "Others", id: "other", disabled: true },
                                ]}
                                onSelectTab={(id) => setActiveTab(id)}
                            />

                            {activeTab === "main" ? (
                                <div className="flex flex-col gap-2">
                                    {mainList.map((item) => (
                                        <p
                                            key={item.key}
                                            className={`select-none font-normal py-1 text-sm cursor-pointer ${selected === item.key ? "text-blue-500 font-semibold" : ""}`}
                                            onClick={() => {
                                                setSelected(item.key);
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <span>Other</span>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
