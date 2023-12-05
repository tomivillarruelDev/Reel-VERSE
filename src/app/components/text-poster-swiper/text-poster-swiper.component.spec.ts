import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextPosterSwiperComponent } from './text-poster-swiper.component';

describe('TextPosterSwiperComponent', () => {
  let component: TextPosterSwiperComponent;
  let fixture: ComponentFixture<TextPosterSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextPosterSwiperComponent]
    });
    fixture = TestBed.createComponent(TextPosterSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
