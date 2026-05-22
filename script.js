const COLORS = ['#1A1A2E','#2C3E50','#8B1A1A','#1B4332','#1E3A5F','#4A1942','#7B3F00','#0D3349'];
let books = [
  {id:1, titre:'1984', auteur:'George Orwell', genre:'Science-fiction', annee:1949, pages:328, desc:"Dans une societe totalitaire dirigee par Big Brother, Winston Smith tente de resister au regime oppressif qui controle chaque aspect de la vie.", alire:false, color:'#1A1A2E', image:'images/1984.png'},
  {id:2, titre:'Le Petit Prince', auteur:'Antoine de Saint-Exupery', genre:'Classique', annee:1943, pages:96, desc:"Un aviateur echoue dans le desert rencontre un mysterieux petit prince venu d'une autre planete, qui lui enseigne l'essentiel de la vie.", alire:true, color:'#F5A623', image:'images/le petit prince.png'},
  {id:3, titre:'Dune', auteur:'Frank Herbert', genre:'Science-fiction', annee:1965, pages:412, desc:"Sur la planete desertique Arrakis, le jeune Paul Atreides se retrouve au coeur d'une lutte pour le controle de la ressource la plus precieuse de l'univers : l'epice.", alire:true, color:'#7B3F00', image:'images/Dune.png'},
  {id:4, titre:'Les Miserables', auteur:'Victor Hugo', genre:'Drame', annee:1862, pages:1456, desc:"Jean Valjean, ancien forcat, tente de se racheter dans la France du XIXe siecle, poursuivi par l'implacable inspecteur Javert.", alire:false, color:'#2C3E50', image:'images/les miserables.png'},
  {id:5, titre:'Le Seigneur des Anneaux', auteur:'J.R.R. Tolkien', genre:'Fantasy', annee:1954, pages:1178, desc:"Le hobbit Frodon Sacquet doit detruire l'Anneau Unique pour sauver la Terre du Milieu des griffes du Seigneur des Tenebres Sauron.", alire:true, color:'#1B4332', image:'images/le seigneur des anneaux.png'},
  {id:6, titre:'Le Comte de Monte-Cristo', auteur:'Alexandre Dumas', genre:'Classique', annee:1844, pages:1276, desc:"Edmond Dantes, victime d'une terrible injustice, orchestre une vengeance meticuleuse contre ceux qui l'ont trahi.", alire:false, color:'#4A1942', image:'images/le comte de monte-cristo.png'},
  {id:7, titre:'Fahrenheit 451', auteur:'Ray Bradbury', genre:'Science-fiction', annee:1953, pages:158, desc:"Dans un futur dystopique, les pompiers brulent les livres. Guy Montag, pompier, commence a douter du systeme et a lire en secret.", alire:true, color:'#8B1A1A', image:'images/fahrenhet.png'},
  {id:8, titre:'La Peste', auteur:'Albert Camus', genre:'Drame', annee:1947, pages:308, desc:"Dans la ville d'Oran frappee par la peste, le docteur Rieux et ses compagnons luttent contre l'epidemie et l'absurde condition humaine.", alire:false, color:'#0D3349', image:'images/la peste.png'}
];
let nextId = 13;
let currentFilter = 'Tous';
let searchQuery = '';
let editingId = null;
let alireToggleState = false;
let currentModalBookId = null;
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.getElementById('nav-'+page).classList.add('active');
  if(page === 'alire') renderReadlist();
  if(page === 'admin') renderAdminTable();
  window.scrollTo(0,0);
}
function makeCover(book, cls='book-cover-placeholder') {
  if(book.image) {
    return `<img class="book-cover" src="${book.image}" alt="${book.titre}" style="width:100%;aspect-ratio:2/3;object-fit:cover;display:block;" onerror="this.outerHTML=makeCoverFallback('${book.titre}','${book.color||'#1A1A2E'}','${cls}')"/>`;
  }
  return makeCoverFallback(book.titre, book.color||'#1A1A2E', cls);
}
function makeCoverFallback(titre, color, cls='book-cover-placeholder') {
  const initials = titre.split(' ').map(w=>w[0]).join('').slice(0,4);
  const annee = '';
  return `<div class="${cls}" style="background:${color}"><div>${initials}</div><div style="font-size:.55em;margin-top:4px;opacity:.7">${annee}</div></div>`;
}
function makeThumbCover(book) {
  if(book.image) {
    return `<img src="${book.image}" alt="${book.titre}" style="width:36px;height:48px;object-fit:cover;border-radius:4px;display:block;" onerror="this.style.display='none'"/>`;
  }
  const initials = book.titre.split(' ').map(w=>w[0]).join('').slice(0,4);
  return `<div class="book-cover-placeholder" style="background:${book.color||'#1A1A2E'};width:36px;height:48px;font-size:.6rem;aspect-ratio:unset;border-radius:4px;"><div>${initials}</div></div>`;
}
function getFilteredBooks() {
  return books.filter(b => {
    const matchGenre = currentFilter==='Tous' || b.genre===currentFilter;
    const q = searchQuery.toLowerCase();
    const matchQ = !q || b.titre.toLowerCase().includes(q) || b.auteur.toLowerCase().includes(q);
    return matchGenre && matchQ;
  });
}

