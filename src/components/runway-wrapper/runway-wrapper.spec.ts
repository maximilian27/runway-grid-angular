import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayWrapperComponent } from './runway-wrapper';

describe('RunwayWrapperComponent', () => {
  let component: RunwayWrapperComponent;
  let fixture: ComponentFixture<RunwayWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayWrapperComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate scrollToIndex to native grid element', () => {
    const grid = component.gridRef().nativeElement;
    grid.scrollToIndex = vi.fn();

    component.scrollToIndex(100);
    expect(grid.scrollToIndex).toHaveBeenCalledWith(100);
  });

  it('should delegate scrollToCell to native grid element', () => {
    const grid = component.gridRef().nativeElement;
    grid.scrollToCell = vi.fn();

    component.scrollToCell(10, 2);
    expect(grid.scrollToCell).toHaveBeenCalledWith(10, 2);
  });
});
