import React, {useState} from 'react'
import {InputNumber} from 'antd'
import _ from 'lodash'
import styles from '../../styles/index.less'

export default (props) => {

  const {value = [], min, max, onChange} = props

  const [number, setNumber] = useState(value)

  const onNumberChange = (index, value) => {

    const curNumber = parseInt(value || '0', 10)
    if (Number.isNaN(curNumber)) return

    const newNumber = _.cloneDeep(number)
    newNumber[index] = curNumber

    setNumber(newNumber)

    onChange(newNumber)
  }

  return (
    <div className={styles.flexRowAic}>
      <InputNumber min={min} max={max} value={number[0]} onChange={n => onNumberChange(0, n)}/>
      <span style={{margin: '0 3px'}}> - </span>
      <InputNumber min={min} max={max} value={number[1]} onChange={n => onNumberChange(1, n)}/>
    </div>
  )
}
