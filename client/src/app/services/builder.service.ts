import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LocalizationService } from './localization.service';
import { Equipment, IEquipmentData, IEquipmentSkillData, EquipmentType, IEquipmentLocale } from '../models/equipment';
import { ISkillData, Skill, ISkillLevelData, SkillLevel, ISkillLocale, ScoredSkill } from '../models/skill';
import { Ability } from '../models/ability';
import { ArmorSet } from '../models/armorSet';

@Injectable()
export class BuilderService {

    constructor(
        private dataService: DataService,
        private localizationService: LocalizationService
    ) {
    }

    public async constructEquipement(id: number): Promise<Equipment|null> {

        let equipmentData: IEquipmentData|null = await this.dataService.findEquipmentById(id);

        if (!equipmentData) {
            console.error(`dataService.findEquipmentById(${id}) method failed`);
            return null;
        }

        let equipmentLocale: IEquipmentLocale|null = await this.localizationService.getEquipmentLocale(id);

        if (!equipmentLocale) {
            console.error(`localizationService.getEquipmentLocale(${id}) method failed`);
            return null;
        }

        let equipmentSkillData: IEquipmentSkillData[] = equipmentData.skills;
        let skills: ScoredSkill[] = [];

        for (let i: number = 0; i < equipmentSkillData.length; i += 1) {

            let skillData: ISkillData|null = await this.dataService.findSkillById(equipmentSkillData[i].id);

            if (!skillData) {
                console.error(`dataService.findSkillById(${equipmentSkillData[i].id}) method failed`);
                return null;
            }

            let skillLocale: ISkillLocale|null = await this.localizationService.getSkillLocale(skillData.id);

            if (!skillLocale) {
                console.error(`localizationService.getSkillLocale(${skillData.id}) method failed`);
                return null;
            }

            let levels: ISkillLevelData[] = skillData.levels;

            if (!levels) {
                console.error('Invalid skills data');
                return null;
            }

            let skillLevels: SkillLevel[] = [];

            for (let j: number = 0; j < levels.length; j += 1) {

                let levelData: ISkillLevelData = levels[j];
                let abilityIds: number[] = levelData.abilityIds;
                let abilities: Ability[] = [];

                for (let k: number = 0; k < abilityIds.length; k += 1) {

                    let abilityId: number = abilityIds[k];
                    let abilitText: string|null = await this.localizationService.getAbilityText(abilityId);

                    if (!abilitText) {
                        console.error(`localizationService.getAbilityText(${abilityId}) method failed`);
                        return null;
                    }

                    abilities.push(new Ability(abilityId, abilitText));
                }

                skillLevels.push(new SkillLevel(levelData.level, abilities));
            }

            skills.push(
                new ScoredSkill(
                    equipmentSkillData[i].score,
                    new Skill(
                        skillData.id,
                        skillLocale.name,
                        skillLocale.description,
                        skillLevels
                    )
                )
            );
        }

        return new Equipment(
            id,
            equipmentLocale.name,
            equipmentLocale.description,
            equipmentData.rarity,
            equipmentData.type,
            skills);
    }

    public async constructArmorSet(...equipmentIds: number[]): Promise<ArmorSet|null> {

        let equipments: Equipment[] = [];

        for (let i: number = 0; i < equipmentIds.length; i += 1) {

            let equipment: Equipment|null = await this.constructEquipement(equipmentIds[i]);

            if (!equipment) {
                console.error('constructEquipement method failed');
                return null;
            }

            equipments.push(equipment);
        }

        if (this.validateEquipments(equipments) === false) {
            console.error('validateEquipments method failed');
            return null;
        }

        let skillPoints: { [key: string]: ISkillPointContainer } = {};

        for (let i: number = 0; i < equipments.length; i += 1) {

            let equipement: Equipment = equipments[i];
            let skills: ScoredSkill[] = equipement.skills

            for (let j: number = 0; j < skills.length; j += 1) {

                let skillIdStr: string = skills[j].skill.id.toString();
                let score: number = skills[j].score;

                if (skillPoints[skillIdStr] === undefined) {
                    skillPoints[skillIdStr] = { totalScore: score, scoredSkill: skills[j] };
                } else {
                    skillPoints[skillIdStr].totalScore += score;
                }
            }
        }

        let equippedSkills: ScoredSkill[] = [];

        let key: string;
        for (key in skillPoints) {

            let container: ISkillPointContainer = skillPoints[key];
            let skill: Skill = container.scoredSkill.skill;
            let skillHighestLevel: number = skill.findHighestLevel();
            let isOverSkilled: boolean = false;

            if (skillHighestLevel > -1 && container.totalScore > skillHighestLevel) {
                isOverSkilled = true;
            }

            equippedSkills.push(
                new ScoredSkill(
                    container.totalScore,
                    container.scoredSkill.skill
                )
            );
        }

        return new ArmorSet(equipments, equippedSkills);
    }

    private validateEquipments(equipments: Equipment[]): boolean {

        let helmCount: number = 0;
        let armorCount: number = 0;
        let glovesCount: number = 0;
        let tassetsCount: number = 0;
        let leggingsCount: number = 0;
        let necklessCount: number = 0;
        let survivalCount: number = 0;

        for (let i: number = 0; i < equipments.length; i += 1) {
            switch (equipments[i].type) {
                case EquipmentType.Helm:
                    helmCount += 1;
                    break;
                case EquipmentType.Armor:
                    armorCount += 1;
                    break;
                case EquipmentType.Gloves:
                    glovesCount += 1;
                    break;
                case EquipmentType.Tassets:
                    tassetsCount += 1;
                    break;
                case EquipmentType.Leggings:
                    leggingsCount += 1;
                    break;
                case EquipmentType.Neckless:
                    necklessCount += 1;
                    break;
                case EquipmentType.Survival:
                    survivalCount += 1;
                    break;
            }
        }

        if (helmCount > 1) {
            console.error('At most one helm is allowed');
            return false;
        }

        if (armorCount > 1) {
            console.error('At most one armor is allowed');
            return false;
        }

        if (glovesCount > 1) {
            console.error('At most one gloves pair is allowed');
            return false;
        }

        if (tassetsCount > 1) {
            console.error('At most one tassets pair is allowed');
            return false;
        }

        if (leggingsCount > 1) {
            console.error('At most one leggings pair is allowed');
            return false;
        }

        if (necklessCount > 1) {
            console.error('At most one neckless is allowed');
            return false;
        }

        if (survivalCount > 2) {
            console.error('At most two survival tools are allowed');
            return false;
        }

        return true;
    }
}

interface ISkillPointContainer {
    totalScore: number;
    scoredSkill: ScoredSkill;
}