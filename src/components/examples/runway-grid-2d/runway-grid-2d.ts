import {Component, viewChild, ViewEncapsulation} from '@angular/core';
import {RunwayWrapperComponent} from '../../runway-wrapper/runway-wrapper';

const GRID_ROWS = 100000;
const GRID_COLS = 500;

interface GridRow {
  id: number;
}

@Component({
  selector: 'app-runway-grid-2d-example',
  imports: [RunwayWrapperComponent],
  templateUrl: './runway-grid-2d.html',
  styleUrls: ['./runway-grid-2d.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RunwayGrid2dExampleComponent {
  readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);

  readonly rowCount = GRID_ROWS;
  readonly colCount = GRID_COLS;

  // Column definitions (drives colCount = 500). The wrapper applies `columns` to the
  // native element before `items`/`data`, mirroring the underlying <runway-grid> contract.
  readonly columns: string[] = Array.from({length: GRID_COLS}, (_, c) => `Col ${c}`);

  // Row data - each row just needs to exist; actual cell content is computed from
  // (rowIndex, colIndex) inside the template below.
  readonly gridRows: GridRow[] = Array.from({length: GRID_ROWS}, (_, r) => ({id: r}));

  isTallRow(rowIndex: number): boolean {
    return rowIndex % 10 === 0;
  }

  isWideCol(colIndex: number): boolean {
    return colIndex % 5 === 0;
  }

  scrollToTopLeft(): void {
    this.runwayWrapper()?.scrollToCell(0, 0);
  }

  scrollToBottomRight(): void {
    this.runwayWrapper()?.scrollToCell(this.rowCount - 1, this.colCount - 1);
  }
}
