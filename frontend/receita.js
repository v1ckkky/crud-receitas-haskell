const API_BASE = "http://172.31.181.200:8080";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

async function carregarReceita() {
    try {
        const res = await fetch(`${API_BASE}/recipes/${recipeId}`);
        if (!res.ok) throw new Error("Erro ao carregar receita");

        const receita = await res.json();

        // Título no topo
        document.getElementById("titulo-receita").textContent = receita.title || "Receita";

        // Tempo: tenta cookTimeMinutes, depois cookTime, senão mostra n/d
        const tempo =
            receita.cookTimeMinutes != null
                ? receita.cookTimeMinutes
                : (receita.cookTime != null ? receita.cookTime : null);

        document.getElementById("box-category").textContent =
            "Categoria: " + (receita.category || "—");

        document.getElementById("box-time").textContent =
            tempo != null ? `Tempo: ${tempo} min` : "Tempo: n/d";

        document.getElementById("box-difficulty").textContent =
            "Dificuldade: " + (receita.difficulty || "—");

        document.getElementById("box-rating").textContent =
            receita.rating != null ? `Nota: ${receita.rating}/5` : "Nota: n/d";

        // Ingredientes ainda não existem no modelo -> mostra apenas traço
        document.getElementById("ingredientes").textContent = "—";

        document.getElementById("modoPreparo").textContent =
            receita.instructions || "—";

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar receita.");
    }
}

// Voltar para a lista
document.getElementById("btn-back").onclick = (e) => {
    e.preventDefault();
    window.location.href = "index.html";
};

// Ir para edição
document.getElementById("btn-edit").onclick = () => {
    window.location.href = `edit.html?id=${recipeId}`;
};

// Excluir
document.getElementById("btn-delete").onclick = async () => {
    if (!confirm("Tem certeza que deseja excluir a receita?")) return;

    try {
        await fetch(`${API_BASE}/recipes/${recipeId}`, { method: "DELETE" });
        alert("Receita excluída!");
        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
        alert("Erro ao excluir receita.");
    }
};

carregarReceita();
