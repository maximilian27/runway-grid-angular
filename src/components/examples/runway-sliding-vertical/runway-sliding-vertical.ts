import {afterNextRender, Component, computed, signal, viewChild, ViewEncapsulation} from '@angular/core';
import type {RangeChangeEvent} from 'runway-grid';
import {RunwayWrapperComponent} from '../../runway-wrapper/runway-wrapper';

export interface SlidingRow {
  index: number;
  lines: number;
}

// Number of rows fetched per simulated "page".
export const SLIDING_PAGE_SIZE = 100;
// Hard cap on how many rows may be loaded at once - once exceeded, the oldest rows are
// pruned from the head so the array (and WASM vectors) never grow past this size.
export const SLIDING_MAX_ROWS = 1000;
// How many rows of runway may still be left in the buffered range before the next page
// is requested, same idea as the plain infinite-scroll example's threshold.
export const SLIDING_FETCH_THRESHOLD = 30;

@Component({
  selector: 'app-runway-sliding-vertical-example, app-runway-sliding-window-vertical-example',
  imports: [RunwayWrapperComponent],
  templateUrl: './runway-sliding-vertical.html',
  styleUrls: ['./runway-sliding-vertical.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RunwaySlidingVerticalExampleComponent {
  // the oldest items from the head once exceeded.
  protected readonly loadedItems = signal<SlidingRow[]>([]);
  private readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);
  // The actual rows currently loaded in memory - capped at SLIDING_MAX_ROWS by dropping
  private readonly loadedCount = computed(() => this.loadedItems().length);
  // every row still gets a unique, ever-increasing absolute index) and to display progress.
  private readonly totalFetched = signal(0);

  // Total rows ever fetched from the "server" - keeps growing forever, even though the
  // loaded items array itself is capped at SLIDING_MAX_ROWS. Used as the fetch offset (so
  private readonly isFetching = signal(false);
  protected readonly statusText = computed(() => {
    const count = this.loadedCount();
    const total = this.totalFetched();
    const suffix = this.isFetching() ? ' - fetching more…' : '';
    if (count === 0 && total === 0 && !this.isFetching()) {
      return 'Loaded 0 items';
    }
    return `Loaded ${count} of max ${SLIDING_MAX_ROWS} items (${total} fetched total)${suffix}`;
  });
  private fetching = false;

  constructor() {
    // Kick off with the first page once the view (and the wrapper's native grid) is ready.
    afterNextRender(() => void this.loadMoreData());
  }

  // just now paired with head-pruning so the loaded set never grows past SLIDING_MAX_ROWS.
  protected onRangeChange(event: RangeChangeEvent): void {
    const totalRows = this.runwayWrapper()?.rows.length || this.loadedItems().length;
    if (event.buffered.endRow >= totalRows - SLIDING_FETCH_THRESHOLD) {
      void this.loadMoreData();
    }
  }

  // Fetches the next page, appends it via appendData(), then immediately prunes the head
  // if the cap was exceeded. Both steps happen before status updates read back counts,

  protected bodyText(lines: number): string {
    return 'Simulated content fetched from the server. '.repeat(lines);
  }

  // Fetch the next page as soon as the *buffered* (off-screen) range gets close to the
  // end of what's currently loaded - same trigger as the plain infinite-scroll example,

  protected titleHue(index: number): number {
    return (index * 47) % 360;
  }

  // Simulates a paginated backend endpoint, same shape as the infinite-scroll example's.
  private fetchSlidingPage(offset: number, limit: number): Promise<SlidingRow[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const page = Array.from({length: limit}, (_, i) => {
          const index = offset + i;
          return {index, lines: 1 + (index % 4)}; // 1-4 lines of body text -> variable height
        });
        resolve(page);
      }, 400);
    });
  }

  // so the displayed count is always the post-prune, capped size.
  private async loadMoreData(): Promise<void> {
    if (this.fetching) return;
    this.fetching = true;
    this.isFetching.set(true);

    const page = await this.fetchSlidingPage(this.totalFetched(), SLIDING_PAGE_SIZE);
    this.totalFetched.update(total => total + page.length);

    this.fetching = false;
    this.isFetching.set(false);

    const wrapper = this.runwayWrapper();
    wrapper?.appendData(page);

    const currentLoaded = [...this.loadedItems(), ...page];
    // Immediately after appending, cap the array at SLIDING_MAX_ROWS by dropping the
    // oldest rows from the top - removeDataFromHead() counter-scrolls the viewport by the
    // exact pixel height removed, so this is completely invisible to the user.
    const rowCount = Math.max(wrapper?.rowCount ?? 0, currentLoaded.length);
    if (rowCount > SLIDING_MAX_ROWS) {
      const excess = rowCount - SLIDING_MAX_ROWS;
      wrapper?.removeDataFromHead(excess);
      this.loadedItems.set(currentLoaded.slice(excess));
    } else {
      this.loadedItems.set(currentLoaded);
    }
  }
}

