import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  DataGridProProps,
  GridColDef,
  GridExpandMoreIcon,
  GridRenderCellParams,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { IconButton, Link, Typography } from '@mui/material';
import FlexBox from './Components/FlexBox';
import { childCountComparator, isInEditMode } from './helpers';
import { useRef } from 'react';

export default function DataGridProDemo() {
  const gridApiRef = useGridApiRef();
  const expandedTreeRowIdRef = useRef<GridRowId>(undefined);
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 95000,
    editable: true,
  });

  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  React.useEffect(() => {
    gridApiRef.current?.subscribeEvent('rowExpansionChange', (params) => {
      console.log('rowExpansionChange event invoked');
      const { id, childrenExpanded } = params;
      if (childrenExpanded) {
        expandedTreeRowIdRef.current = id;
      } else {
        expandedTreeRowIdRef.current = undefined;
      }
    });
  }, [gridApiRef]);

  const RenderGroupingCell = (params: GridRenderCellParams) => {
    const { id, rowNode, row, value } = params;
    const apiRef = useGridApiContext();
    const [isExpanded, setIsExpanded] = React.useState(
      rowNode.type === 'group' && rowNode?.childrenExpanded
    );
    const handleToggle = React.useCallback(() => {
      setIsExpanded((prev) => !prev);
      apiRef.current?.setRowChildrenExpansion(id, !isExpanded);
    }, [apiRef, isExpanded]);

    return (
      <FlexBox
        alignItems={'center'}
        flex={1}
        margin={'0px -10px'}
        height={'100%'}
      >
        {rowNode.type === 'group' && (
          <IconButton onClick={handleToggle}>
            <GridExpandMoreIcon
              sx={(theme) => ({
                fontSize: 20,
                transform: `rotateZ(${isExpanded ? 0 : -90}deg)`,
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
              })}
              fontSize='small'
            />
          </IconButton>
        )}

        <Typography fontSize={14} sx={{ ml: 1 }} fontWeight={600}>
          {value}
        </Typography>
      </FlexBox>
    );
  };

  const MDR_GROUPING_COL_DEF = React.useMemo<
    DataGridProProps['groupingColDef']
  >(
    () => ({
      headerName: 'Commodity',
      minWidth: 320,
      flex: 1,
      sortable: true,
      hideDescendantCount: true,
      hideable: false,
      leafField: 'commodity',
      renderCell: RenderGroupingCell,
    }),
    [gridApiRef, data.rows, rowModesModel, RenderGroupingCell]
  );

  const recordsCountCol: GridColDef = {
    headerName: 'Record Count',
    field: 'recordCount',
    maxWidth: 220,
    align: 'center',
    headerAlign: 'center',
    minWidth: 140,
    headerClassName: 'unwrap-heading',
    sortComparator: childCountComparator,
    renderCell: (params) => {
      const { field, rowNode } = params;
      return rowNode.type === 'group' ? rowNode.children.length : '';
    },
  };

  const enterRowEditMode = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const exitRowEditMode = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
  };

  function GetActions(props: GridRenderCellParams) {
    const { id, field, rowNode } = props;
    const apiRef = useGridApiContext();

    const handleRowExpansion = (event: React.SyntheticEvent) => {
      if (rowNode.type !== 'group') {
        return;
      }
      const isExpanded = rowNode.childrenExpanded;
      apiRef.current?.setRowChildrenExpansion(id, !isExpanded);
      event.stopPropagation();
    };

    return rowNode.type === 'group' ? (
      <FlexBox justifyContent={'flex-start'} gap={1} alignItems={'center'}>
        {rowNode.childrenExpanded && (
          <>
            <Link
              onClick={() => {
                console.log('group action 1');
              }}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  color: 'blue',
                },
              }}
            >
              Edit Group
            </Link>
            <Link
              onClick={(e) => {
                handleRowExpansion(e);
              }}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  color: 'blue',
                },
              }}
            >
              Close
            </Link>
          </>
        )}
        {!rowNode.childrenExpanded && (
          <Link
            onClick={(e) => {
              handleRowExpansion(e);
            }}
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                color: 'blue',
              },
            }}
          >
            Edit Group
          </Link>
        )}
      </FlexBox>
    ) : rowNode.type == 'leaf' && !isInEditMode(rowModesModel, id) ? (
      <FlexBox justifyContent={'flex-start'} gap={1} alignItems={'center'}>
        <Link
          onClick={() => {
            console.log('action1');
          }}
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
              color: 'blue',
            },
          }}
        >
          Action1
        </Link>
        <Link
          onClick={() => {
            enterRowEditMode(id);
          }}
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
              color: 'blue',
            },
          }}
        >
          Edit
        </Link>
      </FlexBox>
    ) : isInEditMode(rowModesModel, id) ? (
      <FlexBox justifyContent={'flex-start'} gap={1} alignItems={'center'}>
        <Link
          onClick={() => {
            exitRowEditMode(id);
          }}
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': {
              color: 'blue',
            },
          }}
        >
          Save
        </Link>
      </FlexBox>
    ) : (
      <></>
    );
  }

  const actionsCol: GridColDef = {
    flex: 1,
    field: 'actions',
    minWidth: 160,
    hideable: false,
    renderCell: (params: GridRenderCellParams) => (
      <GetActions {...params}></GetActions>
    ),
  };

  const columns = React.useMemo(() => {
    return [recordsCountCol, ...data.columns, actionsCol];
  }, [data.columns]);

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <DataGridPro
        {...data}
        columns={columns}
        apiRef={gridApiRef}
        treeData
        getTreeDataPath={(row) => {
          return [row.commodity, row.id];
        }}
        isGroupExpandedByDefault={(node) =>
          expandedTreeRowIdRef.current === node.id
        }
        loading={loading}
        groupingColDef={MDR_GROUPING_COL_DEF}
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        rowHeight={38}
        pinnedColumns={{
          right: ['actions'],
        }}
        checkboxSelection
        editMode='row'
        disableRowSelectionOnClick
      />
    </Box>
  );
}
