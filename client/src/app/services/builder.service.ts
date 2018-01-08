import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { LocalizationService } from './localization.service';
import { Equipment, IEquipmentData, IEquipmentSkillData, EquipmentType, IEquipmentLocale } from '../models/equipment';
import { ISkillData, Skill, ISkillLevelData, SkillLevel, ISkillLocale, ScoredSkill, DetailedScoredSkill, IScores } from '../models/skill';
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

                let skillPointContainer: ISkillPointContainer = skillPoints[skillIdStr];

                if (skillPointContainer === undefined) {
                    let scores = { weapon: 0, helm: 0, armor: 0, gloves: 0, tassets: 0, leggings: 0, talisman: 0, total: 0 };
                    skillPointContainer = { scores: scores, scoredSkill: skills[j] };
                    skillPoints[skillIdStr] = skillPointContainer;
                }

                switch (equipement.type) {
                    case EquipmentType.Weapon:
                        skillPointContainer.scores.weapon += 1;
                        break;
                    case EquipmentType.Helm:
                        skillPointContainer.scores.helm += 1;
                        break;
                    case EquipmentType.Armor:
                        skillPointContainer.scores.armor += 1;
                        break;
                    case EquipmentType.Gloves:
                        skillPointContainer.scores.gloves += 1;
                        break;
                    case EquipmentType.Tassets:
                        skillPointContainer.scores.tassets += 1;
                        break;
                    case EquipmentType.Leggings:
                        skillPointContainer.scores.leggings += 1;
                        break;
                    case EquipmentType.Talisman:
                        skillPointContainer.scores.talisman += 1;
                        break;
                }

                skillPointContainer.scores.total += 1;
            }
        }

        let equippedSkills: DetailedScoredSkill[] = [];

        let key: string;
        for (key in skillPoints) {

            let container: ISkillPointContainer = skillPoints[key];

            equippedSkills.push(
                new DetailedScoredSkill(
                    container.scores,
                    container.scoredSkill.skill
                )
            );
        }

        return new ArmorSet(equipments, equippedSkills);
    }

    private validateEquipments(equipments: Equipment[]): boolean {

        let weaponCount: number = 0;
        let helmCount: number = 0;
        let armorCount: number = 0;
        let glovesCount: number = 0;
        let tassetsCount: number = 0;
        let leggingsCount: number = 0;
        let necklessCount: number = 0;

        for (let i: number = 0; i < equipments.length; i += 1) {
            switch (equipments[i].type) {
                case EquipmentType.Weapon:
                    weaponCount += 1;
                    break;
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
                case EquipmentType.Talisman:
                    necklessCount += 1;
                    break;
            }
        }

        // if (weaponCount < 1) {
        //     console.error('A weapon is mandatory');
        //     return false;
        // } else if (weaponCount > 1) {
        //     console.error(`Only one weapon is allowed (got ${weaponCount})`);
        //     return false;
        // }

        if (helmCount > 1) {
            console.error(`At most one helm is allowed (got ${helmCount})`);
            return false;
        }

        if (armorCount > 1) {
            console.error(`At most one armor is allowed (got ${armorCount})`);
            return false;
        }

        if (glovesCount > 1) {
            console.error(`At most one gloves pair is allowed (got ${glovesCount})`);
            return false;
        }

        if (tassetsCount > 1) {
            console.error(`At most one tassets pair is allowed (got ${tassetsCount})`);
            return false;
        }

        if (leggingsCount > 1) {
            console.error(`At most one leggings pair is allowed (got ${leggingsCount})`);
            return false;
        }

        if (necklessCount > 1) {
            console.error(`At most one neckless is allowed (got ${necklessCount})`);
            return false;
        }

        return true;
    }
}

interface ISkillPointContainer {
    scores: IScores;
    scoredSkill: ScoredSkill;
}
