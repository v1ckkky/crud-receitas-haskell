const API_BASE = "http://172.31.181.200:8080";

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const form = document.getElementById("form-edit");

async function carregarReceita() {
    try {
        const res = await fetch(`${API_BASE}/recipes/${recipeId}`);
        if (!res.ok) throw new Error("Erro ao carregar receita");

        const receita = await res.json();

        document.getElementById("title").value       = receita.title || "";
        document.getElementById("category").value    = receita.category || "";
        document.getElementById("cookTime").value    =
            receita.cookTimeMinutes != null ? receita.cookTimeMinutes : "";
        document.getElementById("difficulty").value  = receita.difficulty || "";
        document.getElementById("rating").value      =
            receita.rating != null ? receita.rating : "";
        document.getElementById("instructions").value = receita.instructions || "";

    } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados da receita.");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value,
        cookTimeMinutes: document.getElementById("cookTime").value
            ? Number(document.getElementById("cookTime").value)
            : null,
        difficulty: document.getElementById("difficulty").value.trim(),
        rating: document.getElementById("rating").value
            ? Number(document.getElementById("rating").value)
            : null,
        instructions: document.getElementById("instructions").value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/recipes/${recipeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error(await res.text());
            alert("Erro ao salvar alterações.");
            return;
        }

        alert("Receita atualizada!");
        window.location.href = `receita.html?id=${recipeId}`;
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar alterações.");
    }
});

document.getElementById("btn-voltar-lista").onclick = (e) => {
    e.preventDefault();
    window.location.href = `receita.html?id=${recipeId}`;
};

carregarReceita();
