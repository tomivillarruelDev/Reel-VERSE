import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterGridComponent } from './poster-grid.component';

describe('PosterGridComponent', () => {
  let component: PosterGridComponent;
  let fixture: ComponentFixture<PosterGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosterGridComponent]
    });
    fixture = TestBed.createComponent(PosterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
