const teretaneData = [
    { ime: "Body Art Skenderija", lokacija: "Terezija b.b.", lat: 43.8550, lng: 18.4140, slika: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500", web: "https://bodyart.ba" },
    { ime: "Avalon Fitness", lokacija: "Unitic Centar", lat: 43.8500, lng: 18.3950, slika: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500", web: "https://avalon.ba" }
];

// --- AUTH ---
window.handleAuth = async function() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
        await window.fbProps.signInWithEmailAndPassword(window.auth, email, pass);
    } catch (error) {
        document.getElementById("authError").innerText = "Pogrešan login!";
    }
};

window.handleLogout = () => window.fbProps.signOut(window.auth);

window.inicijalizujAplikaciju = function() {
    initMap();
    ucitajTreninge();
    ucitajFinansije();
    loadProfesori();
    loadGymCards();
};

// --- PROFESORI (Popravljen Undefined) ---
async function loadProfesori() {
    const container = document.getElementById("profListContainer");
    if(!container) return;
    try {
        const snap = await window.fbProps.getDocs(window.fbProps.collection(window.db, "Profesori"));
        container.innerHTML = "";
        snap.forEach(doc => {
            const p = doc.data();
            container.innerHTML += `
                <div class="prof-card">
                    <img src="${p.slika || 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
                    <h4>${p.ime || 'Nema imena'}</h4>
                    <span class="badge">${p.uloga || 'Profesor'}</span>
                </div>`;
        });
    } catch (e) { console.error(e); }
}

// --- TERETANE ---
function loadGymCards() {
    const container = document.getElementById("gymCardsContainer");
    if(!container) return;
    container.innerHTML = teretaneData.map(t => `
        <div class="gym-card">
            <div style="height:120px; background:url('${t.slika}') center/cover; border-radius:10px;"></div>
            <h3>${t.ime}</h3>
            <p>${t.lokacija}</p>
        </div>`).join("");
}

// --- MAPE & NAVIGACIJA ---
let map;
function initMap() {
    if (map || !document.getElementById('map')) return;
    map = L.map('map').setView([43.855, 18.410], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    teretaneData.forEach(t => L.marker([t.lat, t.lng]).addTo(map).bindPopup(t.ime));
}

window.showPage = function(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("page-" + id).classList.remove("hidden");
    if(id === 'teretane' && map) setTimeout(() => map.invalidateSize(), 300);
};

window.toggleSidebar = () => document.getElementById("sidebar").classList.toggle("active");

// Dodaj funkcije za treninge i finansije ovdje (one koje smo ranije pisali)...