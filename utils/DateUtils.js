export default class DateUtils {
    dateFormatter(dateToFormat, formatBefore, separator){
        switch(formatBefore){
            case "dd/MM/yyyy":
                var arrayDate = dateToFormat.split(separator);

                return arrayDate[2] + "-" + arrayDate[1] + "-" + arrayDate[0];
            case "yyyy-mm-dd":
                var arrayDate = dateToFormat.split(separator);

                return arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0];
        }
    }

    isDateValid(dateStr) {
        return !isNaN(new Date(dateStr));
      }
}