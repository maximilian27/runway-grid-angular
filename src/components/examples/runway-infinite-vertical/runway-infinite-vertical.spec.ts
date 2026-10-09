import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunwayInfiniteVerticalExampleComponent } from './runway-infinite-vertical';

// The component's simulated fetch resolves after a 400ms setTimeout - wait slightly
// longer than that (with real timers) rather than faking time, since Angular's own
// `whenStable()`/`afterNextRender` scheduling does not play well with fake timers.
const FETCH_DELAY_MS = 450;

describe('RunwayInfiniteVerticalExampleComponent', () => {
  let component: RunwayInfiniteVerticalExampleComponent;
  let fixture: ComponentFixture<RunwayInfiniteVerticalExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwayInfiniteVerticalExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwayInfiniteVerticalExampleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the status text element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // `ViewEncapsulation.ShadowDom` renders this component's content into its own native
    // shadow root, which plain `querySelector` on the host element cannot see into.
    const status = compiled.shadowRoot?.querySelector('#infinite-status') as HTMLElement;

    expect(status).toBeTruthy();
  });

  it('should load the first page via appendData once the initial fetch resolves', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'appendData');

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toHaveLength(40);
    expect(component.loadedCount()).toBe(40);
  }, 10000);

  it('should fetch another page when the buffered range nears the end of loaded data', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    const spy = vi.spyOn(wrapper!, 'appendData');

    component.onRangeChange({
      buffered: { startRow: 0, endRow: 30, startCol: 0, endCol: 0 },
      viewport: { startRow: 0, endRow: 10, startCol: 0, endCol: 0 },
    } as any);

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadedCount()).toBe(80);
  }, 10000);

  it('should not fetch another page when the buffered range is far from the loaded end', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    const spy = vi.spyOn(wrapper!, 'appendData');

    component.onRangeChange({
      buffered: { startRow: 0, endRow: 5, startCol: 0, endCol: 0 },
      viewport: { startRow: 0, endRow: 3, startCol: 0, endCol: 0 },
    } as any);

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).not.toHaveBeenCalled();
  }, 10000);
});
