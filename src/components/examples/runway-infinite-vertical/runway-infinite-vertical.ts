import {afterNextRender, Component, computed, signal, viewChild, ViewEncapsulation} from '@angular/core';
import {RunwayWrapperComponent} from '../../runway-wrapper/runway-wrapper';
import type {RangeChangeEvent} from 'runway-grid';

interface InfiniteRow {
  index: number;
  lines: number;
}

// Number of rows fetched per simulated "page".
const INFINITE_PAGE_SIZE = 40;
// How many rows of runway may still be left in the buffered range before the next page
// is requested - large enough that the (simulated) network round-trip resolves and gets
// appended well before the user's viewport actually reaches the unloaded tail.
const INFINITE_FETCH_THRESHOLD = 15;

@Component({
  selector: 'app-runway-infinite-vertical-example',
  imports: [RunwayWrapperComponent],
  templateUrl: './runway-infinite-vertical.html',
  styleUrls: ['./runway-infinite-vertical.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RunwayInfiniteVerticalExampleComponent {
  readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);

  private fetching = false;

  // The actual rows loaded so far - bound to the wrapper's `items` input so the native
  // grid is always initialized/kept in sync with real data (not the wrapper's empty
  // default), rather than relying solely on imperative `appendData()` calls.
  readonly loadedItems = signal<InfiniteRow[]>([]);
  readonly loadedCount = computed(() => this.loadedItems().length);
  readonly isFetching = signal(false);
  readonly statusText = computed(() =>
      this.isFetching()
          ? `Loaded ${this.loadedCount()} items - fetching more…`
          : `Loaded ${this.loadedCount()} items`
  );

  constructor() {
    // Kick off the very first page once the view (and the wrapper's native grid) is ready.
    afterNextRender(() => void this.loadMoreData());
  }

  // Simulates a paginated backend endpoint: resolves after a short network-like delay with
  // a page of items whose rendered height will vary from row to row (variable line count).
  private fetchInfinitePage(offset: number, limit: number): Promise<InfiniteRow[]> {
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

  // Fetches the next page and appends it via the wrapper's `appendData()` - preserving the
  // current scroll position instead of resetting it like assigning `items` would. Also used
  // to load the very first page, since `appendData()` builds the registry on first use.
  async loadMoreData(): Promise<void> {
    if (this.fetching) return;
    this.fetching = true;
    this.isFetching.set(true);

    const page = await this.fetchInfinitePage(this.loadedItems().length, INFINITE_PAGE_SIZE);

    this.fetching = false;
    this.isFetching.set(false);
    this.loadedItems.update(rows => [...rows, ...page]);
    this.runwayWrapper()?.appendData(page);
  }

  // Fetches the next page as soon as the *buffered* (off-screen) range gets close to the
  // end of what's currently loaded - i.e. before the user actually hits the true bottom.
  onRangeChange(event: RangeChangeEvent): void {
    if (event.buffered.endRow >= this.loadedItems().length - INFINITE_FETCH_THRESHOLD) {
      void this.loadMoreData();
    }
  }

  bodyText(lines: number): string {
    return 'Simulated content fetched from the server. '.repeat(lines);
  }

  titleHue(index: number): number {
    return (index * 47) % 360;
  }
}
