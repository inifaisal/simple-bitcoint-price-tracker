import React, { Component } from 'react';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import './App.css';

import Card from './Components/Card';
import { PriceCard, Navbar } from './Components';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

class App extends Component {
  state = {
    price: 0,
    dataSource: {
      chart: {
        caption: 'Realtime Price Data',
        subCaption: '',
        xAxisName: 'Local Time',
        yAxisName: 'Price in IDR',
        numberPrefix: 'IDR ',
        refreshinterval: '2',
        slantLabels: '1',
        numdisplaysets: '10',
        labeldisplay: 'rotate',
        showValues: '0',
        showRealTimeValue: '0',
        theme: 'fusion',
      },
      categories: [
        {
          category: [
            {
              label: this.clientDateTime().toString(),
            },
          ],
        },
      ],
      dataset: [
        {
          data: [
            {
              value: 0,
            },
          ],
        },
      ],
    },
  };

  chartRef = null;

  getChartRef = chart => {
    this.chartRef = chart;
  };

  static addLeadingZero(num) {
    return num <= 9 ? '0' + num : num;
  }

  getPrice = async () => {
    this.setState({ isLoading: true, isError: false });

    const response = await fetch(
      'https://api.coindesk.com/v1/bpi/currentprice/IDR.json'
    );
    const data = await response.json();

    if (data) {
      const dataSource = this.state.dataSource;

      dataSource.dataset[0]['data'][0].value = data.bpi.IDR.rate_float;

      this.setState({
        price: data.bpi.IDR.rate_float,
        isLoading: false,
        dataSource,
      });
      this.startInterval();
    }
  };

  startInterval = () => {
    setInterval(async () => {
      const response = await fetch(
        'https://api.coindesk.com/v1/bpi/currentprice/IDR.json'
      );
      const data = await response.json();

      if (data) {
        let x_axis = this.clientDateTime();
        let y_axis = data.bpi.IDR.rate_float;
        this.chartRef.feedData('&label=' + x_axis + '&value= ' + y_axis);
      }
    }, 1500);
  };

  clientDateTime() {
    const date_time = new Date();
    const curr_hour = date_time.getHours();
    const zero_added_curr_hour = App.addLeadingZero(curr_hour);
    const curr_min = date_time.getMinutes();
    const curr_sec = date_time.getSeconds();
    const curr_time = zero_added_curr_hour + ':' + curr_min + ':' + curr_sec;
    return curr_time;
  }

  componentDidMount() {
    this.getPrice();
  }

  render() {
    return (
      <React.Fragment>
        <Navbar>
          <section>
            <h3>Bitcoint Price Tracker</h3>
          </section>
        </Navbar>
        <main>
          <section>
            <div className="card-container">
              <PriceCard price={this.state.price} />
            </div>
            <div className="chart-container">
              <Card>
                <ReactFC
                  type="realtimeline"
                  renderAt="container"
                  width="100%"
                  height="350"
                  dataFormat="json"
                  dataSource={this.state.dataSource}
                  onRender={this.getChartRef}
                />
              </Card>
            </div>
          </section>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
