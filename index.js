import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

// ✅ FIXED: single config object, no nesting
const firebaseConfig = {
  databaseURL: "https://lead-tracker-app-7a0b8-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDB = ref(database, "leads")

const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

function render(leads) {
  let listItems = ""
  for (let i = 0; i < leads.length; i++) {
    listItems += `
      <li>
        <a target="_blank" href="${leads[i]}">
          ${leads[i]}
        </a>
      </li>
    `
  }
  ulEl.innerHTML = listItems
}

onValue(referenceInDB, (snapshot) => {
  if (!snapshot.exists()) {
    ulEl.innerHTML = ""
    return
  }
  const leads = Object.values(snapshot.val())
  render(leads)
})

deleteBtn.addEventListener("dblclick", () => {
  remove(referenceInDB)
  ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", () => {
  const v = inputEl.value.trim()
  if (!v) return
  push(referenceInDB, v)
  inputEl.value = ""
})
