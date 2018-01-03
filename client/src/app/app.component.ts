import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { LocalizationService } from './services/localization.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ DataService, LocalizationService ]
})
export class AppComponent {
    title = 'app';

    public constructor(
        private dataService: DataService,
        private localizationService: LocalizationService
    ) {
        console.log(dataService);
        console.log(localizationService);
    }
}
