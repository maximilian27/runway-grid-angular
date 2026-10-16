import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  RunwaySlidingVerticalExampleComponent,
  SLIDING_MAX_ROWS,
  SLIDING_PAGE_SIZE,
} from './runway-sliding-vertical';

// The component's simulated fetch resolves after a 400ms setTimeout - wait slightly
// longer than that (with real timers) rather than faking time, since Angular's own
// `whenStable()`/`afterNextRender` scheduling does not play well with fake timers.
const FETCH_DELAY_MS = 450;

describe('RunwaySlidingVerticalExampleComponent', () => {
  let component: RunwaySlidingVerticalExampleComponent;
  let fixture: ComponentFixture<RunwaySlidingVerticalExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunwaySlidingVerticalExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunwaySlidingVerticalExampleComponent);
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
    const status = compiled.shadowRoot?.querySelector('#sliding-status') as HTMLElement;

    expect(status).toBeTruthy();
  });

  it('should generate correct bodyText and titleHue values', () => {
    expect(component.bodyText(1)).toBe('Simulated content fetched from the server. ');
    expect(component.bodyText(3)).toBe('Simulated content fetched from the server. '.repeat(3));
    expect(component.titleHue(0)).toBe(0);
    expect(component.titleHue(10)).toBe((10 * 47) % 360);
  });

  it('should format statusText correctly when fetching and when idle', () => {
    component.loadedItems.set([]);
    component.totalFetched.set(0);
    component.isFetching.set(false);
    expect(component.statusText()).toBe('Loaded 0 items');

    component.isFetching.set(true);
    expect(component.statusText()).toBe(
      `Loaded 0 of max ${SLIDING_MAX_ROWS} items (0 fetched total) - fetching more…`
    );

    component.isFetching.set(false);
    component.loadedItems.set(Array.from({ length: 100 }, (_, i) => ({ index: i, lines: 1 })));
    component.totalFetched.set(100);
    expect(component.statusText()).toBe(
      `Loaded 100 of max ${SLIDING_MAX_ROWS} items (100 fetched total)`
    );
  });

  it('should load the first page via appendData once the initial fetch resolves', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();
    const spy = vi.spyOn(wrapper!, 'appendData');

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toHaveLength(SLIDING_PAGE_SIZE);
    expect(component.loadedCount()).toBe(SLIDING_PAGE_SIZE);
    expect(component.totalFetched()).toBe(SLIDING_PAGE_SIZE);
    expect(component.statusText()).toContain(`Loaded ${SLIDING_PAGE_SIZE} of max ${SLIDING_MAX_ROWS} items`);
  }, 10000);

  it('should fetch another page when the buffered range nears the end of loaded data', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    const spy = vi.spyOn(wrapper!, 'appendData');

    // First page gave 100 rows; threshold is 30, so endRow >= 70 triggers fetch
    component.onRangeChange({
      buffered: { startRow: 0, endRow: 75, startCol: 0, endCol: 0 },
      viewport: { startRow: 0, endRow: 20, startCol: 0, endCol: 0 },
    } as any);

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadedCount()).toBe(SLIDING_PAGE_SIZE * 2);
    expect(component.totalFetched()).toBe(SLIDING_PAGE_SIZE * 2);
  }, 10000);

  it('should not fetch another page when the buffered range is far from the loaded end', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    const spy = vi.spyOn(wrapper!, 'appendData');

    component.onRangeChange({
      buffered: { startRow: 0, endRow: 20, startCol: 0, endCol: 0 },
      viewport: { startRow: 0, endRow: 10, startCol: 0, endCol: 0 },
    } as any);

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    expect(spy).not.toHaveBeenCalled();
  }, 10000);

  it('should prune oldest rows via removeDataFromHead when row count exceeds SLIDING_MAX_ROWS', async () => {
    const wrapper = component.runwayWrapper();
    expect(wrapper).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
    await fixture.whenStable();

    // Fill loadedItems up to SLIDING_MAX_ROWS to test pruning on next page
    const dummyRows = Array.from({ length: SLIDING_MAX_ROWS }, (_, i) => ({
      index: i,
      lines: 1,
    }));
    component.loadedItems.set(dummyRows);
    component.totalFetched.set(SLIDING_MAX_ROWS);

    const appendSpy = vi.spyOn(wrapper!, 'appendData');
    const removeSpy = vi.spyOn(wrapper!, 'removeDataFromHead');

    // Trigger loading another page
    await component.loadMoreData();
    await fixture.whenStable();

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith(SLIDING_PAGE_SIZE);
    expect(component.loadedCount()).toBe(SLIDING_MAX_ROWS);
    expect(component.totalFetched()).toBe(SLIDING_MAX_ROWS + SLIDING_PAGE_SIZE);
    expect(component.statusText()).toBe(
      `Loaded ${SLIDING_MAX_ROWS} of max ${SLIDING_MAX_ROWS} items (${SLIDING_MAX_ROWS + SLIDING_PAGE_SIZE} fetched total)`
    );
  }, 10000);
});
