const SOURCE_URL = "https://expovoi.onrender.com/db.json";
let categories = {};

// Fetch JSON data
async function fetchData() {
  const res = await fetch(SOURCE_URL);
  return await res.json();
}

// Populate category dropdown
async function populateCategorySelect() {
  const data = await fetchData();
  categories = data.categories;
  const categorySelect = document.getElementById("category-select");
  categorySelect.innerHTML = '<option value="">-- Choose Category --</option>';

  Object.keys(categories).forEach(cat => {
    if (!["Ring 2", "Archboss Weap 1", "Archboss Weap 2"].includes(cat)) {
      const displayName = cat === "Ring 1" ? "Ring" : cat;
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = displayName;
      categorySelect.appendChild(opt);
    }
  });
}

// Populate item dropdown based on category
function populateItemSelect(category) {
  const itemSelect = document.getElementById("item-select");
  itemSelect.innerHTML = '';
  (categories[category] || []).forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    itemSelect.appendChild(opt);
  });
}

// Check eligibility and display results
async function checkEligibility() {
  const data = await fetchData();
  const category = document.getElementById("category-select").value;
  const item = document.getElementById("item-select").value;

  const eligible = data.members.filter(member => {
    const attendanceCount = member.attendance?.filter(Boolean).length || 0;
    const hasItem = Object.values(member.items || {}).some(list => list.includes(item));
    return attendanceCount >= 4 && hasItem;
  });

  const list = document.getElementById("eligible-list");
  list.innerHTML = eligible.map(m => `<li>${m.name}</li>`).join("");
}

// Setup event listeners
document.getElementById("category-select").addEventListener("change", e => {
  populateItemSelect(e.target.value);
});

document.getElementById("check-button").addEventListener("click", checkEligibility);

document.addEventListener("DOMContentLoaded", populateCategorySelect);
