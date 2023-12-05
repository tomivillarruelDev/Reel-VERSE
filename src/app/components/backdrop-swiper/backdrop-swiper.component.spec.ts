import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdropSwiperComponent } from './backdrop-swiper.component';

describe('BackdropSwiperComponent', () => {
  let component: BackdropSwiperComponent;
  let fixture: ComponentFixture<BackdropSwiperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackdropSwiperComponent]
    });
    fixture = TestBed.createComponent(BackdropSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
