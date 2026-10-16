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

  it('should delegate appendData to native grid element', () => {
    const grid = component.gridRef().nativeElement;
    grid.appendData = vi.fn();

    const newItems = [{id: 1}, {id: 2}];
    component.appendData(newItems);
    expect(grid.appendData).toHaveBeenCalledWith(newItems);
  });

  it('should delegate removeDataFromHead to native grid element', () => {
    const grid = component.gridRef().nativeElement;
    grid.removeDataFromHead = vi.fn();

    component.removeDataFromHead(50);
    expect(grid.removeDataFromHead).toHaveBeenCalledWith(50);
  });

  it('should read rows from the native grid element', () => {
    const grid = component.gridRef().nativeElement;
    grid.rows = [{id: 1}, {id: 2}, {id: 3}];

    expect(component.rows).toEqual([{id: 1}, {id: 2}, {id: 3}]);
  });

  it('should read rowCount from the native grid element', () => {
    const grid = component.gridRef().nativeElement;
    Object.defineProperty(grid, 'rowCount', { value: 42, configurable: true });

    expect(component.rowCount).toBe(42);
  });

  it('should emit rangechange when the native grid dispatches a rangechange event', () => {
    const grid = component.gridRef().nativeElement;
    const spy = vi.fn();
    component.rangechange.subscribe(spy);

    const event = {
      buffered: {startRow: 0, endRow: 10, startCol: 0, endCol: 0},
      viewport: {startRow: 0, endRow: 5, startCol: 0, endCol: 0},
    };
    grid.dispatchEvent(Object.assign(new Event('rangechange'), event));

    expect(spy).toHaveBeenCalled();
  });
});
