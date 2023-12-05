import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdropGridComponent } from './backdrop-grid.component';

describe('BackdropGridComponent', () => {
  let component: BackdropGridComponent;
  let fixture: ComponentFixture<BackdropGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackdropGridComponent]
    });
    fixture = TestBed.createComponent(BackdropGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
