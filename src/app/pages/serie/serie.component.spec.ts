import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieComponent } from './serie.component';

describe('SerieComponent', () => {
  let component: SerieComponent;
  let fixture: ComponentFixture<SerieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieComponent]
    });
    fixture = TestBed.createComponent(SerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
