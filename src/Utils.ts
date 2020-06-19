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

}
