import { Event, EventType } from "../../models/Event";

export class CalendarFilter {
  date?: Date;
  animals?: number[];
  eventType?: EventType[];
  text: string;

  constructor(
    date?: Date,
    animals?: number[],
    eventType?: EventType[],
    text?: string
  ) {
    this.date = date;
    this.animals = animals;
    this.eventType = eventType;
    this.text = text ?? '';
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  }

  filter(events: Event[]): Event[] {
    return events
      .filter((event) => {
        const matchDate = this.date ? event.dateevent === this.date : true;

        const matchAnimals =
          this.animals && this.animals.length > 0
            ? event.animaux.some((animalId) =>
                this.animals!.some((filterAnimal) => filterAnimal === animalId)
              )
            : true;

        const matchEventType =
          this.eventType && this.eventType.length > 0
            ? this.eventType!.some((type) => type.id === event.eventtype)
            : true;

        const matchText = this.text
          ? [event.eventtype, event.discipline, event.epreuve, event.lieu, event.nom, event.traitement].some(
              (field) =>
                this.normalizeText(field || '').includes(this.normalizeText(this.text))
            )
          : true;

        return matchDate && matchAnimals && matchEventType && matchText;
      })
      .sort((a, b) => new Date(b.dateevent).getTime() - new Date(a.dateevent).getTime());
  }
}
