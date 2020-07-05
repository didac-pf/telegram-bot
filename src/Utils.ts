import RegexLib from "./RegexLib";

export default class {

  static getCommandFromText(unparsedText: string) {

    const result = RegexLib.detectCommand.exec(unparsedText);

    let parsedText = result[0];

    return parsedText;
  }

  /**
   * 
   * @param hour Format hh:mm (e.g.: 09:00)
   */
  static getTodayDateAt(hour: string) : Date {
    const splitHour = hour.split(':');
    const hh = parseInt(splitHour[0]);
    const mm = parseInt(splitHour[1]);

    const date = new Date();
    date.setHours(hh);
    date.setMinutes(mm);
    date.setSeconds(0);

    return date;
  }

  static formatDate(date: Date) {
    let month = '' + (date.getMonth() + 1);
    let day   = '' + date.getDate();
    let year  = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    } 

    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

}
