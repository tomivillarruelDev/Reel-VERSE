import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterSwiperComponent } from './poster-swiper.component';

describe('PosterSwiperComponent', () => {
  let component: PosterSwiperComponent;
  let fixture: ComponentFixture<PosterSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosterSwiperComponent]
    });
    fixture = TestBed.createComponent(PosterSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
