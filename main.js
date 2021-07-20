let mainTable = document.querySelector("#main-table");
let allViews = document.querySelectorAll(".views");
// let emailInput = document.querySelector("");
let makeNewVaucer = document.querySelector("#makeNew");
let gen_code = document.querySelector("#gen_code");
let newCode = document.querySelector(".generisan-kod");
let inputEmail = document.querySelector("#email");
let inputIznos = document.querySelector("#iznos");
let editTable = document.querySelector("#edit-table");
let modalBox = document.querySelector(".my-modal");
let modalcontent = document.querySelector(".modal-izmeni");
let ukupno = document.querySelector("#ukupno");
let ukupnoVaucera = document.querySelector("#brVaucera");
let undo = document.querySelector("#undo");
let lastV = [];
let newVaucer = {};
let br_vaucera = 0;

/***********
Prozivka pocetnih fukcija
************* */
makeTable();
ukupnoSredstava();
/***********
 Funkcije za prikazivanje Viewova
************* */

let ViewBtns = document.querySelectorAll(".btn-views");
ViewBtns.forEach((btn) => {
	btn.addEventListener("click", prikaziView);
});

function prikaziView(e) {
	let currentView = e.target.getAttribute("data-view");
	for (let i = 0; i < allViews.length; i++) {
		allViews[i].style.display = "none";
		if (allViews[i].id === currentView) {
			allViews[i].style.display = "flex";
		}
	}
	if (currentView === "izmeni-view") {
		makeEditTable();
	}
}

/****************
 MAKE TABLE VIEW
*****************/

function makeTable() {
	db.sort(compare);
	let first = db[0];
	// console.log(first);
	let text = `<thead> <tr>`;
	for (let key in first) {
		text += `<th>${key}</th>`;
	}
	text += `<th>Kupi</th></tr> </thead>`;

	text += `<tbody>`;
	for (let i = 0; i < db.length; i++) {
		text += `<tr>`;
		for (let key in db[i]) {
			text += `<td >${db[i][key]}</td>`;
		}
		text += `<td><button data-id="${i}" class="btn btn-warning btn-sm kupi">kupi</button></td>`;
		text += `</tr>`;
	}
	text += `</tbody>`;
	mainTable.innerHTML = text;

	let kupiBtns = document.querySelectorAll(".kupi"); //Dodajem kupi btn
	for (let i = 0; i < kupiBtns.length; i++) {
		kupiBtns[i].addEventListener("click", kupiView); //Prozivam KupiView funkciju za prikaz pocetnog ekrana za kupovinu
	}
	ukupnoSredstava(); //Funkcija za izracunavanje statistika
}

/******************************
 Generisi Kod kod novog vaucera
 **************************** */

gen_code.addEventListener("click", generisiKod);

function generisiKod() {
	let mesec = new Date().getMonth();
	let dan = new Date().getDate();
	let ms = new Date().getMilliseconds();
	let noviKod = `${db.length + 1}${mesec}${dan}${Math.floor(ms / 10)}`;

	newCode.innerHTML = noviKod;
	// console.log(typeof noviKod);
	makeNewVaucer.addEventListener("click", validateF);
}

/*********************
 Validacija forme basic
 *********************/
//PRAVIM NOVI VAUCER
function validateF() {
	inputIznos.style.outline = "none";
	inputEmail.style.outline = "none";
	if (inputEmail.value === "") {
		inputEmail.style.outline = "2px solid red";
	}
	if (inputIznos.value === "") {
		inputIznos.style.outline = "2px solid red";
	} else {
		newVaucer = {
			redni_br: db.length + 1,
			vaucerId: newCode.innerHTML,
			email: inputEmail.value,
			iznos: iznos.value,
		};

		inputIznos.value = "";
		inputEmail.value = "";
		inputIznos.placeholder = "text1";
		inputEmail.placeholder = "text2";
		newCode.innerHTML = "no code";

		// console.log(newVaucer);

		showPreview();
	}
}

function showPreview() {
	let previewTable = document.querySelector("#preview-table");
	console.log("{review", newVaucer);
	let text = `<thead> <tr>`;
	for (let key in newVaucer) {
		text += `<th>${key}</th>`;
	}
	text += `<th>Dodaj</th></tr></thead><tbody> <tr>`;
	for (let key in newVaucer) {
		text += `<td>${newVaucer[key]} </td>`;
	}
	text += `<td><button id="addNewVaucher" class ="btn btn-primary btn-sm">Dodaj</button></td></tr> </tbody>`;

	previewTable.innerHTML = text;
	let addToDb = document.querySelector("#addNewVaucher");
	addToDb.addEventListener("click", () => {
		db.push(newVaucer);
		makeTable();
		previewTable.innerHTML =
			"<h3 class ='text-center'>Novi vaucer je uspesno dodat</h3>";
		setTimeout(function () {
			previewTable.innerHTML = "";
		}, 3500);
	});
}

