export type user = {
    id: string;
    username: string;
    email: string;
    password: string;
    profileArray: Profile[];
}

export type day = "M" | "T" | "W" | "Th" | "F" | "S" | "Su";

export const sampleMedicine: medicine = {
    id: "1",
    name: "Amoxicillin",
    totalQuantity: 1,
    times: [{ time: "08:00", isTaken: false },
    { time: "20:00", isTaken: false }],
    days: ["M", "W", "F"],
    amountRemaining: 1,
    amountTaken: 0,
    color: "bg-blue-500",

};

export type doctor = {
    id: string;
    name: string;
    specialization: string;
    secretary: string;
    color: string;
    daysAvailable: day[];
}

export type appointment = {
    id: string;
    doctor: doctor;
    date: number;
    time: string;
}

export type medicineTime = {
    time: string;
    isTaken: boolean;
}

export type medicine = {
    id: string;
    name: string;
    totalQuantity: number;
    times: medicineTime[];
    days: day[];
    amountRemaining: number;
    amountTaken: number;
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
