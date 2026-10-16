import {
  afterNextRender,
  Component,
  contentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnInit,
  output,
  Signal,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import 'runway-grid'; // Instantiates the WASM engine and registers <runway-grid>
import type {RangeChangeEvent} from 'runway-grid';

@Component({
  selector: 'app-runway-wrapper',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './runway-wrapper.html',
  styleUrls: ['./runway-wrapper.scss'],
})

export class RunwayWrapperComponent implements OnInit {
  public items = input<any[]>([]);
  public orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');
  public rowSize = input<number>(40);
  public colSize = input<number>(100);
  public bufferSize = input<number>(10);
  // Column definitions (or a plain column count), for `orientation="horizontal"`/`"both"`.
  // Must be applied to the native element before `items`/`data`, mirroring the underlying
  // <runway-grid> API contract.
  public columns = input<readonly unknown[] | number | undefined>(undefined);

  public userTemplate = contentChild<TemplateRef<any>>(TemplateRef);
  public readonly gridRef: Signal<ElementRef> = viewChild.required<ElementRef>('grid');

  // Fired whenever the range of rendered rows/columns changes on the underlying grid - see
  // `RangeChangeEvent` for the `buffered`/`viewport` coordinates. Useful for driving
  // infinite-scroll data fetches before the user reaches the true end of the loaded data.
  public readonly rangechange = output<RangeChangeEvent>();

  constructor(private viewContainerRef: ViewContainerRef) {
    // Replaces the effect() hook: pushes data updates imperatively once rendered/updated
    afterNextRender(() => {
      const grid = this.gridRef()?.nativeElement;
      if (grid) {
        const columns = this.columns();
        if (columns !== undefined) {
          grid.columns = columns;
        }
        grid.data = this.items();
        grid.addEventListener('rangechange', (event: RangeChangeEvent) => this.rangechange.emit(event));
      }
    });
  }

  // The row data currently loaded on the underlying grid.
  public get rows(): readonly unknown[] {
    return this.gridRef()?.nativeElement?.rows ?? [];
  }

  // Number of rows currently known to the underlying grid.
  public get rowCount(): number {
    return this.gridRef()?.nativeElement?.rowCount ?? 0;
  }

  public ngOnInit() {
    this.gridRef().nativeElement.template = (
        item: any,
        rowIndex: number,
        colIndex: number,
        rowCount: number,
        colCount: number
    ) => {
      const container = document.createElement('div');
      container.setAttribute('part', 'cell-content');

      const templateRef = this.userTemplate();
      if (templateRef) {
        const embeddedView = this.viewContainerRef.createEmbeddedView(templateRef, {
          $implicit: item,
          index: rowIndex,
          col: colIndex,
          rowCount,
          colCount
        });
        embeddedView.detectChanges();

        embeddedView.rootNodes.forEach(node => container.appendChild(node));
      } else if (item) {
        container.textContent = String(item.title || JSON.stringify(item));
      }

      return container;
    };
  }

  public scrollToIndex(index: number): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.scrollToIndex === 'function') {
      grid.scrollToIndex(index);
    }
  }

  // Non-destructively appends items (e.g. for infinite scroll pagination), without

  public scrollToCell(rowIndex: number, colIndex: number = 0): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.scrollToCell === 'function') {
      grid.scrollToCell(rowIndex, colIndex);
    }
  }

  // rebuilding the layout registry or resetting the scroll position like `items`/`data` does.
  public appendData(newItems: readonly unknown[]): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.appendData === 'function') {
      grid.appendData(newItems);
    }
  }

  // Non-destructively drops the first `count` items from the head of the data set,
  // counter-scrolling the viewport by the removed height to keep scrolling seamless.
  public removeDataFromHead(count: number): void {
    const grid = this.gridRef()?.nativeElement;
    if (grid && typeof grid.removeDataFromHead === 'function') {
      grid.removeDataFromHead(count);
    }
  }
}