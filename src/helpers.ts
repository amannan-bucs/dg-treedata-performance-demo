import {
    GridComparatorFn,
    GridRowModes,
    GridRowModesModel,
    GridSortCellParams,
    GridRowId,
} from "@mui/x-data-grid-pro";

export const childCountComparator: GridComparatorFn<number> = (
    v1: number,
    v2: number,
    param1: GridSortCellParams,
    param2: GridSortCellParams
) => {
    //@ts-ignore
    const count1 = param1.rowNode?.children?.length ?? 0;
    //@ts-ignore
    const count2 = param2.rowNode?.children?.length ?? 0;
    return count1 - count2;
};

export const isInEditMode = (
    rowModesModel: GridRowModesModel,
    id: GridRowId
) => {
    const mode = rowModesModel[id];
    if (mode && mode.mode === GridRowModes.Edit) {
        return true;
    } else {
        return false;
    }
};