function renderBooks() {
  const grid = document.getElementById('books-grid');
  const filtered = getFilteredBooks();
  document.getElementById('book-count').textContent = filtered.length + ' livres';
  if(!filtered.length) {
    grid.innerHTML = '<p style="color:var(--text-light);padding:32px 0;grid-column:1/-1">Aucun livre trouve.</p>';
    return;
  }
  grid.innerHTML = filtered.map(b => `
    <div class="book-card" onclick="openModal(${b.id})">
      ${makeCover(b)}
      <div class="book-info">
        <div class="book-title">${b.titre}</div>
        <div class="book-author">${b.auteur}</div>
        <div class="book-genre">${b.genre}</div>
        <button class="btn-detail" onclick="event.stopPropagation();openModal(${b.id})">Voir details</button>
      </div>
    </div>
  `).join('');
}
function filterBooks(q) { searchQuery = q; renderBooks(); }
function onNavSearch(q) { searchQuery = q; if(document.getElementById('search-main')) document.getElementById('search-main').value = q; renderBooks(); }
function filterByGenreDropdown(g) { currentFilter = g; document.querySelectorAll('.genre-btn').forEach(btn=>{ btn.classList.toggle('active', btn.textContent===g||(g==='Tous'&&btn.textContent==='Tous')); }); renderBooks(); }
function selectGenre(el, g) {
  currentFilter = g;
  document.querySelectorAll('.genre-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const dd = document.getElementById('genre-dropdown');
  if(dd) dd.value = g;
  renderBooks();
}
function openModal(id) {
  const b = books.find(x=>x.id===id);
  if(!b) return;
  currentModalBookId = id;
  const coverEl = document.getElementById('modal-cover');
  if(b.image) {
    coverEl.innerHTML = `<img src="${b.image}" alt="${b.titre}" style="width:160px;border-radius:8px;object-fit:cover;aspect-ratio:2/3;" onerror="this.outerHTML='${makeCoverFallback(b.titre, b.color||'#1A1A2E','book-cover-placeholder').replace(/'/g,"\'")}'"/>`;
  } else {
    coverEl.innerHTML = makeCover(b, 'book-cover-placeholder');
  }
  document.getElementById('modal-title').textContent = b.titre;
  document.getElementById('modal-author').textContent = b.auteur;
  document.getElementById('modal-genre').textContent = b.genre;
  document.getElementById('modal-meta').innerHTML = `Publie en ${b.annee} &nbsp;|&nbsp; Pages : ${b.pages}`;
  document.getElementById('modal-desc').textContent = b.desc;
  updateModalBtns(b);
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); currentModalBookId = null; }
function updateModalBtns(b) {
  document.getElementById('modal-btn-remove').style.display = b.alire ? '' : 'none';
  document.getElementById('modal-btn-add').style.display = b.alire ? 'none' : '';
}
function toggleReadlist() {
  const b = books.find(x=>x.id===currentModalBookId);
  if(!b) return;
  b.alire = !b.alire;
  updateModalBtns(b);
  showToast(b.alire ? `"${b.titre}" ajoute a votre liste` : `"${b.titre}" retire de la liste`);
  renderBooks();
  renderAdminTable();
}
document.getElementById('modal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });
function renderReadlist() {
  const items = books.filter(b=>b.alire);
  const container = document.getElementById('readlist-items');
  if(!items.length) {
    container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-light)">Votre liste est vide. <a style="color:var(--gold);cursor:pointer" onclick="navigate(\'home\')">Parcourez le catalogue</a></div>';
    return;
  }
  container.innerHTML = items.map(b=>`
    <div class="readlist-item" onclick="openModal(${b.id})">
      <div class="readlist-thumb">
        ${b.image
          ? `<img src="${b.image}" alt="${b.titre}" style="width:56px;height:76px;object-fit:cover;border-radius:6px;display:block;"/>`
          : makeCoverFallback(b.titre, b.color||'#1A1A2E','book-cover-placeholder')
        }
      </div>
      <div class="readlist-info">
        <div class="readlist-title">${b.titre}</div>
        <div class="readlist-author">${b.auteur}</div>
        <div class="readlist-genre">${b.genre}</div>
      </div>
      <button class="btn-remove" onclick="event.stopPropagation();removeFromList(${b.id})">
        Retirer
      </button>
    </div>
  `).join('');
}
function removeFromList(id) {
  const b = books.find(x=>x.id===id);
  if(b) { b.alire=false; showToast(`"${b.titre}" retire de la liste`); renderReadlist(); renderBooks(); }
}
function showAdminTab(tab) {
  document.getElementById('admin-tab-table').style.display = tab==='table'?'':'none';
  document.getElementById('admin-tab-form').style.display = tab==='form'?'':'none';
  document.querySelectorAll('.admin-nav-item').forEach((a,i)=>a.classList.toggle('active',i===(tab==='table'?0:2)));
}
function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  tbody.innerHTML = books.map(b=>`
    <tr>
      <td>${b.id}</td>
      <td><div class="td-cover">${makeThumbCover(b)}</div></td>
      <td><strong>${b.titre}</strong></td>
      <td>${b.auteur}</td>
      <td>${b.genre}</td>
      <td><span class="${b.alire?'badge-oui':'badge-non'}">${b.alire?'Oui':'Non'}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="editBook(${b.id})" title="Modifier">Edit</button>
          <button class="btn-icon delete" onclick="deleteBook(${b.id})" title="Supprimer">Suppr</button>
        </div>
      </td>
    </tr>
  `).join('');
}
function editBook(id) {
  const b = books.find(x=>x.id===id);
  if(!b) return;
  editingId = id;
  document.getElementById('f-titre').value = b.titre;
  document.getElementById('f-auteur').value = b.auteur;
  document.getElementById('f-genre').value = b.genre;
  document.getElementById('f-annee').value = b.annee;
  document.getElementById('f-desc').value = b.desc;
  document.getElementById('f-pages').value = b.pages;
  document.getElementById('f-cover').value = b.image||'';
  alireToggleState = b.alire;
  const t = document.getElementById('f-alire-toggle');
  t.classList.toggle('off', !b.alire);
  document.getElementById('form-title').textContent = 'Modifier : '+b.titre;
  showAdminTab('form');
}
function deleteBook(id) {
  if(!confirm('Supprimer ce livre ?')) return;
  books = books.filter(b=>b.id!==id);
  renderAdminTable();
  renderBooks();
  showToast('Livre supprime');
}
function clearForm() {
  editingId = null;
  ['f-titre','f-auteur','f-annee','f-desc','f-cover','f-pages'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-genre').value='';
  alireToggleState = false;
  document.getElementById('f-alire-toggle').classList.add('off');
  document.getElementById('form-title').textContent = 'Ajouter / Modifier un livre';
}
function toggleAlire() {
  alireToggleState = !alireToggleState;
  document.getElementById('f-alire-toggle').classList.toggle('off', !alireToggleState);
}
function saveBook() {
  const titre = document.getElementById('f-titre').value.trim();
  const auteur = document.getElementById('f-auteur').value.trim();
  const genre = document.getElementById('f-genre').value;
  if(!titre||!auteur||!genre) { showToast('Veuillez remplir les champs obligatoires'); return; }
  const annee = parseInt(document.getElementById('f-annee').value)||2024;
  const pages = parseInt(document.getElementById('f-pages').value)||0;
  const desc = document.getElementById('f-desc').value.trim();
  const imageUrl = document.getElementById('f-cover').value.trim();
  if(editingId) {
    const b = books.find(x=>x.id===editingId);
    Object.assign(b, {titre,auteur,genre,annee,pages,desc,alire:alireToggleState});
    if(imageUrl) b.image = imageUrl;
    showToast('Livre modifie avec succes');
  } else {
    const color = COLORS[books.length % COLORS.length];
    const newBook = {id:nextId++, titre,auteur,genre,annee,pages,desc,alire:alireToggleState,color};
    if(imageUrl) newBook.image = imageUrl;
    books.push(newBook);
    showToast('Livre ajoute avec succes');
  }
  clearForm();
  showAdminTab('table');
  renderAdminTable();
  renderBooks();
}
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(()=>t.classList.remove('show'), 2800);
}
renderBooks();