import React, { PropTypes } from 'react'
import './libs/nice-select.css'
import './libs/nice-select'
import './libs/Footable'
import './libs/Footable.Editable'

import './DBTable.scss'

class DBTable extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  componentDidMount () {

    $('.footable').footable({
      breakpoints: {
        phone: 400,
        tablet: 400
      }
    })

    this.ftEditable = $().ftEditable()
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onSelectDbItem (e) {

    //const id = $(e.target).parent()[0].id
    //
    //const selectedDbItem = _.find(
    //  this.props.dbItems, { _id:id })
    //
    //this.props.onSelectDbItem(
    //  selectedDbItem)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  refresh() {

    if (this.ftEditable) {

      this.ftEditable.deleteAllRows(
        '.footable')

      this.ftEditable.addRows(
        '.footable',
        this.props.dbItems.map((dbItem) => {
          return {
            name: dbItem.name,
            supplier: dbItem.supplier,
            price: dbItem.price,
            currency: dbItem.currency,
            id: dbItem._id
          }
        }), {
          select: {
            currency: [
              {value:'ARS', label:'ARS'},
              {value:'BRL', label:'BRL'},
              {value:'CAD', label:'CAD'},
              {value:'CHF', label:'CHF'},
              {value:'CNY', label:'CNY'},
              {value:'DKK', label:'DKK'},
              {value:'EUR', label:'EUR'},
              {value:'GBP', label:'CAD'},
              {value:'INR', label:'INR'},
              {value:'JPY', label:'JPY'},
              {value:'MXN', label:'MXN'},
              {value:'PLN', label:'PLN'},
              {value:'RUB', label:'RUB'},
              {value:'USD', label:'USD'},
              {value:'ZAR', label:'ZAR'}
            ]
          }
        })

      this.ftEditable.setUpdateHandler((updateRecord) => {

        let dbItem = _.find(this.props.dbItems, {
          _id: updateRecord.id
        })

        if(updateRecord.fieldName === 'price') {

          dbItem[updateRecord.fieldName] =
            parseFloat(updateRecord.fieldValue)

        } else {

          dbItem[updateRecord.fieldName] =
            updateRecord.fieldValue
        }

        this.props.onUpdateDbItem(dbItem)
      })

      this.select = $('select').niceSelect()

      this.select.on('change', (e, option) => {

        const id = $(option).parents('tr')[0].id

        let dbItem = _.find(this.props.dbItems, {
          _id: id
        })

        dbItem.currency = $(option).attr('data-value')

        this.props.onUpdateDbItem(dbItem)
      })

      $('.footable > tbody > tr > td:first-child').off(
        'click')

      $('.footable > tbody > tr > td:first-child').on (
        'click', (e) => this.onSelectDbItem(e))
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render() {

    this.refresh()

    return (
        <div className="db-table">
          <table className="footable">
            <thead>
              <tr>
                <th className="db-column fooId">
                Material
                </th>
                <th className="db-column fooEditable" data-hide="phone,tablet">
                Supplier
                </th>
                <th className="db-column fooEditable">
                Price (/kg)
                </th>
                <th className="db-column" data-hide="phone" data-ft-control="select">
                Currency
                </th>
                <th className="db-column hidden">
                _id
                </th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
    )
  }
}

export default DBTable