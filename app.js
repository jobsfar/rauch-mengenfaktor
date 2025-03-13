document.addEventListener("DOMContentLoaded", function () {
    let correctionFactor = 5;

    const rauchFactorTable = [
        [20, 1, 1, 1, 2, 2, 2, 3, 3], 
        [30, 1, 2, 2, 3, 3, 4, 4, 5], 
        [40, 2, 2, 3, 4, 4, 5, 6, 6], 
        [50, 2, 3, 4, 5, 5, 6, 7, 8], 
        [80, 3, 4, 5, 6, 7, 8, 9, 10], 
        [100, 4, 5, 6, 8, 9, 10, 11, 12], 
        [125, 5, 6, 7, 9, 10, 12, 13, 14], 
        [150, 6, 7, 8, 10, 11, 13, 15, 16], 
        [175, 7, 8, 9, 11, 13, 15, 17, 18], 
        [200, 8, 9, 11, 13, 15, 17, 19, 22], 
        [250, 10, 11, 13, 16, 19, 22, 23, 23], 
        [300, 13, 14, 16, 19, 23, 23, 23, 23], 
        [350, 15, 16, 18, 22, 23, 23, 23, 23]
    ];

    function updateResults() {
        let workingWidth = parseFloat(document.getElementById('workingWidth').value);
        let applicationRate = parseFloat(document.getElementById('applicationRate').value);
        let speed = parseFloat(document.getElementById('speed').value);

        let massFlow = calculateMassFlow(workingWidth, applicationRate, speed);
        let factor = determineFactor(massFlow, correctionFactor);

        document.getElementById('massFlow').innerText = massFlow.toFixed(2);
        document.getElementById('factor').innerText = factor;

        // Anzeige aktualisieren
        updateCorrectionDisplay(correctionFactor);
    }

    function updateCorrectionDisplay(factor) {
        let message = "";
        if (factor > 5) {
            message = "Mehr Menge ausgebracht";
        } else if (factor < 5) {
            message = "Weniger Menge ausgebracht";
        } else {
            message = "Menge entspricht der Standard-Einstellung";
        }
        document.getElementById("correctionMessage").innerText = message;
    }

    function attachEventListeners() {
        ["workingWidth", "applicationRate", "speed"].forEach(id => {
            let input = document.getElementById(id);
            let slider = document.getElementById(id + "Slider");

            input.addEventListener("input", updateResults);
            slider.addEventListener("input", function () {
                input.value = this.value;
                updateResults();
            });
        });

        let correctionSlider = document.getElementById('correctionFactorSlider');
        let correctionDisplay = document.getElementById('correctionFactorValue');

        correctionSlider.addEventListener("input", function () {
            correctionFactor = parseInt(this.value);
            correctionDisplay.innerText = `${correctionFactor}%`;
            updateResults();
        });
    }

    function loadTable() {
        let tableHTML = "<table><thead><tr><th>Massenstrom (kg/min)</th>";
        for (let i = 3; i <= 10; i++) {
            tableHTML += `<th>Korrektur ${i}%</th>`;
        }
        tableHTML += "</tr></thead><tbody>";

        rauchFactorTable.forEach(row => {
            tableHTML += "<tr>";
            row.forEach(value => {
                tableHTML += `<td>${value === 23 ? "23" : value === "" ? "-1" : value}</td>`;
            });
            tableHTML += "</tr>";
        });

        tableHTML += "</tbody></table>";
        document.getElementById("tableContainer").innerHTML = tableHTML;
    }

    attachEventListeners();
    updateResults();
    loadTable();
});
