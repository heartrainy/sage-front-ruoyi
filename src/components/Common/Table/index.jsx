import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import { ConfigProvider, Table, Card } from 'antd';
import { useFullscreen } from '@umijs/hooks';
import TableSearchForm from '@/components/Common/TableSearchForm';
import TableTool from '@/components/Common/TableTool';
import './style.less';

const initState = {
  pageNum: 1,
  pageSize: 10,
  dataSource: [],
  pagination: {
    showQuickJumper: true,
    showTotal: (total) => `总共 ${total} 条记录`,
  },
  searchParams: {}
};

/**
 *
 * @param {} props
 * 自定义props
 * 1、request
 * 2、hasNumber    是否有序列号
 * 3、hasCheck     是否有checkbox
 * 4、selectionType  选择框类型 checkbox(默认)、 radio
 * 5、onClickRow
 * 6、onDoubleClickRow
 * 7、onMouseEnterRow
 * 8、onMouseLeaveRow
 * 9、onContextMenuRow
 * 10、toolOptionConfig
 * 11、hiddeTool    隐藏工具栏
 * 12、isCacheCheck  是否缓存选中状态
 * 表格工具['reload', 'hiddensearch', 'density', 'fullScreen', 'setting']
 */
const SageTable = React.forwardRef((props, ref) => {
  const rootRef = useRef(null);
  const tableSearchFormRef = useRef();

  // 选中keys rows
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // 缓存选中selectedRowKeys、selectedRows
  const [cacheSelectedRowKeys, setCacheSelectedRowKeys] = useState([]);
  const [cacheSelectedRows, setCacheSelectedRows] = useState([]);

  // 展开keys
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // 列设置
  const [columns, setColumns] = useState([]);
  // 隐藏列设置
  const [allColumns, setAllColumns] = useState([]);
  // 默认隐藏列设置
  const [defaultColumnIndex, setDefaultColumnIndex] = useState([]);

  const {
    request,
    hasNumber = false,
    hasCheck = false,
    selectionType = 'checkbox',
    size: tableSizeProps,
    columns: columnsProps,
    dataSource: dataSourceProps,
    renderData = null,
    pagination: paginationProps,
    dataParamName: dataParamNameProps = 'rows',
    loading: loadingProps,
    rowSelection: rowSelectionProps,
    onClickRow: onClickRowProps,
    onDoubleClickRow: onDoubleClickRowProps,
    onMouseEnterRow: onMouseEnterRowProps,
    onMouseLeaveRow: onMouseLeaveRowProps,
    onContextMenuRow: onContextMenuRowProps,
    expandable: expandableProps,
    defaultExpandAllRows: defaultExpandAllRowsProps,
    isCacheCheck = false,
    // 搜索相关
    searchFields: searchFieldsProps,
    onSearchTable: onSearchTableProps,
    onResetTable: onResetTableProps,
    // 工具相关
    toolBarRender: toolBarRenderProps,
    toolOptionConfig: toolOptionConfigProps,
    hiddeTool = false,
    // 其余表格属性
    ...tableProps
    // onSelectedRow
  } = props;

  const { isFullscreen, setFull, exitFull } = useFullscreen({
    dom: () => document.getElementsByClassName('ant-pro-page-header-wrap-children-content')[0],
  });
  const [tableSize, setTableSize] = useState('small');
  const [loading, setLoading] = useState(false);
  const [tableState, setTableState] = useState(initState);

  // 获取表格数据
  const queryTable = async (tableParams, status) => {
    if (request) {
      let queryParams = {
        pageNum: tableState.pageNum,
        pageSize: tableState.pageSize,
      };

      // 是否有搜索条件
      const hasSearchCondition = tableParams !== undefined;

      if (hasSearchCondition) {
        queryParams = Object.assign(queryParams, {
          ...tableState.searchParams,
          ...tableParams,
        });

        if (status === 'change') {
          if (!tableParams.sortOrder) {
            delete queryParams.sortOrder;
          }
          if (!tableParams.sortField) {
            delete queryParams.sortField;
          }
        }
      }

      // 如果是重置则只保留分页和排序条件
      if (status === 'reset') {
        Object.keys(queryParams).forEach((item) => {
          if (
            !(
              item === 'pageNum' ||
              item === 'pageSize' ||
              item === 'sortField' ||
              item === 'sortOrder'
            )
          ) {
            delete queryParams[item];
          }
        });
      }

      setLoading(true);
      const res = await request(queryParams);
      setLoading(false);

      if (res.code === 200) {
        //const { curPage: current, pageCount: pageSize, dataMaxCount: total } = res;
        const { total } = res;

        const newSearchParams = Object.assign({}, queryParams);
        if (newSearchParams.pageNum) {
          delete newSearchParams.pageNum;
        }
        if (queryParams.pageSize) {
          delete newSearchParams.pageSize;
        }

        let lastDataSource = res[dataParamNameProps] ? res[dataParamNameProps].slice() : [];
        if (renderData) {
          lastDataSource = renderData(lastDataSource);
        }

        setTableState({
          pageNum: queryParams.pageNum,
          pageSize: queryParams.pageSize,
          dataSource: lastDataSource,
          pagination: {
            ...tableState.pagination,
            current: queryParams.pageNum,
            pageSize: queryParams.pageSize,
            total,
          },
          searchParams: hasSearchCondition ? { ...newSearchParams } : {},
        });

        if (defaultExpandAllRowsProps) {
          const allKeys = [];
          const allData = lastDataSource.slice();
          const filterExpandRowKeys = (list) => {
            list.forEach((item) => {
              if (item.children && item.children.length !== 0) {
                allKeys.push(item[props.rowKey]);
                filterExpandRowKeys(item.children);
              }
            });
          };
          filterExpandRowKeys(allData);
          setExpandedRowKeys(allKeys);
        }
      }
    }
  };

  // 改变表格数据
  const onChangeTable = async (pagination, filters, sorter) => {
    const tableParams = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };

    // 如果有排序则添加排序属性
    if (Object.keys(sorter).length !== 0 && sorter.order) {
      tableParams.sortField = sorter.column.sortField;
      tableParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    if (isCacheCheck) {
      setCacheSelectedRowKeys(selectedRowKeys.slice())
      setCacheSelectedRows(selectedRows.slice())
    }

    queryTable(tableParams, 'change');
  };

  // 刷新当前表格数据
  const reloadTable = () => {
    queryTable(tableState.searchParams);
  };

  // 获取选中keys
  const getSelectedRowKeys = () => {
    return selectedRowKeys;
  };

  // 获取选中rows
  const getSelectedRows = () => {
    return selectedRows;
  };

  // 工具方法
  const tableToolProps = {
    toolBarRender: toolBarRenderProps,
    toolOptionConfig: toolOptionConfigProps,
    // 勾选隐藏列
    onChangeColumnsHidden: (key, checked) => {
      const columnsTemp = allColumns.slice();
      for (let i = 0; i < columnsTemp.length; i++) {
        if (columnsTemp[i].key === key) {
          columnsTemp[i].hidden = !checked;
          break;
        }
      }
      setAllColumns(columnsTemp);
    },
    // 勾选取消全部列
    onChangeAllColumns: (boolean) => {
      const columnsTemp = allColumns.slice();
      columnsTemp.forEach(item => {
        item.hidden = !boolean
      })
      setAllColumns(columnsTemp);
    },
    // 重置列
    onResetColumns: () => {
      const columnsTemp = allColumns.slice();
      columnsTemp.forEach(item => {
        item.hidden = false
      })
      defaultColumnIndex.forEach(item => {
        columnsTemp[item].hidden = true
      })
      setAllColumns(columnsTemp);
    },
    // 刷新表格
    onRefreshTable: () => {
      queryTable(tableState.searchParams);
    },
    // 隐藏搜索条件
    onHiddeSearch: () => {
      if (tableSearchFormRef.current) {
        tableSearchFormRef.current.hiddenSearch();
      }
    },
    // 改变表格密度
    onChangeSize: (size) => {
      setTableSize(size);
    },
    // 全屏
    setFull: () => setFull(),
    // 退出全屏
    exitFull: () => exitFull(),
  };

  const tableSizeState = tableSizeProps !== undefined ? tableSizeProps : tableSize;
  const dataSourceState =
    dataSourceProps !== undefined ? dataSourceProps.slice() : tableState.dataSource;
  const paginationState = paginationProps !== undefined ? paginationProps : tableState.pagination;
  const loadingState = loadingProps !== undefined ? loadingProps : loading;
  // 是否有序号
  // const columnsState = columnsProps !== undefined ? columnsProps.slice() : [];

  useEffect(() => {
    let columnsTemp = allColumns ? allColumns.slice() : [];
    if (hasNumber) {
      columnsTemp.unshift({
        title: '序号',
        key: 'serialNumber',
        render: (text, record, index) => {
          let serialNumber = 0;
          if (paginationState) {
            serialNumber = `${
              (paginationState.current - 1) * paginationState.pageSize + index + 1
            }`;
          } else {
            serialNumber = index + 1;
          }
          return serialNumber;
        },
        align: 'center',
        width: 60,
      });
    }
    // 隐藏hidden属性列
    columnsTemp = columnsTemp.filter((item) => !item.hidden);
    setColumns(columnsTemp);
  }, [columnsProps, tableState, allColumns]);


  useEffect(() => {
    const columnsTemp = columnsProps ? columnsProps.slice() : []
    const hiddenIndex = []
    columnsTemp.forEach((item, index) => {
      if (item.hidden) {
        hiddenIndex.push(index)
      }
    })
    setDefaultColumnIndex(hiddenIndex);
    setAllColumns(columnsTemp);
  }, [columnsProps])


  useEffect(() => {
    queryTable();

  }, []);

  const tableSearchFormProps = {
    searchFields: searchFieldsProps,
    onSearchTable: onSearchTableProps,
    onResetTable: onResetTableProps,
  };

  const lastTableState = {
    ...tableProps,
  };

  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    type: selectionType,
    onChange: (selectedrowkeys, selectedrows) => {
      // console.log(`selectedRowKeys: ${selectedrowkeys}`, 'selectedRows: ', selectedrows);
      let lastSelectedRowKeys = selectedrowkeys.slice()
      let lastSelectedRows = selectedrows.slice()
      if (isCacheCheck) {
        lastSelectedRowKeys = lastSelectedRowKeys.concat(cacheSelectedRowKeys)
        lastSelectedRows = selectedrows.concat(cacheSelectedRows)
      }
      setSelectedRowKeys(lastSelectedRowKeys);
      setSelectedRows(lastSelectedRows);

      if (tableProps.onSelectedRow) {
        tableProps.onSelectedRow(lastSelectedRowKeys, lastSelectedRows)
      }
    },
  };

  if (hasCheck) {
    lastTableState.rowSelection = {
      ...rowSelection,
      ...rowSelectionProps,
    };
  }

  const getExpandedRowKeys = () => {
    return expandedRowKeys;
  };

  const getAllExpandedRowKeys = () => {
    const allKeys = [];
    const allData = dataSourceState.slice();
    const filterExpandRowKeys = (list) => {
      list.forEach((item) => {
        if (item.children && item.children.length !== 0) {
          allKeys.push(item[props.rowKey]);
          filterExpandRowKeys(item.children);
        }
      });
    };
    filterExpandRowKeys(allData);
    return allKeys;
  };

  if (expandableProps) {
    lastTableState.expandable = {
      expandedRowKeys,
      onExpand: (expanded, record) => {
        const lastExpandedRowKeys = expandedRowKeys.slice();
        if (expanded) {
          lastExpandedRowKeys.push(record[props.rowKey]);
          setExpandedRowKeys(lastExpandedRowKeys);
        } else {
          const deleteIndex = lastExpandedRowKeys.findIndex(
            (item) => item === record[props.rowKey],
          );
          lastExpandedRowKeys.splice(deleteIndex, 1);
        }
        setExpandedRowKeys(lastExpandedRowKeys);
      },
    };
  }

  // 获取当前列表的数据
  const getDataSource = () => {
    return dataSourceState;
  };

  // 给列表赋值
  const setDataSource = (data) => {
    const tableStateTemp = Object.assign({}, tableState);
    let lastDataSource = data.slice();
    if (renderData) {
      lastDataSource = renderData(lastDataSource);
    }
    tableStateTemp.dataSource = lastDataSource;
    setTableState(tableStateTemp);
  };

  // 根据某个属性修改值
  const setDataSourceByMapKey = (
    fieldKeyName,
    fieldKeyValue,
    changeFieldKeyName,
    changeFieldKeyValue,
  ) => {
    const dataSourceTemp = tableState.dataSource ? tableState.dataSource.slice() : [];

    const loopDataSource = (list) => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].children && list[i].children.length !== 0) {
          loopDataSource(list[i].children);
        }
        if (list[i][fieldKeyName] === fieldKeyValue) {
          list[i][changeFieldKeyName] = changeFieldKeyValue;
          break;
        }
      }
    };
    loopDataSource(dataSourceTemp);

    const tableStateTemp = Object.assign({}, tableState);
    tableStateTemp.dataSource = dataSourceTemp;
    setTableState(tableStateTemp);
  };

  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    queryTable,
    reloadTable,
    getDataSource,
    setDataSource,
    getSelectedRowKeys,
    setSelectedRowKeys,
    getSelectedRows,
    setSelectedRows,
    getSearchFieldsValue: () => tableSearchFormRef.current.getFieldsValue(),
    getAllExpandedRowKeys,
    getExpandedRowKeys,
    setExpandedRowKeys,
    setDataSourceByMapKey,
  }));

  return (
    <ConfigProvider getPopupContainer={() => rootRef.current}>
      <div className="sage-pro-table" ref={rootRef}>
        <Card
          bordered={false}
          style={{
            height: '100%',
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          {searchFieldsProps && searchFieldsProps.length !== 0 && (
            <TableSearchForm ref={tableSearchFormRef} {...tableSearchFormProps} />
          )}

          {!hiddeTool ? (
            <TableTool
              tableSize={tableSizeState}
              isFullscreen={isFullscreen}
              columns={allColumns}
              {...tableToolProps}
            />
          ) : null}

          <Table
            size={tableSizeState}
            columns={columns}
            dataSource={dataSourceState}
            pagination={paginationState}
            loading={loadingState}
            onChange={onChangeTable}
            onRow={(record) => {
              return {
                // 点击行
                onClick: (event) => {
                  event.stopPropagation();
                  if (onClickRowProps) {
                    onClickRowProps(record);
                  }
                },
                // 双击行
                onDoubleClick: (event) => {
                  event.stopPropagation();
                  if (onDoubleClickRowProps) {
                    onDoubleClickRowProps(record);
                  }
                },
                // 鼠标右键
                onContextMenu: (event) => {
                  event.stopPropagation();
                  if (onContextMenuRowProps) {
                    onContextMenuRowProps(record);
                  }
                },
                // 鼠标移入行
                onMouseEnter: (event) => {
                  event.stopPropagation();
                  if (onMouseEnterRowProps) {
                    onMouseEnterRowProps(record);
                  }
                },
                // 鼠标移出行
                onMouseLeave: (event) => {
                  event.stopPropagation();
                  if (onMouseLeaveRowProps) {
                    onMouseLeaveRowProps(record);
                  }
                },
              };
            }}
            {...lastTableState}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
});

export default SageTable;
