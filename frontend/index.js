const API_BASE = "http://172.31.181.200:8080";
const API_URL = `${API_BASE}/recipes`;

let receitasCache = [];
let filtroTexto = "";
let filtroCategoria = ""; // "", "Doce", "Salgado", ...

function renderReceitas(lista) {
    const list = document.getElementById("recipes-list");
    list.innerHTML = "";

    if (lista.length === 0) {
        list.innerHTML = "<p>Nenhuma receita encontrada.</p>";
        return;
    }

    lista.forEach(r => {
        const li = document.createElement("li");
        li.className = "card-item";

        const categoria = r.category || "Sem categoria";
        const tempo = r.cookTimeMinutes != null ? `${r.cookTimeMinutes} min` : "Tempo n/d";
        const dificuldade = r.difficulty || "Dificuldade n/d";
        const rating = r.rating != null ? `${r.rating}/5` : "Sem nota";

        li.innerHTML = `
            <picture>
                <img src="https://source.unsplash.com/600x400/?food,${encodeURIComponent(r.title)}">
            </picture>

            <div class="card-content">
                <span class="card-tag">${categoria}</span>
                <h2 class="card-title">${r.title}</h2>
                <div class="card-meta">${tempo} • ${dificuldade} • ${rating}</div>
                <a href="receita.html?id=${r.recipeId}" class="btn-view">Ver receita</a>
            </div>
        `;

        list.appendChild(li);
    });
}

async function carregarReceitas() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar receitas");
        receitasCache = await res.json();
        aplicarFiltro(); // render já filtrando (inicialmente sem filtro)
    } catch (err) {
        console.error(err);
        alert("Erro ao carregar receitas.");
    }
}

function aplicarFiltro() {
    const termo = filtroTexto.toLowerCase();
    const cat = filtroCategoria.toLowerCase();

    const filtradas = receitasCache.filter(r => {
        const t = (r.title || "").toLowerCase();
        const c = (r.category || "").toLowerCase();

        const matchTexto = termo === "" || t.includes(termo);
        const matchCategoria = cat === "" || c === cat;
        return matchTexto && matchCategoria;
    });

    renderReceitas(filtradas);
}

// Busca por texto (só título – se quiser, posso incluir categoria também)
const searchInput = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        filtroTexto = searchInput.value;
        aplicarFiltro();
    });
}

if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filtroTexto = searchInput.value;
        aplicarFiltro();
    });
}

// Filtros de categoria – NÃO mexem na barra de busca
document.querySelectorAll(".tg-cat").forEach(catEl => {
    catEl.addEventListener("click", (e) => {
        e.preventDefault();

        // pega a categoria da âncora
        filtroCategoria = catEl.getAttribute("data-category") || "";

        // destaque visual (opcional)
        document.querySelectorAll(".tg-cat").forEach(c => c.classList.remove("tg-cat--active"));
        catEl.classList.add("tg-cat--active");

        aplicarFiltro();
    });
});

carregarReceitas();
