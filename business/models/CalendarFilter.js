export class CalendarFilter {
    constructor(date, animals, eventType, text) {
      this.date = date; // Format: 'YYYY-MM-DD'
      this.animals = animals; // Ex: ["10", "13", "25"]
      this.eventType = eventType; // Ex: 'Compétition', 'Formation'
      this.text = text ? text : ''; // Texte de recherche
    }
  
    // Fonction pour normaliser une chaîne (enlever les accents, espaces, etc.)
    normalizeText(text) {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
        .replace(/\s+/g, ''); // Enlève les espaces
    }
  
    filter(events) {
        return events.filter(event => {
          const matchDate = this.date ? event.dateevent === this.date : true;
          const matchAnimals = this.animals && this.animals.length > 0
            ? event.animaux.some(animal => this.animals.some(animalFilter => animalFilter.id === animal))
            : true;
      
          const matchEventType = this.eventType && this.eventType.length > 0 ? this.eventType.some(type => type.id ===event.eventtype) : true;
    
          // Vérification avec l'attribut text normalisé
          const matchText = this.text
            ? [event.eventtype, event.discipline, event.epreuve, event.lieu, event.nom, event.traitement]
                .some(field => this.normalizeText(field || '').includes(this.normalizeText(this.text)))
            : true;

          // Retourne true si tous les filtres renseignés correspondent
          return matchDate && matchAnimals && matchEventType && matchText;
        })
        .sort((a, b) => new Date(b.dateevent) - new Date(a.dateevent));
    }
}