const teretaneData = [
    { ime: "ProGym Sarajevo", lok: "Kolodvorska 12", web: "https://progym-latest.vercel.app/", lat: 43.8522, lng: 18.3970 },
    { ime: "BrickFit", lok: "Paromlinska 42", web: "https://www.brickfit.ba/", lat: 43.8505, lng: 18.3855 },
    { ime: "Akademija Respect", lok: "Danijela Ozme 4", web: "https://akademija-respect.ba/", lat: 43.8592, lng: 18.4141 }
];

const profesoriData = [
    { ime: "Enis Kapidžić", uloga: "Web Programiranje" },
    { ime: "Irfan Kubat", uloga: "Razvoj mobilnih aplikacija" },
    { ime: "Mirela Kurin Tafto", uloga: "Matematika" },
    { ime: "Azra Bidžan Hodžić", uloga: "Bosanski jezik" }
];

window.showPage = function(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById("page-" + id).classList.remove("hidden");
    if(map) setTimeout(() => map.invalidateSize(), 300);
};

window.toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("shifted");
    
    // Osvježi mapu nakon što se završi animacija pomjeranja
    if(map) setTimeout(() => map.invalidateSize(), 400);
};

window.handleAuth = async () => {
    const e = document.getElementById("email").value;
    const p = document.getElementById("password").value;
    try { await window.fbProps.signInWithEmailAndPassword(window.auth, e, p); }
    catch { document.getElementById("authError").innerText = "Greška!"; }
};

window.handleLogout = () => window.fbProps.signOut(window.auth);

window.inicijalizujAplikaciju = () => {
    loadGyms();
    loadProfs();
    initMap();
};

function loadGyms() {
    const cont = document.getElementById("gymCardsContainer");
    if(cont) {
        cont.innerHTML = teretaneData.map(t => `
            <div class="gym-card">
                <i class="fas fa-dumbbell" style="color:#4f46e5; margin-bottom:10px;"></i>
                <h3>${t.ime}</h3>
                <p>${t.lok}</p>
                <a href="${t.web}" target="_blank">Web stranica</a>
            </div>`).join("");
    }
    document.getElementById("home-gym-count").innerText = teretaneData.length;
}

function loadProfs() {
    const cont = document.getElementById("profListContainer");
    if(cont) {
        cont.innerHTML = profesoriData.map(p => `
            <div class="prof-card">
                <div class="prof-icon"><i class="fas fa-user-tie"></i></div>
                <h4>${p.ime}</h4>
                <span class="badge">${p.uloga}</span>
            </div>`).join("");
    }
    document.getElementById("home-prof-count").innerText = profesoriData.length;
}

let map;
function initMap() {
    if(map || !document.getElementById("map")) return;
    map = L.map('map').setView([43.856, 18.413], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    teretaneData.forEach(t => L.marker([t.lat, t.lng]).addTo(map).bindPopup(t.ime));
}