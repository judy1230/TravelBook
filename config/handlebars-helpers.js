const moment = require('moment')
const helpersreq = require('../_helpers')

module.exports = {
	ifCond: function (a, b, options) {
		if (a === b) {

			return options.fn(this)
		}
		return options.inverse(this)
	},
	moment: function (a) {
		return moment(a).fromNow()
	},
	ifEquals: function (arg1, arg2, options) {

		return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
	},
	getInputDate: function (date, options) {
		if (!date) { return '' }
		const month = date.getMonth() === 11 ? 1 : date.getMonth() + 1
		return `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
	}

}

