import BaseInformer, { TSchedules } from '../BaseInformer';
import AxiosLib, { AxiosInstance } from 'axios';
import * as XMLParser from 'fast-xml-parser';
import AemetMapping from './AemetMapping';
import endpoints from '../../../../endpoints';
import Utils from '../../../../Utils';

const calloutWords = [
  { originWord: 'lluvia',    targetWord: 'lluvioso', weight: 100 },
  { originWord: 'nuboso',    targetWord: 'nublado',  weight: 1 },
  { originWord: 'despejado', targetWord: 'soleado',  weight: 1 },
];

export default class Weather extends BaseInformer {

  protected informerName      = 'Weather';
  protected executionSchedule = 'daily' as TSchedules;
  protected executionTime     = '09:00';

  private calloutWordsResults = {};

  private AxiosBot : AxiosInstance;

  constructor() {
    super();

    this.AxiosBot = AxiosLib.create({
      baseURL : endpoints.baseUrl,
      timeout : 0, // No timeout
    });
  }

  async action() {
    console.log(process.env.AEMET_CITY_CODE_1);
    const result = await AxiosLib.get(`https://www.aemet.es/xml/municipios_h/localidad_h_${process.env.AEMET_CITY_CODE_1}.xml`);
    
    const options : Partial<XMLParser.J2xOptions> = {
      ignoreAttributes: false
    }

    const parsedData = XMLParser.parse(result.data, options);

    try {
      for (const day of parsedData.root.prediccion.dia) {

        // console.log(day);
        console.log(day['@_fecha'], Utils.formatDate(new Date()));

        if (day['@_fecha'] !== Utils.formatDate(new Date())) {
          continue;
        }

        for (const unparsedValue of day.estado_cielo) {
          // TODO seguir aqui, parsedValue parece undefined
          const parsedValue = AemetMapping[unparsedValue];

          calloutWords.map(item => {
            if (parsedValue.indexOf(item.originWord) !== -1) {
              if (this.calloutWordsResults[item.originWord]) {
                this.calloutWordsResults[item.targetWord] += item.weight;
              } else {
                this.calloutWordsResults[item.targetWord] = item.weight;
              }
            }
          });
        }        
      }

      const tmpArray = [];
      for (const key in this.calloutWordsResults) {
        tmpArray.push([key, this.calloutWordsResults[key]]);
      }

      tmpArray.sort((a, b) => b[1] - a[1]);

      let resultString = '';
      let i = 0;
      let length = tmpArray.length - 1;
      for (const item of tmpArray) {
        if (i > 0 && i < length) {
          resultString += ', ';
        } else if (i === length) {
          resultString += ' y ';
        }

        resultString += item[0];

        i++;
      }

      const text = `La previsión para hoy en ${parsedData.root.nombre} es de un día ${resultString}`;

      console.log(text);

      // await this.sendMessage(parseInt(process.env.CHAT_ID), text)

    } catch (err) {
      console.log('Something went wrong during data interpretation:');
      console.log(err);
    }
    
  }

  private async sendMessage(chatId: number, text: string) {
    await this.AxiosBot.post(endpoints.sendMessage, {
      chat_id : chatId,
      text    : text,
    });
  }

}
