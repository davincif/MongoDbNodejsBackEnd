var exports = module.exports = {};

let datetimeRegx = new RegExp('^([0-9][0-9]/[0-9][0-9]/[0-9][0-9][0-9][0-9])$')

/**
 * Represents a book.
 * This function was entirely copied from devmedia, and for that, my great thanks, you guys are awesome :)
 * credits: https://www.devmedia.com.br/validar-cpf-com-javascript/23916
 * @function
 */
exports.validate_cpf = function (strCPF) {
	var Soma;
	var Resto;
	Soma = 0;
	if (strCPF == "00000000000") return false;

	for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(strCPF.substring(9, 10))) return false;

	Soma = 0;
	for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
	Resto = (Soma * 10) % 11;

	if ((Resto == 10) || (Resto == 11)) Resto = 0;
	if (Resto != parseInt(strCPF.substring(10, 11))) return false;
	return true;
}

exports.validate_datetime = function (datetimeStr) {
	return datetimeRegx.exec(datetimeStr) != null;
}

exports.get_datetime_format = function () {
	return "DD/MM/YY";
}

exports.date_exists = function (date) {
	let ret = null;
	if(date != null) {
		let aux = date.split('/');

		let day = parseInt(aux[0]);
		let month = parseInt(aux[1]);
		let year = parseInt(aux[2]);

		try {
			ret = new Date(year, month, day);
		} catch (error) {
			// ret = null;
		}
	}

	return ret
}

exports.date_diff_year = function (date1, date2) {
	return Math.trunc((date1 - date2) / 1000 / 60 / 60 / 24 / 365);
}
