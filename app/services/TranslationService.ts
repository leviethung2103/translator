export interface TranslationService {
    translate(text: string, from: string, to: string): Promise<string>;
}