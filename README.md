# Requirements Fulfillment Status Report

## A. Functional Requirements

| Requirement | Status | Details |
| :--- | :--- | :--- |
| **1. Allow creating one account for each patient.** | **FULFILLED** | Implemented in `createProfile.tsx`. Profiles are stored in `AsyncStorage` and can be switched via the `NavBar`. |
| **2. Allow removing a patient account.** | **FULFILLED** | The `NavBar` component has a delete function which removes profiles. |
| **3. Receive prescription data (AI OCR or manual).** | **FULFILLED** | AI OCR is implemented in `prescriptionPic.tsx` using Google Gemini. Manual input is implemented in `inputMedicine.tsx`. |
| **4. Create a schedule table (time and day).** | **FULFILLED** | The main dashboard (`index.tsx`) displays both a "Today" schedule (grouped by hour) and a weekly overview. |
| **5. Send reminder notification when medicine is due.** | **NOT FULFILLED** | The system currently lack notification logic and the `expo-notifications` dependency. |
| **6. Track whether the user has logged a dose.** | **FULFILLED** | The `medicineBullet.tsx` component has a "Log Dose" button which updates the `isTaken` status of a specific dose. |
| **7. Track remaining quantity of medicine.** | **FULFILLED** | The `medicine` type Includes `amountRemaining`. It is displayed in `medStock.tsx` and `medicineBullet.tsx`. It updates automatically when a dose is logged. |
| **8. Remove a specific medicine prescription.** | **FULFILLED** | Implemented in `medStock.tsx` via the `deleteMedicine` function. |
| **9. Send reminder notification for low medicine quantity.** | **NOT FULFILLED** | No notification system exists. |
| **10. Send reminder notification for follow-up checkup.** | **NOT FULFILLED** | While doctor appointments can be created via `addAppointment.tsx`, there is no notification logic to remind the user. |

## B. Non-functional Requirements

| Requirement | Status | Details |
| :--- | :--- | :--- |
| **1. AI OCR requires internet; others operable offline.** | **FULFILLED** | AI OCR uses an external API (Gemini), while all other data persistence uses local `AsyncStorage`. |
| **2. Support minimum 10 active patient accounts.** | **FULFILLED** | The profile management logic supports an array of profiles; 10+ accounts are supported by the storage and UI. |
| **3. Only display patient information inputted by caretaker.** | **FULFILLED** | Data is stored locally on the device (caretaker's device) via `AsyncStorage`. |
| **4. Create account in <= 10 taps, log dose in <= 5 taps.** | **PARTIALLY FULFILLED** | Account creation takes ~4 taps. However, dose logging is not implemented. |
| **5. Industry-standard encryption and security protocols.** | **PARTIALLY FULFILLED** | Uses `expo-crypto` for generating unique IDs. However, data in `AsyncStorage` is stored in plain text, which may not meet strict industry standards for medical data. |
| **6. Natively developed for Android and iOS.** | **FULFILLED** | Built using React Native / Expo, which provides native functionality for both platforms. |

---
**Last Updated:** 2026-02-08
