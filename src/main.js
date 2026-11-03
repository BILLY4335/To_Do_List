import "./style.css"

/* ================= 1. STATO ================= */
const CHIAVE = "todo-tasks"

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []

  try {
    const dati = JSON.parse(testo)
    // difesa in più: deve essere proprio un array
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    console.error("Dati salvati non validi, riparto da zero:", errore.message)
    return []
  }
}

let tasks = caricaStato()

/* ================= 2. RIFERIMENTI ================= */
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")
const form = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")

/* ================= 3. PERSISTENZA ================= */
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

/* ================= 4. VIEW ================= */
function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  const completati = tasks.filter(t => t.completed).length
  info.textContent = `Totali: ${tasks.length} · Completati: ${completati}`
}

/* ================= 5. AZIONI ================= */
function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return

  tasks = [...tasks, { id: Date.now(), title: pulito, completed: false }]
  salvaStato()
  render()
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
  salvaStato()
  render()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  salvaStato()
  render()
}

/* ================= 6. EVENTI ================= */
form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})

lista.addEventListener("click", (evento) => {
  const elemento = evento.target

  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }

  const riga = elemento.closest("li")
  if (riga) {
    toggleTask(Number(riga.dataset.id))
  }
})

/* ================= 7. AVVIO ================= */
render()
