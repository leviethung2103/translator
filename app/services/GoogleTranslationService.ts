import { TranslationService } from './TranslationService';

export class GoogleTranslationService implements TranslationService {
    async translate(text: string, from: string, to: string): Promise<string> {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(text)}`;
        const response = await fetch(url);
        const json = await response.json();
        return json[0].map((item: any) => item[0]).join('');
    }
}