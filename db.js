let db = [];

let vinfo = {
	prezimena: [
		"petrovic",
		"Djilas",
		"Srdjanov",
		"novakovic",
		"Danilovic",
		"Pajovic",
		"Tot",
		"Horvat",
		"Osmanovic",
		"Zecevic",
	],
	imena: [
		"Miroslav",
		"petar",
		"Srdjan",
		"novak",
		"Danilov",
		"Paja",
		"Zoli",
		"Rudolf",
		"Adrijan",
		"Pera",
	],
	mail: ["yahoo.com", "gmail.com", "hotmail.com", "ptt.rs", "eunet.rs"],
	napraviVaucer: function () {
		for (let i = 0; i < 10; i++) {
			let mesec = new Date().getMonth();
			let dan = new Date().getDate();
			let ms = new Date().getMilliseconds();
			let vaucer = {
				redni_br: i + 1,
				vaucerId: `${i + 1}${mesec + 1}${dan}${Math.floor(ms / 10)}`,
				email: `${
					vinfo.imena[Math.floor(Math.random() * vinfo.imena.length)]
				}.${
					vinfo.prezimena[Math.floor(Math.random() * vinfo.prezimena.length)]
				}@${vinfo.mail[Math.floor(Math.random() * vinfo.mail.length)]}`,
				iznos: Math.floor(Math.random() * 1000),
			};

			db.push(vaucer);
		}
		console.log(db);
	},
};

vinfo.napraviVaucer();
