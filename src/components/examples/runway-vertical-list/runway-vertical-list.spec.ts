import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayVerticalListExampleComponent } from './runway-vertical-list';

describe('RunwayVerticalListExampleComponent', () => {
  let component: RunwayVerticalListExampleComponent;
  let fixture: ComponentFixture<RunwayVerticalListExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayVerticalListExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayVerticalListExampleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the index input and 3 navigation buttons (top, bottom, jump to index)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('#index-input') as HTMLInputElement;
    const jumpBtn = compiled.querySelector('#jump-btn') as HTMLButtonElement;
    const startBtn = compiled.querySelector('#start-btn') as HTMLButtonElement;
    const endBtn = compiled.querySelector('#end-btn') as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(input.type).toBe('number');
    expect(jumpBtn).toBeTruthy();
    expect(jumpBtn.textContent).toContain('Jump to Index');
    expect(startBtn).toBeTruthy();
    expect(startBtn.textContent).toContain('Top');
    expect(endBtn).toBeTruthy();
    expect(endBtn.textContent).toContain('Bottom');
  });

  it('should call scrollToIndex(0) when Top button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToIndex');

    const compiled = fixture.nativeElement as HTMLElement;
    const startBtn = compiled.querySelector('#start-btn') as HTMLButtonElement;
    startBtn.click();

    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should call scrollToIndex(length - 1) when Bottom button is clicked', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToIndex');

    const compiled = fixture.nativeElement as HTMLElement;
    const endBtn = compiled.querySelector('#end-btn') as HTMLButtonElement;
    endBtn.click();

    expect(spy).toHaveBeenCalledWith(component.massiveDataset.length - 1);
  });

  it('should call scrollToIndex with input value when Jump to Index button is clicked', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToIndex');

    component.targetIndex = 1234;
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const jumpBtn = compiled.querySelector('#jump-btn') as HTMLButtonElement;
    jumpBtn.click();

    expect(spy).toHaveBeenCalledWith(1234);
  });

  it('should scroll to specified index when jumpToIndex method is called directly', () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'scrollToIndex');

    component.jumpToIndex(42);
    expect(spy).toHaveBeenCalledWith(42);
  });
});
