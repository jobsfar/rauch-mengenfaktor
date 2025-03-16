document.addEventListener("DOMContentLoaded", function () {
    const userLang = navigator.language || navigator.userLanguage;
    const isGerman = userLang.startsWith("de");

    const translations = {
        "title": isGerman ? "Düngemengenrechner für Rauch MDS" : "Fertilizer Calculator for Rauch MDS",
        "header": isGerman ? "Düngemengenrechner für Rauch MDS" : "Fertilizer Calculator for Rauch MDS",
        "description": isGerman ? "Dieser Rechner basiert auf der Berechnungsmethode für Rauch MDS Düngerstreuer, ist jedoch nicht von Rauch hergestellt oder unterstützt." :
                                  "This calculator is based on the calculation method for Rauch MDS fertilizer spreaders but is not affiliated with or supported by Rauch."
    };

    Object.keys(translations).forEach(id => {
        let element = document.getElementById(id);
        if (element) element.textContent = translations[id];
    });
});
