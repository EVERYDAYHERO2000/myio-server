"use strict";

const getDateTime = function (date) {
	date = date || new Date();
	date = (date instanceof Date) ? date : new Date( date.replace(/-/g, '/') );
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let dateTime = {
		raw: date,
		fullYear: null,
		month: null,
		monthName: null,
		day: null,
		time: null,
		hours: null,
		minute: null,
		date: null,
		dateTime: null,
		formated: null,
		currentTimeZoneOffsetInHours: date.getTimezoneOffset() / 60,
		unix: Date.parse(date)
	}
	dateTime.hours = stringifyNumber(date.getHours());
	dateTime.minute = stringifyNumber(date.getMinutes());
	dateTime.fullYear = stringifyNumber(date.getFullYear());
	dateTime.month = stringifyNumber(date.getMonth() + 1);
	dateTime.monthName = monthNames[date.getMonth()];
	dateTime.day = stringifyNumber(date.getDate());
	dateTime.time = dateTime.hours + ':' + dateTime.minute;
	dateTime.date = dateTime.monthName + ' ' + dateTime.day;
	dateTime.dateTime = dateTime.date + ', ' + dateTime.time;
	dateTime.formated = dateTime.fullYear + '-' + dateTime.month + '-' + dateTime.day + ' ' + dateTime.time;
	dateTime.dateOnly = dateTime.fullYear + '-' + dateTime.month + '-' + dateTime.day;

	function stringifyNumber(n) {
		return (n < 10) ? '0' + n : n.toString();
	}
	
	return dateTime; 
}

module.exports = getDateTime;