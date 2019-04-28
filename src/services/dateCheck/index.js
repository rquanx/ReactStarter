/**
 * 读取对应年份和月份的日数
 * @param {number} year 
 * @param {number} month 
 */
function getDayNumber(year, month) {
    let d = new Date(year, month, 0);
    return d.getDate();
}

/**
 * 读取当前日期作结束日期
 * @returns endDate
 */
function getNowDateAsEnd() {
    let endDate = new Date();
    endDate.setHours(23, 59, 59,999);
    return endDate;
}

/**
 * 获取日期对象的日、月、年
 * @param {Date} date 
 */
function getDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return {
        day,
        month,
        year
    }
}

/**
 * 比较起始日期和结束日期是否超过间隔
 * @param {Date} start 
 * @param {Date} end 
 * @param {number} interval 
 * @param {(start:Date,interval:number,action:string) => Date} getDate 
 */
function compareDate(start, end, interval, getDate) {
    let result = true;
    let endDate = getDate(start, interval, action.Add);
    if (endDate < end) {
        result = false;
    }
    return result;
}

function checkDateInvalid(date) {
    if (typeof date === "string" && date.length > 1) {
        date = new Date(date);
    }
    return date;
}

/**
 * 根据传入的日期函数返回检查函数
 * @param {(start:Date,interval:number,action:string) => Date} getDate 
 */
function checkDate(getDate) {
    /**
     * 检查函数
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @param {number} interval 
     */
    function check(startDate, endDate, interval) {
        startDate = checkDateInvalid(startDate);
        endDate = checkDateInvalid(endDate);

        let result = false;
        let message = "startDate is greater than endDate,please check";
        let errorCode = -1;
        
        if (!(startDate && endDate)) {
            if (!startDate && !endDate) {
                endDate = getNowDateAsEnd();
            }
            if (!startDate && endDate) {
                startDate = getDate(endDate, interval, "Reduce");
            }
            if (startDate && !endDate) {
                endDate = getDate(startDate, interval, "Add");
            }
            result = true;
        } else if (startDate <= endDate) {
            errorCode = -2;
            message = "select date interval in over interval";
            result = compareDate(startDate, endDate, interval, getDate);
        }
        if (result) {
            errorCode = 0;
            message = "";
        }
        return {
            result,
            startDate,
            endDate,
            message,
            errorCode
        }
    }
    return check;
}

let action = {
    Add: "Add",
    Reduce: "Reduce"
};

var common = {
    getDayNumber,
    getNowDateAsEnd,
    checkDate,
    action,
    getDate
};

/**
 * 根据传入的间隔、时间、操作，计算下一个日期
 * @param {Date} date           
 * @param {number} intervalYear     间隔x年或x年内
 * @param {string} action   "Add" / "Reduce"   add是传入起始日期,reduce是传入结束日期 
 */
function getDate$1(date, intervalYear, action) {
    let {
        day,
        month,
        year
    } = common.getDate(date);
    year = action === common.action.Add ? year + intervalYear : year - intervalYear;
    if (day > common.getDayNumber(year, month)) {
        day = common.getDayNumber(year, month);
    }
    return action === common.action.Add ? new Date(year, month - 1, day, 23, 59, 59,999) : new Date(year, month - 1, day, 0, 0, 0,0);
}

let year = common.checkDate(getDate$1);

/**
 * 根据传入的间隔、时间、操作，计算下一个日期
 * @param {Date} date           
 * @param {number} intervalMonth     间隔x月或x月内
 * @param {string} action   "Add" / "Reduce"   add是传入起始日期,reduce是传入结束日期 
 */
function getDate$2(date, intervalMonth, action) {
    let {
        day,
        month,
        year
    } = common.getDate(date);
    month = action === common.action.Add ? month + intervalMonth : month - intervalMonth;
    while (month < 1) {
        year -= 1;
        month += 12;
    }

    while (month > 12) {
        year += 1;
        month -= 12;
    }

    let newDay = common.getDayNumber(year, month);
    if (day > newDay) {
        day = newDay;
    }
    return action === common.action.Add ? new Date(year, month - 1, day, 23, 59, 59,999) : new Date(year, month - 1, day, 0, 0, 0,0);
}

let month = common.checkDate(getDate$2);

/**
 * 根据传入的间隔、时间、操作，计算下一个日期
 * @param {Date} date           
 * @param {number} intervalDay     间隔x日或x日内
 * @param {string} action   "Add" / "Reduce"   add是传入起始日期,reduce是传入结束日期 
 */
function getDate$3(date, intervalDay, action) {
    let {
        day,
        month,
        year
    } = common.getDate(date);
    day = action === common.action.Add ? day + intervalDay : day - intervalDay;
    while (day < 1) {
        month -= 1;
        day += common.getDayNumber(year, month);
        if (month < 1) {
            year -= 1;
            month = 12;
        }
    }

    while (day > common.getDayNumber(year, month)) {
        day -= common.getDayNumber(year, month);
        month += 1;
        if (month > 12) {
            year += 1;
            month = 1;
        }
    }
    return action === common.action.Add ? new Date(year, month - 1, day, 23, 59, 59,999) : new Date(year, month - 1, day, 0, 0, 0,0);
}

let day = common.checkDate(getDate$3);

let dateCheck = {
    Day: day,
    Month: month,
    Year: year
};

export default dateCheck;
