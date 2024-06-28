import { mailData } from "./constants.js";
import { months,categories } from "./constants.js";
import { renderCategories, renderMails, showModal } from "./ui.js";

// localstorage'dan veri alma
const strMailData = localStorage.getItem("data");
// gelen string veriyi obje ve dizileri çevirme
const mailDatas = JSON.parse(strMailData);
console.log(mailDatas);

//html'den gelenler
const hamburgerMenu = document.querySelector(".menu");
const navigation = document.querySelector("nav");
const mailsArea = document.querySelector(".mails-area");
const createMailBtn = document.querySelector(".create-mail");
const modal = document.querySelector(".modal-wrapper");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("#create-mail-form");
const categoryArea = document.querySelector("nav >.middle")
const searchButton = document.querySelector("#search-icon")
const searchInput = document.querySelector("#search-input")

// console.dir(searchButton);
// console.log(searchInput);



//!Olay izleyicileri
hamburgerMenu.addEventListener("click", handleMenu);

document.addEventListener("DOMContentLoaded", () => {
 
  renderCategories(categoryArea,categories,"Gelen Kutusu")
  renderMails(mailsArea, mailDatas);


  if (window.innerWidth < 1100) {
    navigation.classList.add("hide");
  }
});

//pencerenin genisliginin degismesini izleme
window.addEventListener("resize", (e) => {
  // console.log(e.target.innerWidth);
  const width = e.target.innerWidth;

  if (width < 1100) {
    navigation.classList.add("hide");
  } else {
    navigation.classList.remove("hide");
  }
});

// modal islemleri
createMailBtn.addEventListener("click", () => showModal(modal, true));
closeBtn.addEventListener("click", () => showModal(modal, false));
form.addEventListener("submit", sendMail);

//mail alaninda olan tiklamalar 
mailsArea.addEventListener("click" ,updateMail)

// CategoryArea alanindaki tiklamalar
categoryArea.addEventListener("click",watchCategory)

searchButton.addEventListener("click", searchMails)


//!fonksiyonlar
//Menuyu acip kapatacak fonksiyon
function handleMenu() {
  // classList.toggle():parametre olarak verdigimiz class'i yoksa ekler varsa kaldirir.
  navigation.classList.toggle("hide");
}

//tarih olusturan fonksiyon
const getDate = () => {
  // console.log(new Date().toLocaleDateString().split("/"));
  const dateArr = new Date().toLocaleDateString().split("/");
  const day = dateArr[1];
  const monthNumber = dateArr[0];
  // console.log(months[monthNumber - 1]);
  const month = months[monthNumber - 1];

  // fonksiyonun cagirildigi yere gonderilecek cevap
  // console.log(day,month);
  // return day + " " + month   // seklindede yailabilir
  return [day, month].join(" ");
};

function sendMail(e) {
  e.preventDefault();

  // form icinde yer alan input ve textarea degerlerine ulasma
  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;
  //  console.log(receiver,title,message);

  if (!receiver || !title || !message) {
    Toastify({
      text: "Lütfen Formu Doldurunuz",
      duration: 3000,
      close: true,
      gravity: "top", 
      position: "right", 
      stopOnFocus: true, 
      style: {
        background: "linear-gradient(to right, 	#FBC02D, #FFF176)",
        borderRadius:"7px"
      },
    }).showToast();

    return;
  }

  //yeni mail objesi olusturma
  const newMail = {
    id: new Date().getTime(),
    sender: "Suzi",
    receiver,
    title,
    message,
    stared:false,
    date: getDate(),
  };
  //   console.log(newMail);

  // olusturdugumuz objeyi dizinin basina ekleme
  mailDatas?.unshift(newMail);
  //   console.log(mailData);

  //Todo veritabanını(localstorage) güncelle
  // storage'a gönderimek için string'e çeviriyoruz
  const strData = JSON.stringify(mailDatas);
  // console.log(strData);
  // storeage'a gönderme
  localStorage.setItem("data", strData);

  // ekrani guncelle
  renderMails(mailsArea, mailDatas);

  // modali kapat
  showModal(modal, false);

  // modali temizle
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";

  Toastify({
    text: "Mail Başarıyla Gönderildi",
    duration: 3000,
    close: true,
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: "linear-gradient(to right, 	#43A047, #96c93d)",
      borderRadius:"7px"
    },
  }).showToast();
}


