import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentPickerComponent } from './equipment-picker.component';

describe('EquipmentPickerComponent', () => {
  let component: EquipmentPickerComponent;
  let fixture: ComponentFixture<EquipmentPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
