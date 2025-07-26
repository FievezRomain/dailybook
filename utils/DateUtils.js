class DateUtils {
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

    transformTimestampToDate(timestamp){
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