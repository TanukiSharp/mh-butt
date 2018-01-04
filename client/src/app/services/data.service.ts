import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ISkillData } from '../models/skill';
import { IEquipmentData } from '../models/equipment';

@Injectable()
export class DataService {

    private _equipments: IEquipmentData[];
    private _skills: ISkillData[];

    public constructor(
        private http: Http,
    ) {
    }

    public async findEquipmentById(id: number): Promise<IEquipmentData|null> {

        let equipments: IEquipmentData[]|null = await this.getEquipments();

        if (!equipments) {
            return null;
        }

        for (let i: number = 0; i < equipments.length; i += 1) {
            if (equipments[i].id === id) {
                return equipments[i];
            }
        }

        return null;
    }

    public async findSkillById(id: number): Promise<ISkillData|null> {

        let skills: ISkillData[]|null = await this.getSkills();

        if (!skills) {
            return null;
        }

        for (let i: number = 0; i < skills.length; i += 1) {
            if (skills[i].id === id) {
                return skills[i];
            }
        }

        return null;
    }

    public async getEquipments(): Promise<IEquipmentData[]|null> {

        if (this._equipments) {
            return this._equipments;
        }

        let response: Response = await this.http.get('../../assets/equipments.json').toPromise();

        try {
            this._equipments = response.json();
            return this._equipments;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    public async getSkills(): Promise<ISkillData[]|null> {

        if (this._skills) {
            return this._skills;
        }

        let response: Response = await this.http.get('../../assets/skills.json').toPromise();

        try {
            this._skills = response.json();
            return this._skills;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}
