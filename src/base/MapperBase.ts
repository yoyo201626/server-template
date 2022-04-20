import { myNosql } from "../database";
import { Data } from "../database/index";
import { ModelBase } from "./ModelBase";

export class MapperBase {
  tableName: string;
  getModelWidthMap(data: any): any[] {
    const result: any = {};
    for (let key in this) {
      if (key === "tableName") continue;
      result[key] = data[key];
    }
    return result;
  }
  getTableName() {
    return this.tableName;
  }
  getById(id: number): any {
    return this.getModelWidthMap(
      (
        myNosql.data[
          this.getTableName() as keyof Data
        ] as unknown as Array<ModelBase>
      ).find((row) => row.id == id)
    );
  }
  getList(): any[] {
    return (
      myNosql.data[
        this.getTableName() as keyof Data
      ] as unknown as Array<ModelBase>
    ).map((row) => {
      return this.getModelWidthMap(row);
    });
  }
  setByModelId(data: ModelBase): boolean {
    const table = myNosql.data[
      this.getTableName() as keyof Data
    ] as unknown as Array<any>;
    const rowIndex = table.findIndex((row) => row.id == data.id);
    if (rowIndex !== -1) {
      table[rowIndex] = this.getModelWidthMap(data);
    } else {
      data.id = this._getNextId(table);
      table.push(this.getModelWidthMap(data));
    }
    return true;
  }
  delById(id: number): boolean {
    const table = myNosql.data[
      this.getTableName() as keyof Data
    ] as unknown as Array<any>;
    const rowIndex = table.findIndex((row) => row.id == id);
    if (rowIndex !== -1) {
      table.splice(rowIndex, 1);
      return true;
    } else {
      return false;
    }
  }
  _getNextId(table: Array<ModelBase>): number {
    let max = 0;
    for (let row of table) {
      max = max > row.id ? max : row.id;
    }
    return max + 1;
  }
}
