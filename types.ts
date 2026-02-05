export type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export const sampleMedicine: medicine = {
    name: "Amoxicillin",
    quantity: 1,
    times: ["08:00", "20:00"],
    days: ["M", "W", "F"]
};

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
    isSelected: boolean;
};

