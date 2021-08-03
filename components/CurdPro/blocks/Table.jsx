import React from 'react'
import {Table} from 'antd'

export default (props) => {
  const expandable = {
    rowExpandable: () => true,
    expandedRowRender: (record, index) => (
      <div>展开了</div>
    ),
  }

  const tableProps = {
    pagination: false,
    expandable: props.isShowExpandable && expandable,
    dataSource: props.dataSource,
    columns: props.columns,
    rowKey: 'id',
  }

  return <Table {...tableProps} />
}
