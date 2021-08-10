import React, { Component } from "react";
import { Table } from "reactstrap";
export default class TradeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      histories: [],
      searchTerm: "PH",
      currentDay:"26"
    };
  }
  getTarih = () => {};
  componentDidMount() {
    this.getHistory();
    this.getTarih();
  }

  getHistory = () => {
    fetch("http://localhost:3000/intraDayTradeHistoryList")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          histories: data.filter((datac) =>
            datac.conract
              .toLowerCase()
              .includes(this.state.searchTerm.toLocaleLowerCase())
          ),
        })
      );
  };


   formatDate=(date)=> {
    var d = new Date(date),//for define month year etc.
        month = '' + date.substring(2,4),
        day = '' + date.substring(4,6),
        year = '20'+date.substring(0,2),
        hour='\n'+date.substring(6,8)+':00';
    return [year, month, day, hour].join('-');
}

  getTotalQuantity = (arr) => {
    return arr.histories.reduce((a, v) => (a = a + v.quantity), 0) / 10;
  };

  getTotalPrice = (arr) => {
    return (
      (arr.histories.reduce((a, v) => (a = a + v.quantity), 0) / 10) *
      arr.histories.reduce((a, v) => (a = a + v.price), 0)
    );
  };

  getWeightedAverage = (arr) => {
    return (
      ((arr.histories.reduce((a, v) => (a = a + v.quantity), 0) / 10) *
        arr.histories.reduce((a, v) => (a = a + v.price), 0)) /
      arr.histories.reduce((a, v) => (a = a + v.quantity), 0)
    );
  };

  render() {
    const groups = this.state.histories.reduce((groups, a) => {
      const date = a.conract.replace("PH", "");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(a);
      return groups;
    }, {});

    //{[],[],[]}?????==>
    //[{}{}{}{}]

    const groupArray = Object.keys(groups).map((date) => {
      return {
        date,
        histories: groups[date],
      };
    });
    console.log(groupArray);

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Toplam Miktar</th>
              <th>Toplam Fiyat</th>
              <th>Ağırlıklı Ortalama Fiyat</th>
            </tr>
          </thead>
          <tbody>
            {groupArray.filter(day=>(
                day.date.substring(4,6)===this.state.currentDay
            ))
            .map((history) => (
              <tr>
                <td>{this.formatDate(history.date)}</td>
                <td>{this.getTotalQuantity(history)}</td>
                <td>{this.getTotalPrice(history)}</td>
                <td>{this.getWeightedAverage(history)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
