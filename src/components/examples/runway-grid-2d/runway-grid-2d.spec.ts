import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayGrid2dExampleComponent } from './runway-grid-2d';

describe('RunwayGrid2dExampleComponent', () => {
  let component: RunwayGrid2dExampleComponent;
  let fixture: ComponentFixture<RunwayGrid2dExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayGrid2dExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayGrid2dExampleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the 2 navigation buttons (top-left, bottom-right)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const topLeftBtn = compiled.querySelector('#grid-top-left-btn') as HTMLButtonElement;
    const bottomRightBtn = compiled.querySelector('#grid-bottom-right-btn') as HTMLButtonElement;

    expect(topLeftBtn).toBeTruthy();
    expect(topLeftBtn.textContent).toContain('Top-Left');
    expect(bottomRightBtn).toBeTruthy();
    expect(bottomRightBtn.textContent).toContain('Bottom-Right');
  });

  it('should call scrollToCell(0, 0) when Top-Left button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    const compiled = fixture.nativeElement as HTMLElement;
    const topLeftBtn = compiled.querySelector('#grid-top-left-btn') as HTMLButtonElement;
    topLeftBtn.click();

    expect(spy).toHaveBeenCalledWith(0, 0);
  });

  it('should call scrollToCell(rowCount - 1, colCount - 1) when Bottom-Right button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    const compiled = fixture.nativeElement as HTMLElement;
    const bottomRightBtn = compiled.querySelector('#grid-bottom-right-btn') as HTMLButtonElement;
    bottomRightBtn.click();

    expect(spy).toHaveBeenCalledWith(component.rowCount - 1, component.colCount - 1);
  });

  it('should scroll to the top-left cell when scrollToTopLeft method is called directly', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    component.scrollToTopLeft();
    expect(spy).toHaveBeenCalledWith(0, 0);
  });
});
