import { Component, viewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RunwayWrapperComponent } from '../../runway-wrapper/runway-wrapper';

interface DemoItem {
  id: number;
  title: string;
  category: string;
  details?: string;
  isExpandable: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-runway-vertical-list-example',
  imports: [RunwayWrapperComponent, FormsModule],
  templateUrl: './runway-vertical-list.html',
  styleUrls: ['./runway-vertical-list.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RunwayVerticalListExampleComponent {
  readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);

  targetIndex: number = 50000;

  massiveDataset: DemoItem[] = Array.from({ length: 100000 }).map((_, i) => {
    const isExpandable = i % 5 === 0;
    return {
      id: i,
      title: `Item #${i} - ${isExpandable ? 'Expandable Record' : 'Standard Record'}`,
      category: isExpandable ? 'High Priority' : 'Normal',
      details: isExpandable
        ? `Detailed metadata for Record #${i}. This extra content expands the DOM node naturally, testing RunwayGrid's automatic WASM spatial recalculation and ResizeObserver tracking.`
        : undefined,
      isExpandable,
      expanded: false
    };
  });

  toggleExpand(item: DemoItem, event: Event) {
    event.stopPropagation();
    item.expanded = !item.expanded;
  }

  jumpToIndex(index: number = this.targetIndex): void {
    const target = Number(index);
    if (!isNaN(target)) {
      this.runwayWrapper()?.scrollToIndex(target);
    }
  }

  scrollToTop(): void {
    this.runwayWrapper()?.scrollToIndex(0);
  }

  scrollToBottom(): void {
    this.runwayWrapper()?.scrollToIndex(this.massiveDataset.length - 1);
  }
}
