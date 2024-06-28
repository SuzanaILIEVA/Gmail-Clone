//yazilari kesmek icin kullandigimiz fonksiyon
export function trimString(str, max) {
  // metin 50 karakterden kisa ise oldugu gibi gonderiyoruz.
  if (str.length < max) return str;

  //metnin harf uzunlugu 50den uzunsa kes ve ... koy
  return str.slice(0, max) + "...";
}

// ekrana mailleri listeleyecek foksiyon
//1.parametre: outlet , ekranin hangi kismina mudahale edileceginin bilgisini icerir(mails-area)
//2.parametre:data,ekrana basacagimiz veriler
export function renderMails(outlet, data) {
  console.log(data);
  if (!data) return;
  // console.log(outlet, data);
  // herbir mail objesi icin, bir maili temsil eden html olustur.
  outlet.innerHTML = data
    .map(
      (mail) => `
    <div class="mail" data-id=${mail.id}>
     <div class="left">
       <span class="check">
         <input type="checkbox" />
       </span>
       
       <i id="star" class="bi bi-star-fill icon ${
         mail.stared && "star-active bi-star-fill"
       }"></i>

       <span >${mail.sender}</span>
     </div>
     <div class="right">
       <p class="message-title">${trimString(mail.title, 20)}</p>
       <p class="message-desc">${trimString(mail.message, 30)}</p>
       <p class="message-date">${mail.date}</p>
       <button><i id="delete" class="bi bi-trash icon"></i></button>
     </div>
   </div>
  `
    )
    .join("");

}

// ekrana mail olusturma penceresi acma
export function showModal(modal, willOpen) {
  modal.style.display = willOpen ? "grid" : "none";
}

// kategorileri ekrana basma
export function renderCategories(outlet, data, selectedCategory) {
   // eski kategorileri sil 
     outlet.innerHTML ="";

  // gelen diziyi donme
    data.forEach((category) => {
    const categoryItem = document.createElement("a");

    //category elemanina veri ekleme
    categoryItem.dataset.name = category.title;

    // active olan kategoriye active class'i eklme
    categoryItem.className =
      selectedCategory === category.title && "active-category";

    categoryItem.innerHTML = `
       <i class="${category.class}"></i>
       <span>${category.title}</span>
    `;

    outlet.appendChild(categoryItem);
  });
}
