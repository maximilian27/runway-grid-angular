import { TestBed } from '@angular/core/testing';
import { RunwayVerticalListExampleComponent } from './runway-vertical-list';

describe('RunwayVerticalListExampleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayVerticalListExampleComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RunwayVerticalListExampleComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