// CLOSE MODAL fukcija

let closeModal = document.querySelector(".close-modal");
closeModal.addEventListener("click", hideModalFunc);

function hideModalFunc() {
	modalBox.style.display = "none";
	modalcontent.innerHTML = "";
}

/***********************
 *Kupi view pravljenje prikaza
 ************************/
function kupiView() {
	let index = this.getAttribute("data-id");

	modalBox.style.display = "block";

	modalcontent.innerHTML = `
		<h4 class="text-center">Vaucer br: ${db[index].vaucerId}</h4>
		<h4 class="text-center"> Email: ${db[index].email}</h4>
		<div calss="stanje text-center border" >
		<h4 class ="text-center" id="trenutno-stanje">Trenutno stanje: ${db[index].iznos}</h4>
		<label class="text-center mx-auto w-100 mt-3" for="iznos-racuna">Obracunaj kupovinu: <input id="iznosKupovine" type="text" placeholder = "${db[index].iznos}" name = "iznos-racuna" /></label>
		<button data-id="obracunaj" id="kupovina" class="btn btn-primary d-block mx-auto mt-4">Obracunaj</button>
		</div>`;
	let trenutnoStanje = document.querySelector("#trenutno-stanje");

	let iznosKupovine = document.querySelector("#iznosKupovine");
	let obracunajBtn = document.querySelector("#kupovina");
	let noviIznos = 0;
	obracunajBtn.addEventListener("click", (e) => {
		if (e.target.innerHTML === "Obracunaj") {
			if (iznosKupovine.value === "") {
				iznosKupovine.style.outline = "1px solid red";
			} else {
				noviIznos = db[index].iznos - parseInt(iznosKupovine.value);
				validiraj(index, trenutnoStanje, e, noviIznos, obracunajBtn);

				console.log("ELSE", noviIznos);
			}
		} else {
			console.log("NOVI IZNOS: ", noviIznos);
			db[index].iznos = noviIznos;
			makeTable();
			modalBox.style.display = "none";
		}
	});
}

function validiraj(index, trenutnoStanje, e, noviIznos, obracunajBtn) {
	// noviIznos = db[index].iznos - parseInt(iznosKupovine.value);
	trenutnoStanje.innerHTML = `Stanje je promenjeno na: ${noviIznos} Din`;
	if (noviIznos < 0) {
		trenutnoStanje.innerHTML = `nedozovljeno stanje: ${noviIznos}Din <br/> ponovi kupovinu`;
		trenutnoStanje.style.color = "red";
		obracunajBtn.style.backround = "red";
		obracunajBtn.style.pointerEvents = "none";
	} else {
		iznosKupovine.placeholder = `${noviIznos}`;
		iznosKupovine.value = "";
		e.target.innerHTML = "POTVRDI";
	}
}

function makeEditTable() {
	db.sort(compare);
	let first = db[0];
	// console.log(first);
	let text = `<thead> <tr>`;
	for (let key in first) {
		text += `<th>${key}</th>`;
	}
	text += `<th>Izmeni</th><th>Delete</th></tr> </thead>`;

	text += `<tbody>`;
	for (let i = 0; i < db.length; i++) {
		text += `<tr>`;
		for (let key in db[i]) {
			text += `<td >${db[i][key]}</td>`;
		}
		text += `<td><button data-id="${i}" class="btn btn-warning btn-sm edit">Izmeni</button></td>`;
		text += `<td><button data-id="${i}" class="btn btn-danger btn-sm delete">delete</button></td>`;
		text += `</tr>`;
	}
	text += `</tbody>`;
	editTable.innerHTML = text;
	let deleteBtns = document.querySelectorAll(".delete");
	let edtiBtns = document.querySelectorAll(".edit");
	deleteBtns.forEach((deleteBtn) => {
		deleteBtn.addEventListener("click", deleteVaucer);
	});
	edtiBtns.forEach((editBtn) => {
		editBtn.addEventListener("click", editVaucherTable);
	});
	undoFunc_a();
}

