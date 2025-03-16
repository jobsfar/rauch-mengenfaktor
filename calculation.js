const rauchFactorTable = {
    20:  {3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 2},
    30:  {3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3},
    40:  {3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4},
    50:  {3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5},
    80:  {3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9},
    100: {3: 3, 4: 4, 5: 5, 6: 6, 7: 8, 8: 9, 9: 10, 10: 11},
    125: {3: 4, 4: 5, 5: 7, 6: 8, 7: 9, 8: 11, 9: 12, 10: 14},
    150: {3: 5, 4: 6, 5: 8, 6: 10, 7: 11, 8: 13, 9: 15},
    175: {3: 5, 4: 7, 5: 9, 6: 11, 7: 13, 8: 15, 9: 17},
    200: {3: 6, 4: 8, 5: 11, 6: 13, 7: 15, 8: 17},
    250: {3: 8, 4: 10, 5: 13, 6: 16, 7: 19, 8: 22},
    300: {3: 9, 4: 13, 5: 16, 6: 19, 7: 23},
    350: {3: 11, 4: 15, 5: 18, 6: 22},
};

function calculateMassFlow(workingWidth, applicationRate, speed) {
    return Math.round((workingWidth * applicationRate * speed) / 600);
}

function determineFactor(massFlow, correctionFactor) {
    if (massFlow < 20 || massFlow > 350) {
        return "Fehler: Massenstrom außerhalb des gültigen Bereichs (20 - 350 kg/min)";
    }

    let massFlowValues = Object.keys(rauchFactorTable).map(Number);

    // Finde den nächstgelegenen Wert
    let closestMassFlow = massFlowValues.reduce((prev, curr) =>
        Math.abs(curr - massFlow) < Math.abs(prev - massFlow) ? curr : prev
    );

    // Speichern des gerundeten Wertes für die Anzeige
    window.roundedMassFlow = closestMassFlow;

    if (rauchFactorTable[closestMassFlow][correctionFactor] !== undefined) {
        return rauchFactorTable[closestMassFlow][correctionFactor];
    } else {
        return "Fehler: Korrekturfaktor nicht in Tabelle";
    }
}
