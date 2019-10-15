/**
	class Vocab
	singleton
	Maintain a list of vocabulary words.
	Each entry in the list looks like this:
		{
			w:'กิน', 	// word
			s:'m',	// status m:mastered, w:working, t:target, u:untried
			r:5702539857129	// recency timestamp
		}
**/
voyc.Vocab = function() {
	this.list = [];
	var firstlist = [
		{s:'m',w:'คน'},
		{s:'m',w:'เรา'},
		{s:'m',w:'คุณ '},
		{s:'m',w:'ญาติ'},
		{s:'m',w:'เด็ก'},
		{s:'m',w:'พี่'},
		{s:'m',w:'น้อง'},
		{s:'m',w:'หลาน'},
		{s:'m',w:'ลูก'},
		{s:'m',w:'อา'},
		{s:'m',w:'น้า'},
		{s:'w',w:'ผู้ชาย'},
		{s:'w',w:'พ่อ'},
		{s:'w',w:'พี่ชาย'},
		{s:'w',w:'ลูกชาย'},
		{s:'w',w:'น้องชาย'},
		{s:'w',w:'หลานชาย'},
		{s:'w',w:'อาผู้ชาย'},
		{s:'w',w:'น้าชาย'},
		{s:'w',w:'ปู่'},
		{s:'w',w:'ตา'},
		{s:'w',w:'ผู้หญิง'},
		{s:'w',w:'แม่'},
		{s:'w',w:'พี่สาว'},
		{s:'w',w:'ลูกสาว'},
		{s:'w',w:'น้องสาว'},
		{s:'w',w:'หลานสาว'},
		{s:'w',w:'อาผู้หญิง'},
		{s:'w',w:'น้าสาว'},
		{s:'w',w:'ย่า'},
		{s:'w',w:'ยาย'},
		{s:'m',w:'ม้า'},
		{s:'m',w:'หมา'},
		{s:'m',w:'ของ'},
		{s:'m',w:'เข้ามา'},
		{s:'m',w:'ห้อง'},
		{s:'m',w:'ห้องน้ำ'},
		{s:'m',w:'ห้องนอน'},
		{s:'m',w:'ห้องอาหาร'},
		{s:'m',w:'สะอาด'},
		{s:'m',w:'ร้อน'},
		{s:'m',w:'เย็น'},
		{s:'m',w:'กว้าง'},
		{s:'m',w:'ใหญ่'},
		{s:'m',w:'แคบ'},
		{s:'m',w:'เล็ก'},
		{s:'m',w:'สว่าง'},
		{s:'m',w:'เหม็นอับ'},
		{s:'m',w:'สี'},
		{s:'m',w:'ขาว'},
		{s:'m',w:'ดํา'},
		{s:'m',w:'แดง'},
		{s:'m',w:'เหลือง'},
		{s:'m',w:'เขียว'},
		{s:'m',w:'ฟ้า'},
		{s:'m',w:'นํ้าตาล'},
		{s:'m',w:'ส้ม'},
		{s:'m',w:'เทา'},
		{s:'m',w:'ชมพู'},
		{s:'m',w:'ม่วง'},
		{s:'m',w:'ม้า'},
		{s:'m',w:'หมา'},
		{s:'m',w:'ของ'},
		{s:'m',w:'เข้ามา'},
	];
	this.retrieve();
	if (!this.list) {
		this.list = firstlist;
	}
}

voyc.Vocab.prototype.store = function() {
	localStorage.setItem('vocab', JSON.stringify(this.list));
}

voyc.Vocab.prototype.retrieve = function() {
	this.list = JSON.parse(localStorage.getItem('vocab'));
}

/**
	get - read one entry from the list
	@input {string} word
	@return {object}
**/	
voyc.Vocab.prototype.get = function(word) {
	var r = false;
	for (var i=0; i<this.list.length; i++) {
		var e = this.list[i];
		if (e.w == word) {
			r = e;
			break;
		}
	}
	return r;
}

/**
	set
	insert or update one entry into the list
	@input {string} word
	@input {string} status
	@return {number} count of new entries inserted
**/	
voyc.Vocab.prototype.set = function(word, status) {
	var r = 0;
	var e = this.get(word);
	if (e) {
		e.s = status;
	}
	else {
		this.list.push({w:word,s:status,r:0});
		r++;
	}
	this.store();
	return r;
}

/**
	getlist - return an array of entries
	@input {string} status
	@return {array}
**/	
voyc.Vocab.prototype.getlist = function(status) {
	var r = [];
	for (var i=0; i<this.list.length; i++) {
		var e = this.list[i];
		if (e.s == status || !status) {
			r.push(e);
		}
	}
	return r;
}

/**
	finger - update the recency timestamp
	@input {string} word
	@input {number} timestamp
	@return null
**/
voyc.Vocab.prototype.finger = function(word, recency) {
	var e = this.get(word);
	if (e) {
		e.r = recency;
	}
	else {
		console.log(['finger vocab word not found', word]);
	}
	this.store();
}
