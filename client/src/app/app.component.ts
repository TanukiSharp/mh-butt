import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { LocalizationService } from './services/localization.service';
import { BuilderService } from './services/builder.service';
import { ArmorSet } from './models/armorSet';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ DataService, LocalizationService, BuilderService ]
})
export class AppComponent implements OnInit {

    title = 'app';

    public constructor(
        private dataService: DataService,
        private localizationService: LocalizationService,
        private builderService: BuilderService
    ) {
    }

    async ngOnInit() {

        if (await this.localizationService.loadLocalization('en') === false) {
            console.error('localizationService.loadLocalization(\'en\') failed');
            return;
        }

        let armorSet: ArmorSet|null = await this.builderService.constructArmorSet(7, 38, 19, 10, 16, 1);

        if (armorSet === null) {
            console.error('builderService.constructArmorSet(...) failed');
            return;
        }

        console.log('armorSet: ', armorSet);
    }
}