//mail alaninda bir tiklanma olunca calisir
function updateMail(e){
console.log(e.target);

if(e.target.id === "delete"){
//silinecek maili belirleme
  //  console.dir(e.target.parentElement.parentElement.parentElement);
 const mail = e.target.parentElement.parentElement.parentElement;

 //!local storage'tan kaldirma
  // console.dir(mail.dataset.id);
  const mailId = mail.dataset.id;
  console.log(mailId , mailData)

  // Mevcut verileri localStorage'dan al ve parse et
 let mailDatas = JSON.parse(localStorage.getItem('data')) || [];
console.log(mailDatas);

  //id degerini bildigimiz maili dizisden cikarip filtredData adinda yeni bi dizi olusturduk
  const filtredData = mailDatas.filter((i) => i.id != mailId)
   console.log(filtredData);
  //locale diziyi gondermeden once diziyi stringe ceviriyoruz 
 const strData =  JSON.stringify(filtredData)

 //localStorage'a gonderme 
 localStorage.setItem("data" , strData)

 //!html'den (ekrandan) silme 
 mail.remove()

 Toastify({
  text: "Mail Silindi",
  duration: 3000,
  close: true,
  gravity: "top", 
  position: "right", 
  stopOnFocus: true, 
  style: {
    background: "linear-gradient(to right, 		#ee2c2c, 	#fa8072)",
    borderRadius:"7px"
  },
}).showToast();
}


//* Yildiza tiklaninca calisir

if(e.target.id === "star"){
// yildizlanacak maile ulasik
  // console.dir(e.target.parentElement.parentElement)
 const mail = e.target.parentElement.parentElement

 // yilsizlanacak mailin idsine ulastik
 const mailId = mail.dataset.id
 console.log(mailId , mailDatas);

 // idsinden yola cikarak mail objesini bulma(objenin butun verilerini buluyoruz)
  const foundItem = mailDatas.find((i) => i.id == mailId)
  // console.log(foundItem);
 
  // buldugumuz elemanin stared degerini tersine cevirme 
  // guncellenmis eleman olusturup,
  //(spread(...)ile elemanin onceki degerlerine erisip oldugu gibi tutuyoruz ve stared degerini ! ile true ise false ,false ise true yapiyoruz )
  const updatedItem = {...foundItem , stared: !foundItem.stared}
  // console.log(updatedItem);
  // console.log(mailId, "guncel hali >>", updatedItem , "dizi>>" , mailData);

  //idsini ve guncel halini bildigimiz elemani dizide guncellemek icin ilk once,
  // guncellenecek elemanin dizideki sirasini buluyoruz. 
  const index = mailDatas.findIndex((i) => i.id == mailId)
  // console.log(index);

  //dizideki sirasini bildigimiz elemani guncelliyoruz
  // console.log(mailData[index]);
  mailDatas[index] = updatedItem

  // guncel diziyi localStorage'a hazirlama
    //  JSON.stringify(mailData)

     //localStorage'i guncellme
     localStorage.setItem( "data" ,JSON.stringify(mailDatas))

     // html'i guncelle
     renderMails(mailsArea ,mailDatas)
  
}
}

// kategorileri izleyip degistirecegimiz fonk.
function watchCategory(e){

  // console.log(e.target.dataset.name);
  const selectedCategory =e.target.dataset.name;

  //*Naigasyon alanini guncelleme
  renderCategories(categoryArea,categories,selectedCategory)

  if(selectedCategory === "Yıldızlılar" ){
   
    // stared degeri true olanlari secme 
  const filtered =  mailDatas.filter((i) => i.stared === true)
   // sectiklerimizi ekrana basma 
    renderMails(mailsArea,filtered)
     return
  }
  // yildislilar disinda bir kategoriye tiklaninca hepsini goster
    renderMails(mailsArea ,mailDatas)

}

// mail arama 
function searchMails(){
//  alert(searchInput.value)

//aranan terimi iceren mailleri alma 
const filtred = mailDatas?.filter((i)=> i.sender.toLowerCase().includes(searchInput.value.toLowerCase()))

// mailleri ekrana basma 
renderMails(mailsArea, filtred)
}



