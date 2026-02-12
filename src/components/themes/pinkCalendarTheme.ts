import { CalendarTheme } from "@marceloterreiro/flash-calendar";
import colors from "tailwindcss/colors";

const textColor = colors.black;
const activeColor = colors.pink[500];
const activeTextColor = colors.black;
const idleBackgroundColor = colors.white;

const baseRadius = 30;
const todayRadius = 30;

const headerAlignment = "left" as const;
const headerWeight = 1000;
const headerFamily = "Milliard-ExtraBold";
const bodyFamily = "Milliard-Medium";

const separatorWidth = 1;
const separatorStyle = "solid" as const;

export const pinkCalendarTheme: CalendarTheme = {
    rowMonth: {
        content: {
            textAlign: headerAlignment,
            color: activeColor,
            fontFamily: headerFamily,
            fontSize: 20,
            height: 40
        },
    },
    rowWeek: {
        container: {
            borderBottomWidth: separatorWidth,
            borderBottomColor: textColor,
            borderStyle: separatorStyle,
        },
    },
    itemWeekName: { content: { color: textColor, fontFamily: headerFamily, fontSize: 16 } },
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
                color: isPressed ? colors.white : textColor,
                fontFamily: bodyFamily,
                fontSize: 16,
            },
        }),
        today: ({ isPressed }) => ({
            container: {
                borderColor: activeColor,
                borderRadius: isPressed ? baseRadius : todayRadius,
                backgroundColor: isPressed ? activeColor : idleBackgroundColor,
            },
            content: {
                color: isPressed ? activeTextColor : textColor,
                fontFamily: bodyFamily,
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
                color: colors.white,
                fontFamily: bodyFamily,
            },
        }),
    },
};