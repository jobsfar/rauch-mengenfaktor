function calculateMassFlow(workingWidth, applicationRate, speed) {
    return Math.round((workingWidth * applicationRate * speed) / 600);
}

function determineFactor(massFlow, correctionFactor) {
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

    // Passenden Faktor für die gegebene Massenstrom-Zahl finden
    for (let i = 0; i < rauchFactorTable.length; i++) {
        if (massFlow <= rauchFactorTable[i][0]) {
            return rauchFactorTable[i][correctionFactor - 3]; // Index anpassen für 3%-10%
        }
    }

    return 23; // Maximaler Faktor laut Tabelle
}
