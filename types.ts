export type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export type appointment = {
    name: string;
    date: number;
    time: string;
}

export type medicine = {
    name: string;
    quantity: number;
    times: string[];
    days: day[];
};

export type Profile = {
    name: string;
    age: number;
    affliction: string;
    medicineSchedule: medicine[];
    appointments: appointment[];
};

