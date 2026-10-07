import {Component} from '@angular/core';
import {RunwayWrapperComponent} from "../components/runway-wrapper/runway-wrapper";

interface DemoItem {
  id: number;
  title: string;
  category: string;
  details?: string;
  isExpandable: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RunwayWrapperComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class AppComponent {
  massiveDataset: DemoItem[] = Array.from({length: 100000}).map((_, i) => {
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
}