import { CalendarTheme } from "@marceloterreiro/flash-calendar";
import colors from "tailwindcss/colors";

const textColor = colors.black;
const activeColor = colors.pink[500];
const activeTextColor = colors.black;
const idleBackgroundColor = colors.white;

const baseRadius = 4;
const todayRadius = 30;

const headerAlignment = "left" as const;
const headerWeight = "700" as const;
const headerFamily = "Milliard-ExtraBold";

const separatorWidth = 1;
const separatorStyle = "solid" as const;

export const pinkCalendarTheme: CalendarTheme = {
    rowMonth: {
        content: {
            textAlign: headerAlignment,
            color: textColor,
            fontWeight: headerWeight,
            fontFamily: headerFamily
        },
    },
    rowWeek: {
        container: {
            borderBottomWidth: separatorWidth,
            borderBottomColor: textColor,
            borderStyle: separatorStyle,
        },
    },
    itemWeekName: { content: { color: textColor } },
    itemDayContainer: {
        activeDayFiller: {
            backgroundColor: activeColor,
        },
    },
    itemDay: {
        idle: ({ isPressed, isWeekend }) => ({
            container: {
                backgroundColor: isPressed ? activeColor : idleBackgroundColor,
                borderRadius: baseRadius,
            },
            content: {
                color: isWeekend && !isPressed ? textColor : activeTextColor,
            },
        }),
        today: ({ isPressed }) => ({
            container: {
                borderColor: textColor,
                borderRadius: isPressed ? baseRadius : todayRadius,
                backgroundColor: isPressed ? activeColor : idleBackgroundColor,
            },
            content: {
                color: isPressed ? activeTextColor : textColor,
            },
        }),
        active: ({ isEndOfRange, isStartOfRange }) => ({
            container: {
                backgroundColor: activeColor,
                borderTopLeftRadius: isStartOfRange ? baseRadius : 0,
                borderBottomLeftRadius: isStartOfRange ? baseRadius : 0,
                borderTopRightRadius: isEndOfRange ? baseRadius : 0,
                borderBottomRightRadius: isEndOfRange ? baseRadius : 0,
            },
            content: {
                color: activeTextColor,
            },
        }),
    },
};