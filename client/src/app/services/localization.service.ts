import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { IEquipmentLocale } from '../models/equipment';
import { ISkillLocale } from '../models/skill';

export interface ILocalizationMap<T> { [key: number]: T }

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

    public async loadLocalization(language: string): Promise<boolean> {

        if (language === this.loadedLanguage) {
            return true;
        }

        let equipments = await this.loadLocalizationFile<IEquipmentLocale>('equipments', language);
        let skills = await this.loadLocalizationFile<ISkillLocale>('skills', language);
        let abilities = await this.loadLocalizationFile<string>('abilities', language);

        if (equipments === null || skills === null || abilities === null) {
            return false;
        }

        this.equipments = equipments;
        this.skills = skills;
        this.abilities = abilities;

        this.loadedLanguage = language;

        return true;
    }

    private async loadLocalizationFile<T>(what: string, language: string): Promise<ILocalizationMap<T>|null> {
        let jsonRoot: ILocalizationMap<T>;
        let filename = `../assets/localization/${what}.${language}.json`;
        let response: Response = await this.http.get('../' + filename).toPromise();

        try {
            jsonRoot = response.json();
        } catch (err) {
            console.error(`Failed to parse file '${filename}': error: ${err}`);
            return null;
        }

        let result: ILocalizationMap<T> = {};

        for (let key in jsonRoot) {
            let num = parseInt(key, 10);
            if (Number.isSafeInteger(num) === false || num.toString() !== key) {
                console.error(`Invalid key '${key}' in file '${filename}'`);
                // TODO properly report errors
                return null;
            }

            result[num] = jsonRoot[key] as T;
        }

        return result;
    }
}
