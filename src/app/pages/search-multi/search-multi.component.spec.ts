import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMultiComponent } from './search-multi.component';

describe('SearchMultiComponent', () => {
  let component: SearchMultiComponent;
  let fixture: ComponentFixture<SearchMultiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchMultiComponent]
    });
    fixture = TestBed.createComponent(SearchMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
