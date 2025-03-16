document.addEventListener("DOMContentLoaded", function () {
    let correctionFactor = 6; // Standardwert für Mengenkorrektur

    function updateResults() {
        let workingWidth = parseFloat(document.getElementById('workingWidth').value);
        let applicationRate = parseFloat(document.getElementById('applicationRate').value);
        let speed = parseFloat(document.getElementById('speed').value);

        let massFlow = calculateMassFlow(workingWidth, applicationRate, speed);
        let factor = determineFactor(massFlow, correctionFactor);

        document.getElementById('massFlow').innerText = massFlow.toFixed(2);
        document.getElementById('factor').innerText = factor;
        document.getElementById('roundedMassFlow').innerText = `Gerundet auf: ${window.roundedMassFlow} kg/min`;

        // Fehleranzeige
        if (typeof factor === "string" && factor.startsWith("Fehler")) {
            document.getElementById('factor').style.color = "red";
        } else {
            document.getElementById('factor').style.color = "black";
        }
    }

    function displayTable() {
        let tableHTML = "<table border='1'><thead>";
        
        // Erste Header-Zeile für Mengenkorrektur
        tableHTML += "<tr><th rowspan='2'>Massenstrom (kg/min)</th><th colspan='8'>Mengenkorrektur (%)</th></tr>";
    
        // Zweite Header-Zeile mit Prozentwerten
        tableHTML += "<tr>";
        for (let i = 3; i <= 10; i++) {
            tableHTML += `<th>${i}%</th>`;
        }
        tableHTML += "</tr></thead><tbody>";
    
        // Tabellenwerte aus der Rauch-Tabelle einfügen
        for (const [massFlow, factors] of Object.entries(rauchFactorTable)) {
            tableHTML += `<tr><td>${massFlow}</td>`;
            for (let i = 3; i <= 10; i++) {
                tableHTML += `<td>${factors[i] !== undefined ? factors[i] : "-"}</td>`;
            }
            tableHTML += "</tr>";
        }
    
        tableHTML += "</tbody></table>";
        document.getElementById("tableContainer").innerHTML = tableHTML;
    }
    
    

    function syncInputAndSlider(inputId, sliderId) {
        let input = document.getElementById(inputId);
        let slider = document.getElementById(sliderId);

        input.addEventListener("input", function () {
            slider.value = input.value;
            updateResults();
        });

        slider.addEventListener("input", function () {
            input.value = slider.value;
            updateResults();
        });
    }

    function attachEventListeners() {
        syncInputAndSlider("workingWidth", "workingWidthSlider");
        syncInputAndSlider("applicationRate", "applicationRateSlider");
        syncInputAndSlider("speed", "speedSlider");

        let correctionSlider = document.getElementById('correctionFactorSlider');
        let correctionDisplay = document.getElementById('correctionFactorValue');

        correctionSlider.value = correctionFactor; // Standard auf 6% setzen
        correctionDisplay.innerText = `${correctionFactor}%`;

        correctionSlider.addEventListener("input", function () {
            correctionFactor = parseInt(this.value);
            correctionDisplay.innerText = `${correctionFactor}%`;
            updateResults();
        });
    }

    attachEventListeners();
    updateResults();
    displayTable();
});
