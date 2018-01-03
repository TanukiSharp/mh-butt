import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { IEquipmentLocale } from '../../models/equipment';
import { ISkillLocale } from '../../models/skill';

export interface ILocalizationMap<T> { [key: number]: T; }

@Injectable()
export class LocalizationService {

    private loadedLanguage: string;
    private equipments: ILocalizationMap<IEquipmentLocale>;
    private skills: ILocalizationMap<ISkillLocale>;
    private abilities: ILocalizationMap<string>;

    constructor(
        private http: Http
    ) {
        this.loadLocalization('fr');
    }

    public getAbilityText(id: number): string|null {

        if (Number.isSafeInteger(id) === false) {
            console.warn(`Invalid ability id '${id}'`);
            return null;
        }

        if (!this.abilities) {
            return null;
        }

        return this.abilities[id];
    }

    public getSkillLocale(id: number): ISkillLocale|null {

        if (Number.isSafeInteger(id) === false) {
            console.warn(`Invalid skill id '${id}'`);
            return null;
        }

        if (!this.skills) {
            return null;
        }

        return this.skills[id];
    }

    public getSkillName(id: number): string|null {

        let skillLocale: ISkillLocale|null = this.getSkillLocale(id);

        if (!skillLocale) {
            return null;
        }

        return skillLocale.name;
    }

    public getSkillDescription(id: number): string|null {

        let skillLocale: ISkillLocale|null = this.getSkillLocale(id);

        if (!skillLocale) {
            return null;
        }

        return skillLocale.description;
    }

    public getEquipmentLocale(id: number): IEquipmentLocale|null {

        if (Number.isSafeInteger(id) === false) {
            console.warn(`Invalid equipment id '${id}'`);
            return null;
        }

        if (!this.equipments) {
            return null;
        }

        return this.equipments[id];
    }

    public getEquipmentName(id: number): string|null {

        let equipmentLocale: IEquipmentLocale|null = this.getEquipmentLocale(id);

        if (!equipmentLocale) {
            return null;
        }

        return equipmentLocale.name;
    }

    public getEquipmentDescription(id: number): string|null {

        let equipmentLocale: IEquipmentLocale|null = this.getEquipmentLocale(id);

        if (!equipmentLocale) {
            return null;
        }

        return equipmentLocale.description;
    }

    private async loadLocalization(language: string) {

        if (language === this.loadedLanguage) {
            return;
        }

        this.equipments = await this.loadLocalizationFile<IEquipmentLocale>('equipments', language);
        this.skills = await this.loadLocalizationFile<ISkillLocale>('skills', language);
        this.abilities = await this.loadLocalizationFile<string>('abilities', language);

        console.log('this.equipments', this.equipments);
        console.log('this.skills', this.skills);
        console.log('this.abilities', this.abilities);

        this.loadedLanguage = language;
    }

    private async loadLocalizationFile<T>(what: string, language: string): Promise<ILocalizationMap<T>> {
        let jsonRoot: Object;
        let filename = `assets/localization/${what}.${language}.json`;
        let response: Response = await this.http.get('../' + filename).toPromise();

        try {
            jsonRoot = response.json();
        } catch (err) {
            console.error(err);
            return;
        }

        let result: ILocalizationMap<T> = {};

        for (let key in jsonRoot) {
            let num = parseInt(key, 10);
            if (Number.isSafeInteger(num) === false || num.toString() !== key) {
                console.error(`Invalid key '${key} in file '${filename}'`);
                // TODO properly report errors
                continue;
            }

            result[num] = jsonRoot[key];
        }

        return result;
    }
}
