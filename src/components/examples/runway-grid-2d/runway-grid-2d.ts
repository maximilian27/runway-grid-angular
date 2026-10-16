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
  protected readonly runwayWrapper = viewChild<RunwayWrapperComponent>(RunwayWrapperComponent);

  protected readonly rowCount = GRID_ROWS;
  protected readonly colCount = GRID_COLS;

  // Column definitions (drives colCount = 500). The wrapper applies `columns` to the
  // native element before `items`/`data`, mirroring the underlying <runway-grid> contract.
  protected readonly columns: string[] = Array.from({length: GRID_COLS}, (_, c) => `Col ${c}`);

  // Row data - each row just needs to exist; actual cell content is computed from
  // (rowIndex, colIndex) inside the template below.
  protected readonly gridRows: GridRow[] = Array.from({length: GRID_ROWS}, (_, r) => ({id: r}));

  protected isTallRow(rowIndex: number): boolean {
    return rowIndex % 10 === 0;
  }

  protected isWideCol(colIndex: number): boolean {
    return colIndex % 5 === 0;
  }

  protected scrollToTopLeft(): void {
    this.runwayWrapper()?.scrollToCell(0, 0);
  }

  protected scrollToBottomRight(): void {
    this.runwayWrapper()?.scrollToCell(this.rowCount - 1, this.colCount - 1);
  }
}
