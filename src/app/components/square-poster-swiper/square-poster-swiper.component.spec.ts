import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarePosterSwiperComponent } from './square-poster-swiper.component';

describe('SquarePosterComponent', () => {
  let component: SquarePosterSwiperComponent;
  let fixture: ComponentFixture<SquarePosterSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquarePosterSwiperComponent]
    });
    fixture = TestBed.createComponent(SquarePosterSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
