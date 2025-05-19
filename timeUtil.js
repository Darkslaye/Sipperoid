const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// Get next occurrence of a weekday at a specific hour/minute of UTC.
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

// Get next occurrence of a day of month at a specific hour/minute - UTC.
function getNextMonthDayTime(day, hourUTC, minuteUTC = 0) {
    const now = new Date();
    let year = now.getUTCFullYear();
    let month = now.getUTCMonth();
    let result = new Date(Date.UTC(year, month, day, hourUTC, minuteUTC, 0, 0));
    if (result <= now) {
        // Move to next month
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
        result = new Date(Date.UTC(year, month, day, hourUTC, minuteUTC, 0, 0));
    }
    return result;
}

// Get last Monday of the month at a specific hour/minute (UTC)
function getLastMondayOfMonth(hourUTC, minuteUTC = 0) {
    const now = new Date();
    let year = now.getUTCFullYear();
    let month = now.getUTCMonth();
    // Get last day of this month
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
    // 1st of every month at 8 am UTC
    const nextCWL = getNextMonthDayTime(1, 8, 0);
    return nextCWL - new Date();
}

function getTimeUntilEndingEoS() {
    // Last Monday of every month at 5 am UTC
    const eos = getLastMondayOfMonth(5, 0);
    if (eos > new Date()) {
        return eos - new Date();
    } else {
        // Move to next month
        let year = eos.getUTCFullYear();
        let month = eos.getUTCMonth() + 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
        const nextEos = getLastMondayOfMonth(5, 0, year, month);
        return nextEos - new Date();
    }
}

function getTimeUntilEndingRaid() {
    // 2 am Monday Central Time = 7 am Monday UTC (during DST)
    const nextRaidEnd = getNextWeekdayTime(1, 7, 0); // 1 = Monday
    return nextRaidEnd - new Date();
}

function getTimeUntilEndingCWL() {
    // 10th of every month at 8 am UTC
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