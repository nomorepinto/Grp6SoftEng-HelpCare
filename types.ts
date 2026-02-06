export type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export const sampleMedicine: medicine = {
    id: "1",
    name: "Amoxicillin",
    quantity: 1,
    times: ["08:00", "20:00"],
    days: ["M", "W", "F"]
};

export type appointment = {
    id: string;
    name: string;
    date: number;
    time: string;
}

export type medicine = {
    id: string;
    name: string;
    quantity: number;
    times: string[];
    days: day[];
};

export type Profile = {
    id: string;
    name: string;
    age: number;
    affliction: string;
    medicineSchedule: medicine[];
    appointments: appointment[];
    isSelected: boolean;
};