function editVaucherTable(e) {
	let index = e.target.getAttribute("data-id");

	modalBox.style.display = "block";
	console.log(db[index]);
	let text = `<h3 id="izmeniHeader" class="text-center">Izmeni Vaucer:<br/> email: ${db[index].email} <br/>
	Iznos: ${db[index].iznos} din </h3>`;
	text += `<div id="izmeni-form" class="text-center my-3">`;
	text += `<label for="email" class="m-2">Email: </label><input type="text"  name="email" id="iEmail"  value ="${db[index].email}"/> </br>`;
	text += `<label for="iznos" class="m-2">Dodati iznos: </label><input name="iznos" id="iIznos" placeholder = "${db[index].iznos}" value="0" />`;
	text += `</div>`;
	text += `<div class="editBtns d-flex aling-center justify-content-around w-70">
	<button data-id="${index}" class="btn btn-primary">Promeni</button>
	<button class="btn btn-warning">Otkazi</button>
	</div>`;
	modalcontent.innerHTML = text;
	let edidVaucherBtns = document.querySelector(".editBtns");
	edidVaucherBtns.addEventListener("click", editVaucher);
}

function editVaucher(e) {
	let index = e.target.getAttribute("data-id");
	let text = `<h3 id="izmeniHeader" class="text-center">Izmeni Vaucer:<br/>`;
	let editHeader = document.querySelector("#izmeniHeader");
	let iIznosInput = document.querySelector("#iIznos");
	let iEmailInput = document.querySelector("#iEmail");
	let IzmeniForm = document.querySelector("#izmeni-form");
	console.log(e.target);
	if (e.target.innerHTML === "Otkazi") {
		modalcontent.innerHTML = "";
		modalBox.style.display = "none";
	}
	if (e.target.innerHTML === "Promeni") {
		text += `Email:<span class="notifiction"> ${iEmailInput.value}</span> </br>
			
				Iznos: <span  class="notifiction"> ${
					parseInt(iIznosInput.value) + parseInt(db[index].iznos)
				}</span>`;

		editHeader.innerHTML = text;
		IzmeniForm.style.visibility = "hidden";
		e.target.innerHTML = "Potvrdi";
	} else if (e.target.innerHTML === "Potvrdi") {
		console.log("NAPRAVI IZMENE");
		db[index].email = iEmailInput.value;
		db[index].iznos = parseInt(db[index].iznos) + parseInt(iIznosInput.value);
		makeTable();
		makeEditTable();

		modalBox.style.display = "none";
		console.log(db[index]);
	}
}

function ukupnoSredstava() {
	let totalSum = 0;
	let sviVaucer = 0;
	for (let i = 0; i < db.length; i++) {
		totalSum = totalSum + parseInt(db[i].iznos);
		sviVaucer = i + 1;
	}
	console.log(totalSum);
	ukupno.innerHTML = totalSum;
	ukupnoVaucera.innerHTML = sviVaucer;
}

function deleteVaucer() {
	let index = this.getAttribute("data-id");
	modalBox.style.display = "block";

	let text = ` <h5 class="text-center">Da li zelite da obrisete
	vaucer:</h5>
	<table class = "table">
	<thead>
	<tr>`;
	for (let key in db[index]) {
		text += `<th>${key}</th>`;
	}
	text += `</tr>
	</thead>
	<tbody>
	<tr>`;
	for (let key in db[index]) {
		text += `<td>${db[index][key]}</td>`;
	}
	text += `</tr>
	</tbody>
	</table>
	<div id="deleteV" class=" mx-auto w-50 d-flex aling-items-center justify-content-around"><button class="btn btn-danger">DA</button> <button class="btn btn-primary">Ne</button> </div`;

	modalcontent.innerHTML = text;
	let deleteV = document.querySelector("#deleteV");
	deleteV.addEventListener("click", deleteInit);
	function deleteInit(e) {
		confirmDelete(e, index);
	}
}

function confirmDelete(e, index) {
	console.log("Target", e.target);
	console.log("INDEX", index);
	if (e.target.innerHTML === "DA") {
		let last = db.splice(index, 1);
		lastV.push(last[0]);
		if (lastV.length === 4) {
			alert("Undo opcija pamti samo poslenja 4 brisanja");
		}
		if (lastV.length === 5) {
			lastV.shift();
		}
		makeTable();
		makeEditTable();

		console.log("LastV", lastV);
		hideModalFunc();
	} else {
		hideModalFunc();
	}
}

// UNDO

function undoFunc_a() {
	console.log("LASTV", lastV.length);
	if (lastV.length != 0) {
		undo.addEventListener("click", undoFunc_b);
	} else {
		undo.removeEventListener("click", undoFunc_b);
	}
}
function undoFunc_b() {
	let last_index = lastV.length - 1;
	db.push(lastV[last_index]);
	lastV.splice(last_index, 1);

	console.log("last", lastV.length);
	makeTable();
	makeEditTable();
}

/********************
 Sortiraj clanove niza u glavnoj DB
 ********************/
function compare(a, b) {
	var dbA = a.redni_br;
	var dbB = b.redni_br;
	let comparison = 0;

	if (dbA > dbB) {
		comparison = 1;
	}
	if (dbA < dbB) {
		comparison = -1;
	}
	return comparison;
}
