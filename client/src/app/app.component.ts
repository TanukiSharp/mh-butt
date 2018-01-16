import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { LocalizationService } from './services/localization.service';
import { BuilderService } from './services/builder.service';
import { ArmorSet } from './models/armorSet';
import { DetailedScoredSkill, ScoreUtils, IScores } from './models/skill';
import { Equipment, EquipmentType } from './models/equipment';
import { InversearchService, IInverseAbility } from './services/inversearch.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ DataService, LocalizationService, BuilderService, InversearchService ]
})
export class AppComponent implements OnInit {

    public title: string = 'app';

    public armorSet: ArmorSet;

    public constructor(
        private dataService: DataService,
        private localizationService: LocalizationService,
        private builderService: BuilderService,
        private inversearchService: InversearchService
    ) {
    }

    async ngOnInit() {

        if (await this.localizationService.loadLocalization('en') === false) {
            console.error('localizationService.loadLocalization(\'en\') failed');
            return;
        }

        //await this.testSingleEquipmentCreation();
        //await this.testArmorSetCreation();
        await this.testInserseSearchMapCreation();
    }

    private async testInserseSearchMapCreation() {

        let inverseAbilityMap: IInverseAbility[]|null = await this.inversearchService.getAbilities();

        if (!inverseAbilityMap) {
            console.error('Failed to create inverse search map');
            return;
        }

        console.log('inverseAbilityMap: ', inverseAbilityMap);
    }

    private async testArmorSetCreation() {

        let armorSet: ArmorSet|null = null;

        armorSet = await this.builderService.constructArmorSet(7, 38, 19, 10, 16, 1);

        if (armorSet === null) {
            console.error('builderService.constructArmorSet(...) failed');
            return;
        }

        this.armorSet = armorSet;
        console.log('armorSet: ', armorSet);
    }

    private async testSingleEquipmentCreation() {

        let armorSet: ArmorSet|null = null;

        let equipment: Equipment|null = await this.builderService.constructEquipement(1);
        if (equipment !== null) {
            armorSet = new ArmorSet(
                [],
                [ DetailedScoredSkill.constructFromSkill(EquipmentType.Talisman, equipment.skills[0]) ]
            );
        }

        if (armorSet === null) {
            console.error('builderService.constructArmorSet(...) failed');
            return;
        }

        this.armorSet = armorSet;
        console.log('armorSet: ', armorSet);
    }
}
