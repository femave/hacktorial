const SATURDAY = 6,
    SUNDAY = 0,
    DEFAULT_CLOCK = [{
        clock_in: '9:00',
        clock_out: '13:00'
    }, {
        clock_in: '14:00',
        clock_out: '18:00'
    }];

class Hacktorial {
    constructor(year, month, clock = null, holidays = []) {
        console.info("Inititating...",year, month);
        this.clock = this.setClock(clock);
        this.thisYear = new Date().getUTCFullYear();
        this.year = year || this.thisYear;
        this.thisMonth = new Date().getMonth() + 1;
        this.month = month || this.thisMonth;
        this.holidays = holidays;
        this.currentMonth = this.year == this.thisYear && this.month == this.thisMonth;
    }

    help() {
        console.log('================================HELP================================');
        console.log('Usage: new Hacktorial(year, month, clock)');
        console.log('Arguments:');
        console.log('[OPTIONAL] Year  [Integer] e.g. 2019                 DEFAULT => current year');
        console.log('[OPTIONAL] Month [Integer] e.g. 11 (November)        DEFAULT => current month');
        console.log('[OPTIONAL] Your schedule [Array of Hash]             DEFAULT =>');
        console.log(DEFAULT_CLOCK);
        console.log('[OPTIONAL] Holidays  [Array of Integers] e.g. [4, 5] DEFAULT => null');
        console.log('Functions:');
        console.log('run()\t - Post your shifts');
        console.log('clean()\t - Clean your shifts');
        console.log('=====================================================================');
    }

    run() {
        var self = this;
        this.getPeriod(function () {
            if (self.period_id) {
                self.setWeekdaysInMonth();
            } else {
                console.log('Wait, period id not set!');
                console.log(`Check month: ${self.month} and year: ${self.year}.`);
            }
        });
    }

    clean() {
        this.removeShifts();
    }

    setClock(clock) {
        if (!clock) return DEFAULT_CLOCK;
        if (typeof clock !== "object") throw Error('Clock format must be an object e.g. ' + DEFAULT_CLOCK);
        if (clock.length === undefined || clock.length == 0) throw Error('Clock format must be a valid object e.g. ' + DEFAULT_CLOCK);
        clock.forEach(time => {
            console.log('clock_in: ' + time.clock_in);
            console.log('clock_out: ' + time.clock_out);
        });
        this.clock = clock;
        return clock;
    }

    getPeriod(callback) {
        fetch('https://api.factorialhr.com/attendance/periods?year='+this.year+'&month='+this.month, {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            response.text().then(content => {
                let periods = JSON.parse(content);
                periods.forEach(period => {
                    if (period.month == this.month && period.year == this.year) {
                        if (period.state == 'pending' || period.state == 'in_progress') {
                            console.log("This period id is ", period.id);
                            this.period_id = period.id;
                        } else {
                            console.log(`Hey man!, you cannot update this month, period: ${period.state}`);
                        }
                    }
                });
                if (!!callback) {
                    callback(this);
                }
            });
        });
    }

    setWeekdaysInMonth() {
        let today = this.currentMonth?
            new Date().getDate():
            new Date(this.year, this.month, 0).getDate();
        console.log(today);
        for (let day = 1; day <= today; day++) {
            if (this.isWeekday(day)) {
                this.clock.forEach(time => {
                    if (!this.holidays.includes(day)) this.sendData(day, time.clock_in, time.clock_out);
                });
            }
        }
    }

    isWeekday(day) {
        let weekday = new Date(this.year, this.month - 1, day).getDay();
        return weekday != SATURDAY && weekday != SUNDAY;
    }

    sendData(day, clock_in, clock_out) {
        let params = {
            clock_in: clock_in,
            clock_out: clock_out,
            day: day,
            history: [],
            minutes: 0,
            observations: null,
            period_id: this.period_id
        };
        this.sendPost(params);
    }

    sendPost(params) {
        fetch('https://api.factorialhr.com/attendance/shifts', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then(response => {
            response.text().then(content => {
                console.log(`POST: { day: ${params.day}, month: ${this.month}, year: ${this.year}, time: { clock_in: ${params.clock_in}, clock_out: ${params.clock_out} }}`);
                console.log(content);
            });
        });
    }

    removeShifts() {
        fetch('https://api.factorialhr.com/attendance/shifts', {
            method: 'GET',
            credentials: 'include'
        }).then(response => {
            response.text().then(content => {
                let shifts = JSON.parse(content);
                shifts.forEach(shift => {
                    if (shift.period_id == this.period_id) {
                        console.log('DELETE:');
                        console.log(shift);
                        fetch(`https://api.factorialhr.com/attendance/shifts/${shift.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                    }
                });
            });
        });
    }

}
