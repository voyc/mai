/** 
	Choose a random element from an array
**/
voyc.randomElement = function(a) {
	return a[Math.floor(Math.random()*a.length)];
}

/**
	Generate a random number within certain constraints
**/
voyc.genNumber = function(start, end, interval) {
	var a = [];
	for (var i=start; i<=end; i+=interval) {
		a.push(i);
	}
	var r = voyc.randomElement(a);
	return r;
}

/**
	Translate and format a number.
	language:, en, th
	format: digit, words
**/
voyc.translateNumber = function(n,la,fmt) {
	word = {
		en: [
			'zero',
			'one',
			'two',
			'three',
			'four',
			'five',
			'six',
			'seven',
			'eight',
			'nine',
		],
		th: [
			'ศูนย์',
			'หนึ่ง',
			'สอง',
			'สาม',
			'สี่',
			'ห้า',
			'หก',
			'เจ็ด',
			'แปด',
			'เก้า',
		]
	};

	digit = {
		en: [
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
		],
		th: [
			'๐',	
			'๑',	
			'๒',	
			'๓',	
			'๔',	
			'๕',	
			'๖',	
			'๗',	
			'๘',	
			'๙',	
		]
	};

	magnitude = {
		en:[
			'',		// one
			'',		// ten
			'hundred',
			'thousand', 
			'',		// ten thousand
			'',		// hundred thousand
			'million',
		],
		th:[
			'',
			'สิบ',
			'ร้อย',
			'พัน',
			'หมื่น',
			'แสน',
			'ล้าน',
		]
	};

	var s = '';
	var t = n.toString();
	var wordbreak = ' ';

	if (fmt == 'digit') {
		var j = 0;
		var p = 0;
		for (var i=0; i<t.length; i++) {
			j = parseInt(t[i],10);
			s += digit[la][j];
			p = t.length - i - 1;
			if (p && !(p % 3)) {
				s += ',';
			}
		}
	}
	else if (la == 'en') {
		var j = 0;
		for (var i=0; i<t.length; i++) {
			if (s.length) s += wordbreak;
			j = parseInt(t[i],10);
			s += word[la][j];
		}
	}
	else if (la == 'th') {
		var j = 0;
		var p = 0;
		for (var i=0; i<t.length; i++) {   // i = left to right index
			if (s.length) s += wordbreak;
			j = parseInt(t[i],10);   // digit in current position
			p = t.length - i - 1;    // mag = decimal position left of .

			var dig = word[la][j];
			var mag = magnitude[la][t.length - i - 1];

			// exception: trailing zeros
			if (j == 0 && n > 0) {
				dig = mag = '';
			}

			// exception: one, หนึ่ง to เอ็ด
			if (p == 0 && j == 1) {
				dig = 'เอ็ด';
			}

			// exception: teens
			if (p == 1 && j == 1) {
				dig = mag = '';
			}

			// exception: twenties, สอง to ยี่
			if (p == 1 && j == 2) {
				dig = 'ยี่';
			}

			s += dig;
			if (mag.length) {
				s += wordbreak;
			}
			s += mag;
		}
	}
	return s;
}
