import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayHorizontalListExampleComponent } from './runway-horizontal-list';

describe('RunwayHorizontalListExampleComponent', () => {
  let component: RunwayHorizontalListExampleComponent;
  let fixture: ComponentFixture<RunwayHorizontalListExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayHorizontalListExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayHorizontalListExampleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the index input and 3 navigation buttons (start, end, jump to index)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('#h-index-input') as HTMLInputElement;
    const jumpBtn = compiled.querySelector('#h-jump-btn') as HTMLButtonElement;
    const startBtn = compiled.querySelector('#h-start-btn') as HTMLButtonElement;
    const endBtn = compiled.querySelector('#h-end-btn') as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(input.type).toBe('number');
    expect(jumpBtn).toBeTruthy();
    expect(jumpBtn.textContent).toContain('Jump to Index');
    expect(startBtn).toBeTruthy();
    expect(startBtn.textContent).toContain('Start');
    expect(endBtn).toBeTruthy();
    expect(endBtn.textContent).toContain('End');
  });

  it('should call scrollToCell(0, 0) when Start button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    const compiled = fixture.nativeElement as HTMLElement;
    const startBtn = compiled.querySelector('#h-start-btn') as HTMLButtonElement;
    startBtn.click();

    expect(spy).toHaveBeenCalledWith(0, 0);
  });

  it('should call scrollToCell(0, columnCount - 1) when End button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    const compiled = fixture.nativeElement as HTMLElement;
    const endBtn = compiled.querySelector('#h-end-btn') as HTMLButtonElement;
    endBtn.click();

    expect(spy).toHaveBeenCalledWith(0, component.columnCount - 1);
  });

  it('should call scrollToCell with input value when Jump to Index button is clicked', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    component.targetIndex = 1234;
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const jumpBtn = compiled.querySelector('#h-jump-btn') as HTMLButtonElement;
    jumpBtn.click();

    expect(spy).toHaveBeenCalledWith(0, 1234);
  });

  it('should scroll to specified index when jumpToIndex method is called directly', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToCell');

    component.jumpToIndex(42);
    expect(spy).toHaveBeenCalledWith(0, 42);
  });
});
