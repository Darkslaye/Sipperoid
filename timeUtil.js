const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function getNextWeekdayTime(weekday, hourUTC, minuteUTC = 0) {
    const now = new Date();
    let result = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        hourUTC,
        minuteUTC,
        0,
        0
    ));
    let dayDiff = (weekday - result.getUTCDay() + 7) % 7;
    if (dayDiff === 0 && result <= now) dayDiff = 7;
    result.setUTCDate(result.getUTCDate() + dayDiff);
    return result;
}

function getNextMonthDayTime(day, hourUTC, minuteUTC = 0) {
    const now = new Date();
    let year = now.getUTCFullYear();
    let month = now.getUTCMonth();
    let result = new Date(Date.UTC(year, month, day, hourUTC, minuteUTC, 0, 0));
    if (result <= now) {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
        result = new Date(Date.UTC(year, month, day, hourUTC, minuteUTC, 0, 0));
    }
    return result;
}

function getLastMondayOfMonth(hourUTC, minuteUTC = 0) {
    const now = new Date();
    let year = now.getUTCFullYear();
    let month = now.getUTCMonth();
    let lastDay = new Date(Date.UTC(year, month + 1, 0, hourUTC, minuteUTC, 0, 0));
    let day = lastDay.getUTCDay();
    let diff = (day >= 1) ? day - 1 : 6; 
    let monday = new Date(lastDay);
    monday.setUTCDate(lastDay.getUTCDate() - diff);
    return monday;
}

function getTimeUntilNextRaid() {
    const nextRaid = getNextWeekdayTime(5, 7, 0);
    return nextRaid - new Date();
}

function getTimeUntilNextCWL() {
    const nextCWL = getNextMonthDayTime(1, 8, 0);
    return nextCWL - new Date();
}

function getTimeUntilEndingEoS() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));

    let lastMonday = new Date(lastDayOfMonth);
    while (lastMonday.getUTCDay() !== 1) {
        lastMonday.setUTCDate(lastMonday.getUTCDate() - 1);
    }

    lastMonday.setUTCHours(5, 0, 0, 0);

    if (now > lastMonday) {
        const nextMonth = new Date(Date.UTC(year, month + 1, 1));
        const nextMonthLastDay = new Date(Date.UTC(nextMonth.getUTCFullYear(), nextMonth.getUTCMonth() + 1, 0));
        let nextLastMonday = new Date(nextMonthLastDay);
        while (nextLastMonday.getUTCDay() !== 1) {
            nextLastMonday.setUTCDate(nextLastMonday.getUTCDate() - 1);
        }
        nextLastMonday.setUTCHours(5, 0, 0, 0);
        return nextLastMonday - now;
    }

    return lastMonday - now;
}

function getTimeUntilEndingRaid() {
    const nextRaidEnd = getNextWeekdayTime(1, 7, 0);
    return nextRaidEnd - new Date();
}

function getTimeUntilEndingCWL() {
    const nextCwlEnd = getNextMonthDayTime(10, 8, 0);
    return nextCwlEnd - new Date();
}

module.exports = {
    getTimeUntilNextRaid,
    getTimeUntilNextCWL,
    getTimeUntilEndingEoS,
    getTimeUntilEndingRaid,
    getTimeUntilEndingCWL
};