import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayWrapper } from './runway-wrapper';

describe('RunwayWrapper', () => {
  let component: RunwayWrapper;
  let fixture: ComponentFixture<RunwayWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayWrapper],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
