export type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export const sampleMedicine: medicine = {
    id: "1",
    name: "Amoxicillin",
    quantity: 1,
    times: ["08:00", "20:00"],
    days: ["M", "W", "F"],
    amountBought: 1,
    amountRemaining: 1,
    color: "bg-blue-500",

};

/* proposed

export type doctor = {
    id: string;
    name: string;
    specialization: string;
    color: string;
}

export type appointment = {
    id: string;
    doctorName: doctor;
    date: number;
    time: string;
}

*/

//current
export type appointment = {
    id: string;
    doctorName: string;
    date: number;
    time: string;
}

export type medicine = {
    id: string;
    name: string;
    quantity: number;
    times: string[];
    days: day[];
    amountBought: number;
    amountRemaining: number;
    color: string;

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

export type groupedMedsByHours = {
    hour: string;
    medicines: medicine[];
}

export type groupedMedsByDays = {
    day: day;
    medicines: medicine[];
}

export type groupedAppointmentsByDate = {
    date: number;
    appointments: appointment[];
}
