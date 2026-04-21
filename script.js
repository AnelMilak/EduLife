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
    console.log("Pokušavam otvoriti stranicu: " + id);
    
    // Sakrij sve stranice
    const pages = document.querySelectorAll(".page");
    pages.forEach(p => p.classList.add("hidden"));
    
    // Pronađi ciljanu stranicu
    const targetPage = document.getElementById("page-" + id);
    
    if (targetPage) {
        targetPage.classList.remove("hidden");
        console.log("Stranica " + id + " uspješno prikazana!");
        
        if (typeof map !== 'undefined' && map) {
            setTimeout(() => map.invalidateSize(), 300);
        }
    } else {
        alert("Greška: Ne postoji sekcija sa ID-om 'page-" + id + "' u HTML-u!");
    }
};


window.toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("shifted");
    
    // Osvježi mapu nakon što se završi animacija pomjeranja
    if(map) setTimeout(() => map.invalidateSize(), 400);
};

let isLoginMode = true;

window.toggleAuthMode = (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    document.getElementById("authTitle").innerText = isLoginMode ? "Prijava u sistem" : "Kreiraj račun";
    document.getElementById("authBtn").innerText = isLoginMode ? "Prijavi se" : "Registruj se";
    document.getElementById("toggleAuthModeLink").innerText = isLoginMode ? "Nemate račun? Registrujte se" : "Već imate račun? Prijavite se";
    document.getElementById("regName").style.display = isLoginMode ? "none" : "block";
    document.getElementById("authError").innerText = "";
    document.getElementById("authError").style.color = "#ef4444";
};

window.handleAuthAction = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("regName").value;
    const errorEl = document.getElementById("authError");
    
    if(!window.supabase) {
        errorEl.innerText = "Supabase nije konfigurisan!";
        return;
    }

    errorEl.style.color = "#ef4444"; // Reset boje za greške

    if (isLoginMode) {
        // PRIJAVA
        const { user, error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) errorEl.innerText = "Greška pri prijavi: " + error.message;
    } else {
        // REGISTRACIJA
        if (!name) {
            errorEl.innerText = "Unesite ime i prezime!";
            return;
        }
        
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { puno_ime: name }
            }
        });

        if (error) {
            errorEl.innerText = "Greška pri registraciji: " + error.message;
        } else {
            errorEl.style.color = "#10b981"; // Zelena boja
            errorEl.innerText = "Uspješna registracija! Sada se prijavite.";
            window.toggleAuthMode(new Event('click')); // Prebaci na login ekran
        }
    }
};

window.handleLogout = async () => {
    if(window.supabase) {
        await window.supabase.auth.signOut();
    }
};

window.inicijalizujAplikaciju = () => {
    loadGyms();
    loadProfs();
    initMap();
};

async function loadGyms() {
    const cont = document.getElementById("gymCardsContainer");
    
    // Ukoliko koristite Supabase bazu sa 'teretane' tabelom:
    if (window.supabase) {
        let { data: teretane, error } = await window.supabase.from('teretane').select('*');
        if (!error && teretane) {
            // Zamjeni lokalne podatke onima iz baze samo ako baza vrati podatke
            if(teretane.length > 0) teretaneData.length = 0; 
            teretane.forEach(t => teretaneData.push(t));
        }
    }

    if(cont) {
        // Fallback na postojeće lokalne podatke (teretaneData)
        cont.innerHTML = teretaneData.map(t => `
            <div class="gym-card">
                <i class="fas fa-dumbbell" style="color:#4f46e5; margin-bottom:10px;"></i>
                <h3>${t.ime}</h3>
                <p>${t.lok || t.lokacija}</p>
                <a href="${t.web || t.web_stranica}" target="_blank">Web stranica</a>
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
