import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-equipment-picker',
    templateUrl: './equipment-picker.component.html',
    styleUrls: ['./equipment-picker.component.css']
})
export class EquipmentPickerComponent implements OnInit {

    constructor(private dataService: DataService) { }

    async ngOnInit() {

    }

}
