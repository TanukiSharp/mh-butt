import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { IEquipmentData, IEquipmentSkillData } from '../models/equipment';
import { ISkillData, ISkillLevelData } from '../models/skill';
import { environment } from '../../environments/environment.prod';

export interface IInverseSkillLevel {
    skillId: number;
    requiredPoints: number;
    conferredByEquipments: IEquipmentData[];
}

export interface IInverseAbility {
    /** ability id */
    id: number;
    conferredBySkills: IInverseSkillLevelMap;
}

interface IEquipmentDataMap { [equipmentId: number]: IEquipmentData }
interface ISkillDataMap { [skillId: number]: ISkillData }

interface IInverseSkillLevelMap { [skillIdLevelPair: string]: IInverseSkillLevel }
interface IInverseSkillMap { [skillId: number]: IInverseAbility }
interface IInverseAbilityMap { [abilityId: number]: IInverseAbility }

@Injectable()
export class InversearchService {

    private inverseMap: IInverseAbility[];

    constructor(private dataService: DataService) {
    }

    public async getAbilities(): Promise<IInverseAbility[]|null> {

        if (this.inverseMap) {
            return this.inverseMap;
        }

        if (await this.constructInverseSearchMap() === false) {
            return null;
        }

        return this.inverseMap;
    }

    private printConstructInverseSearchMapDuration(duration: number) {

        let unit: string = 'ms';

        if (duration >= 1000) {
            duration /= 10;
            duration = Math.round(duration);
            duration /= 100;
            unit = 'sec';
        }
        console.log(`constructing inverse search map took ${duration} ${unit}`);
    }

    private printInverseSearchMapJsonSize(inverseAbilityMap: IInverseAbility[]) {

        let size: number = JSON.stringify(inverseAbilityMap).length;
        let originalSize: number = size;
        let suffix: string = ' bytes';

        if (size >= 1024 * 1024) {
            size /= 1024 * 1024;
            size *= 100;
            size = Math.round(size);
            size /= 100;
            suffix = `MB (${originalSize} bytes)`;
        } else if (size >= 1024) {
            size /= 1024;
            size *= 100;
            size = Math.round(size);
            size /= 100;
            suffix = `KB (${originalSize} bytes)`;
        }

        console.log(`JSON size of inverse search map is ${size} ${suffix}`);
    }

    public async constructInverseSearchMap(): Promise<boolean> {

        if (this.inverseMap) {
            return true;
        }

        let equipments: IEquipmentData[]|null = await this.dataService.getEquipments();

        if (!equipments) {
            console.error('Failed to retrieve equipments data');
            return false;
        }

        console.log('equipments: ', equipments);

        let skills: ISkillData[]|null = await this.dataService.getSkills();

        if (!skills) {
            console.error('Failed to retrieve skills data');
            return false;
        }

        console.log('skills: ', skills);

        let startTime: number = 0;

        //if (!environment.production) {
            startTime = Date.now();
        //}

        let localInverseMap: IInverseAbility[]|null = this.constructInverseSearchMapInternal(equipments, skills);

        if (!localInverseMap) {
            return false;
        }

        //if (!environment.production) {
            this.printConstructInverseSearchMapDuration(Date.now() - startTime);
            this.printInverseSearchMapJsonSize(localInverseMap);
        //}

        this.inverseMap = localInverseMap;

        return true;
    }

    private constructSkillDataMap(skills: ISkillData[]): ISkillDataMap  {
        let resultMap: ISkillDataMap = {};

        for (let i: number = 0; i < skills.length; i += 1) {
            resultMap[skills[i].id] = skills[i];
        }

        return resultMap;
    }

    private constructInverseSearchMapInternal(equipments: IEquipmentData[], skills: ISkillData[]): IInverseAbility[]|null {

        let inverseAbilityMap: IInverseAbilityMap = {};

        let equipmentsPerSkillMap: { [skillId: number]: IEquipmentData[] } = {};

        let skillDataMap: ISkillDataMap = this.constructSkillDataMap(skills);

        for (let i: number = 0; i < equipments.length; i += 1) {
            let equipment: IEquipmentData = equipments[i];
            let equipmentSkills = equipment.skills;

            for (let j: number = 0; j < equipmentSkills.length; j += 1) {
                let equipmentSkill: IEquipmentSkillData = equipmentSkills[j];
                let skillData: ISkillData|undefined = skillDataMap[equipmentSkill.id];

                if (!skillData) {
                    console.error(`Missing skill ${equipmentSkill.id} in data`);
                    return null;
                }

                let equipmentsPerSkill: IEquipmentData[] = equipmentsPerSkillMap[skillData.id];

                if (!equipmentsPerSkill) {
                    equipmentsPerSkill = [];
                    equipmentsPerSkillMap[skillData.id] = equipmentsPerSkill;
                }

                equipmentsPerSkill.push(equipment);

                let skillLevels: ISkillLevelData[] = skillData.levels;

                for (let k: number = 0; k < skillLevels.length; k += 1) {
                    let skillLevel: number = skillLevels[k].level;
                    let abilityIds: number[] = skillLevels[k].abilityIds;

                    for (let m: number = 0; m < abilityIds.length; m += 1) {
                        let abilityId = abilityIds[m];

                        let inverseAbility: IInverseAbility = inverseAbilityMap[abilityId];

                        if (!inverseAbility) {
                            inverseAbility = {
                                id: abilityId,
                                conferredBySkills: {}
                            };
                            inverseAbilityMap[abilityId] = inverseAbility;
                        }

                        let skillIdLevelPair: string = `${skillData.id}:${skillLevel}`;
                        let conferredBySkill: IInverseSkillLevel = inverseAbility.conferredBySkills[skillIdLevelPair];

                        if (!conferredBySkill) {
                            conferredBySkill = {
                                skillId: skillData.id,
                                requiredPoints: skillLevel,
                                conferredByEquipments: equipmentsPerSkill
                            };
                            inverseAbility.conferredBySkills[skillIdLevelPair] = conferredBySkill;
                        }
                    }
                }
            }
        }

        if (!environment.production) {
            let test: string = JSON.stringify(inverseAbilityMap);
            console.log('test.length: ' + test.length);
        }

        let result: IInverseAbility[] = [];

        let key: string;
        for (key in inverseAbilityMap) {
            result.push(inverseAbilityMap[key]);
        }

        return result;
    }
}
