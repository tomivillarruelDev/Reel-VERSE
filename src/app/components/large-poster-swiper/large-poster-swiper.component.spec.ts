import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargePosterSwiperComponent } from './large-poster-swiper.component';

describe('LargePosterSwiperComponent', () => {
  let component: LargePosterSwiperComponent;
  let fixture: ComponentFixture<LargePosterSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LargePosterSwiperComponent]
    });
    fixture = TestBed.createComponent(LargePosterSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
