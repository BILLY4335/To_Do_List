import "./style.css"

// MAIN PARTE 1 :D

/*
// ---------- 1. STATO ---------- 
let tasks = [
  { id: 1, title: "Studiare per la verifica", completed: false },
  { id: 2, title: "Comprare il pane", completed: true },
  { id: 3, title: "Finire il progetto TPSIT", completed: false },
  { id: 4, title: "Studiare storia senno prendo 4", completed: false } //es 1
]

// ---------- 2. RIFERIMENTI ALLA PAGINA ---------- 
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")

// ---------- 3. VIEW ---------- 
function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  //es 2
  const quanti = tasks.length
  const finiti = tasks.filter(t => t.completed).length
  const nonfiniti = quanti - finiti


  const completati = tasks.filter(t => t.completed).length
  info.textContent =
    `Totali: ${quanti} · Completati: ${finiti} · Da fare: ${nonfiniti}`
}

// ---------- 4. AVVIO ---------- 
render()

//es 3

const giacomo = document.createElement("li")
giacomo.textContent = "Giacomo è simpaticissimo! voglio parlare con lui!"
lista.append(giacomo)

*/



// ================= 1. STATO ================= 
const CHIAVE = "todo-tasks"

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return []

  try {
    const verificaDelNove = JSON.parse(testo)
    return Array.isArray(verificaDelNove) ? verificaDelNove : []
  } catch (SuperError) {
    console.error("GIACOMO NO hAI SBAGLIATOOOOOOO, ripatimento bep bep bop 🤖", SuperError.message)
    return []
  }

}

let tasks = caricaStato()

// ================= 2. RIFERIMENTI ================= 
const lista = document.querySelector("#lista")
const info = document.querySelector("#info")
const form = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")
const messaggio = document.querySelector("#messaggio") // Es 8
const azioni = document.querySelector("#azioni")       // Es 9

// ================= 3. PERSISTENZA ================= 
function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

// Es 4 

function status_Aggiornato(nuovo_compito) {
  tasks = nuovo_compito
  salvaStato()
  render()
}


// ================= 4. VIEW ================= 
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

  // Es 8 - frase che cambia in base alla situazione
  const totali = tasks.length
  const restanti = totali - completati

  let frase
  if (totali === 0) {
    frase = "Non hai task. Buona giornata."
  } else if (restanti === 0) {
    frase = "Fatto tutto. Complimenti."
  } else {
    frase = `Ti restano ${restanti} task su ${totali}.`
  }

  messaggio.textContent = frase

  // Es 9 - il pulsante compare solo se c'è almeno un task completato
  azioni.innerHTML = completati > 0
    ? `<button id="pulisci">Elimina completati (${completati})</button>`
    : ""

  const pulisci = document.querySelector("#pulisci")
  if (pulisci) {
    pulisci.addEventListener("click", deleteCompletati)
  }
}

// ================= 5. AZIONI ================= 
function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return


  status_Aggiornato([...tasks, { id: Date.now(), title: pulito, completed: false }])
}

function toggleTask(id) {
  status_Aggiornato(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
}

function deleteTask(id) {
  status_Aggiornato(tasks.filter(t => t.id !== id))
}

// Es 9
function deleteCompletati() {
  if (!confirm("Elimino tutti i task completati?")) return
  tasks = tasks.filter(t => !t.completed)   // tengo i non completati
  salvaStato()
  render()
}

// ================= 6. EVENTI ================= 
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

// ================= 7. AVVIO =================   
render()


// Es 7 - messaggio di benvenuto persistente
const informazione = "todo-nome"
const box = document.querySelector("#saluto")

function renderBenvenuto() {
  const nome = localStorage.getItem(informazione)

  if (nome) {
    box.innerHTML = `<p>Bentornato, ${nome}</p>`
    return
  }

  box.innerHTML = `
    <input type="text" id="campo-nome" placeholder="Come ti chiami?">
    <button id="salva-nome">Salva</button>
  `

  document.querySelector("#salva-nome").addEventListener("click", () => {
    const valore = document.querySelector("#campo-nome").value.trim()
    if (valore === "") return
    localStorage.setItem(informazione, valore)
    renderBenvenuto()
  })
}

renderBenvenuto()