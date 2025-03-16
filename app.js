document.addEventListener("DOMContentLoaded", function () {
    let themeToggleButton = document.getElementById("toggleTheme");
    let correctionFactor = 6;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let favoriteIcon = document.getElementById("favoriteIcon");
    let loadFavoritesButton = document.getElementById("loadFavoritesButton");
    let favoritesDropdown = document.getElementById("favoritesDropdown");
    let favoritesList = document.getElementById("favoritesList");

    function detectSystemTheme() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        let theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        localStorage.setItem("theme", theme);
        themeToggleButton.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }

    function loadTheme() {
        let savedTheme = localStorage.getItem("theme");
        let systemTheme = detectSystemTheme();

        if (savedTheme) {
            document.body.classList.toggle("dark-mode", savedTheme === "dark");
            themeToggleButton.textContent = savedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
        } else {
            document.body.classList.toggle("dark-mode", systemTheme === "dark");
            themeToggleButton.textContent = systemTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
        }
    }

    function updateResults() {
        let workingWidth = parseFloat(document.getElementById('workingWidth').value);
        let applicationRate = parseFloat(document.getElementById('applicationRate').value);
        let speed = parseFloat(document.getElementById('speed').value);

        let massFlow = calculateMassFlow(workingWidth, applicationRate, speed);
        let roundedMassFlow = findClosestMassFlow(massFlow);
        let factor = determineFactor(massFlow, correctionFactor);

        document.getElementById('massFlow').innerText = massFlow.toFixed(2);
        document.getElementById('factor').innerText = factor;
        document.getElementById('roundedMassFlow').innerText = `Gerundet auf: ${roundedMassFlow} kg/min`;

        checkFavoriteStatus();
    }

    function syncInputAndSlider(inputId, sliderId) {
        let input = document.getElementById(inputId);
        let slider = document.getElementById(sliderId);

        function resetFavoriteStatus() {
            favoriteIcon.classList.remove("saved");
        }

        input.addEventListener("input", function () {
            slider.value = input.value;
            updateResults();
            resetFavoriteStatus();
        });

        slider.addEventListener("input", function () {
            input.value = slider.value;
            updateResults();
            resetFavoriteStatus();
        });
    }

    function getCurrentSettings() {
        return {
            workingWidth: document.getElementById("workingWidth").value,
            applicationRate: document.getElementById("applicationRate").value,
            speed: document.getElementById("speed").value,
            correctionFactor: document.getElementById("correctionFactorSlider").value
        };
    }

    function isFavoriteSaved() {
        return favorites.some(fav => JSON.stringify(fav.data) === JSON.stringify(getCurrentSettings()));
    }

    function checkFavoriteStatus() {
        if (isFavoriteSaved()) {
            favoriteIcon.classList.add("saved");
        } else {
            favoriteIcon.classList.remove("saved");
        }

        loadFavoritesButton.style.display = favorites.length > 0 ? "inline-block" : "none";
    }

    function toggleFavorite() {
        let currentSettings = getCurrentSettings();
        let index = favorites.findIndex(fav => JSON.stringify(fav.data) === JSON.stringify(currentSettings));

        if (index === -1) {
            let name = prompt("Favoritenname eingeben (z. B. Düngersorte):");
            if (!name) return;

            favorites.push({ name, data: currentSettings });
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesList();
        checkFavoriteStatus();
    }

    function updateFavoritesList() {
        favoritesList.innerHTML = "";

        favorites.forEach((fav, index) => {
            let li = document.createElement("li");

            let nameSpan = document.createElement("span");
            nameSpan.textContent = fav.name;
            nameSpan.onclick = () => loadFavorite(index);

            let deleteIcon = document.createElement("span");
            deleteIcon.textContent = "🗑️";
            deleteIcon.classList.add("delete-icon");
            deleteIcon.onclick = (event) => {
                event.stopPropagation();
                deleteFavorite(index);
            };

            li.appendChild(nameSpan);
            li.appendChild(deleteIcon);
            favoritesList.appendChild(li);
        });

        loadFavoritesButton.style.display = favorites.length > 0 ? "inline-block" : "none";
    }

    function loadFavorite(index) {
        let fav = favorites[index].data;
        document.getElementById("workingWidth").value = fav.workingWidth;
        document.getElementById("workingWidthSlider").value = fav.workingWidth;
        document.getElementById("applicationRate").value = fav.applicationRate;
        document.getElementById("applicationRateSlider").value = fav.applicationRate;
        document.getElementById("speed").value = fav.speed;
        document.getElementById("speedSlider").value = fav.speed;
        document.getElementById("correctionFactorSlider").value = fav.correctionFactor;

        updateResults();
        favoritesDropdown.style.display = "none"; // Dropdown automatisch schließen
    }

    function deleteFavorite(index) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavoritesList();
        checkFavoriteStatus();
    }

    function toggleFavoritesDropdown() {
        favoritesDropdown.style.display = favoritesDropdown.style.display === "none" ? "block" : "none";
    }

    function displayTable() {
        let tableContainer = document.getElementById("tableContainer");
        let tableHTML = "<table><tr><th>Massenstrom (kg/min)</th>";

        Object.keys(factorTable[Object.keys(factorTable)[0]]).forEach(key => {
            tableHTML += `<th>${key}%</th>`;
        });

        tableHTML += "</tr>";

        Object.entries(factorTable).forEach(([massFlow, values]) => {
            tableHTML += `<tr><td>${massFlow}</td>`;
            Object.values(values).forEach(value => {
                tableHTML += `<td>${value !== null ? value : "-"}</td>`;
            });
            tableHTML += "</tr>";
        });

        tableHTML += "</table>";
        tableContainer.innerHTML = tableHTML;
    }

    document.getElementById("loadFavoritesButton").addEventListener("click", toggleFavoritesDropdown);
    document.getElementById("favoriteIcon").addEventListener("click", toggleFavorite);

    syncInputAndSlider("workingWidth", "workingWidthSlider");
    syncInputAndSlider("applicationRate", "applicationRateSlider");
    syncInputAndSlider("speed", "speedSlider");

    let correctionSlider = document.getElementById('correctionFactorSlider');
    let correctionDisplay = document.getElementById('correctionFactorValue');

    correctionSlider.value = correctionFactor;
    correctionDisplay.innerText = `${correctionFactor}%`;

    correctionSlider.addEventListener("input", function () {
        correctionFactor = parseInt(this.value);
        correctionDisplay.innerText = `${correctionFactor}%`;
        updateResults();
    });

    themeToggleButton.addEventListener("click", toggleTheme);
    loadTheme();
    updateResults();
    updateFavoritesList();
    displayTable();
});
