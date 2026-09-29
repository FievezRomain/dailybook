class DateUtils {
  dateFormatter(dateToFormat: string, formatBefore: string, separator: string): string | undefined {
    switch (formatBefore) {
      case "dd/MM/yyyy": {
        const arrayDate = dateToFormat.split(separator);
        return arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0];
      }
      case "yyyy-mm-dd": {
        const arrayDate = dateToFormat.split(separator);
        return arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
      }
    }
  }

  isDateValid(dateStr: string): boolean {
    return !isNaN(new Date(dateStr).getTime());
  }

  transformTimestampToDate(timestamp: number): string {
    const readable = new Intl.DateTimeFormat(undefined, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));

    return readable;
  }
}

const instanceDateUtils = new DateUtils();

export default instanceDateUtils;
