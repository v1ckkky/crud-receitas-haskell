const API_BASE = "http://172.31.181.200:8080";

const form = document.getElementById("form-nova");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const cookTime = document.getElementById("cookTime").value;
    const difficulty = document.getElementById("difficulty").value.trim();
    const rating = document.getElementById("rating").value;
    const instructions = document.getElementById("instructions").value.trim();

    const body = {
        title,
        category,
        cookTimeMinutes: cookTime ? Number(cookTime) : null,
        difficulty,
        rating: rating ? Number(rating) : null,
        instructions
    };

    try {
        const res = await fetch(`${API_BASE}/recipes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error(await res.text());
            alert("Erro ao salvar receita.");
            return;
        }

        alert("Receita salva com sucesso!");
        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar receita.");
    }
});
