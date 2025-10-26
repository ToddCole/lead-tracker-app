import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

// Add early log to confirm script execution in the browser console
console.log("index.js loaded")

// Wrap initialization and DOM wiring in DOMContentLoaded to ensure elements exist
document.addEventListener("DOMContentLoaded", () => {
  try {
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

    // Listen for DB changes and render
    onValue(referenceInDB, (snapshot) => {
      if (!snapshot.exists()) {
        ulEl.innerHTML = ""
        return
      }
      const leads = Object.values(snapshot.val())
      render(leads)
    })

    // Use dblclick for delete to avoid accidental removals
    deleteBtn.addEventListener("dblclick", () => {
      remove(referenceInDB)
      ulEl.innerHTML = ""
    })

    // Add click handler for saving input
    inputBtn.addEventListener("click", () => {
      console.log("SAVE button clicked")
      const v = inputEl.value.trim()
      if (!v) return
      push(referenceInDB, v)
      inputEl.value = ""
    })

  } catch (err) {
    // Surface any initialization/runtime errors in console so user can see why clicks may not be wired
    console.error("Error initializing app:", err)
  }
})
