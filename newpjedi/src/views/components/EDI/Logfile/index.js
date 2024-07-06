import { MuiButton, MuiDataGrid, MuiDateField, MuiGridWrapper } from '@controls';
import { useSearch } from '@hooks';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { logFileService } from '@services';
import check from '@static/images/check.png';
import remove from '@static/images/remove.png';
import { useLogfileStore } from '@stores';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useEffect, useRef, useState } from 'react';

const initDate = new Date();

export default function LogFile() {
  const isRendered = useRef(false);
  const btnRef_search = useRef();
  const chartRef = useRef(null);
  const [dataState, setDataState] = useState({
    isLoading: false,
    data: [],
    totalRow: 0,
    page: 1,
    pageSize: 100000,
    searchData: {
      searchDate: initDate,
    },
  });
  const handleSearch = useSearch(setDataState);

  const { record, recordArr, dispatchSetRecord, dispatchSetRecordArr } = useLogfileStore((state) => state);
  const [tabValue, setTabValue] = useState('chart');
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'spline',
      scrollablePlotArea: {
        minWidth: 1650,
        scrollPositionX: 1,
      },

      // events: {
      //   redraw: () => {
      //     // console.log('test');
      //     if (chartRef.current) {
      //       const chart = chartRef.current.chart;
      //       console.log('🚀 ~ file: index.js:57 ~ chartRef.current.chart.series.forEach ~ chart.series:', chart.series);
      //       chart.series.forEach((series) => {
      //         series.data.forEach((point) => {
      //           if (point.LogType === 'ERROR') {
      //             // console.log('🚀 ~ file: index.js:49 ~ series.data.forEach ~ point:', point);

      //             point.update({ marker: { enabled: true, symbol: 'triangle' } }, false);
      //           } else {
      //             point.update({ marker: { enabled: true, symbol: 'diamond' } }, false);
      //           }
      //         });
      //       });

      //       // chartRef.current.chart.redraw();
      //     }
      //   },
      // },
    },
    title: {
      text: 'Quá trình đo EDI trong ngày',
    },
    xAxis: {
      // type: 'datetime',
      title: {
        text: 'Thời gian lưu file',
      },
      categories: [],
    },
    yAxis: {
      title: {
        text: 'Số lần đo',
      },
    },
    legend: {
      enabled: true,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    // plotOptions: {
    //   spline: {
    //     // dataLabels: {
    //     //   enabled: true,
    //     // },
    //     // enableMouseTracking: true,
    //     lineWidth: 2,
    //     states: {
    //       hover: {
    //         lineWidth: 3,
    //       },
    //     },
    //     marker: {
    //       enabled: true,
    //     },

    //     // pointInterval: 3600000,
    //   },
    // },
    plotOptions: {
      spline: {
        marker: {
          enabled: true, // Enable markers for the spline series
        },
      },
    },

    series: [
      {
        name: 'Log',
        data: [],
        color: '#f7a35c',
        marker: {
          enabled: true, // Enable markers for the spline series
        },
      },
    ],
    // series: seriesData,
    tooltip: {
      pointFormat: `<span style="color:{point.color};font-size: 14">
                <b>
                  {point.ItemCode}
                </b>
              </span>
              <br/>
              Số lần đo: 
              <span style="color:{point.color};font-size: 14">
                <b>
                  {point.y}
                </b>
              </span>
              <br/>
              <span style="color:{point.color};font-size: 14">
                <b>
                  {point.LogType}
                </b>
              </span>`,
      // shared: true,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  });

  const fetchData = async () => {
    setDataState((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const params = {
      searchDate: dataState.searchData.searchDate,
    };

    const data = await logFileService.get(params);

    if (isRendered.current) {
      setDataState((prevState) => {
        return {
          ...prevState,
          totalRow: data ? data.length : 0,
          isLoading: false,
        };
      });

      dispatchSetRecordArr([...data], null);
    }
  };

  const handleChangeTab = async (event, newValue) => {
    setTabValue(() => newValue);
  };

  useEffect(() => {
    if (!isRendered.current) {
      isRendered.current = true;
    }

    return () => {
      isRendered.current = false;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [dataState.page, dataState.pageSize, dataState.searchData.searchDate]);

  useEffect(() => {
    setDataState((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const timestamps = [];
    const chartData = [];

    const data = recordArr.slice().sort((a, b) => new Date(a.LogTime) - new Date(b.LogTime));

    data.forEach((element) => {
      timestamps.push(element.LogTime);
      chartData.push({
        y: parseInt(element.NumberOfMeasurements),
        ItemCode: element.ItemCode,
        LogType: element.LogType,
        color: element.LogType === 'ERROR' ? '#BF0B23' : '#66bb6a',
        marker: {
          symbol: `url(${element.LogType === 'ERROR' ? remove : check})`,
        },
      });
    });

    // Update the categories in the chart options
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      xAxis: {
        ...prevOptions.xAxis,
        categories: timestamps, // Updated categories
      },
      series: [
        {
          ...prevOptions.series[0],
          data: chartData, // Updated series data
        },
      ],
    }));

    setDataState((prevState) => {
      return {
        ...prevState,
        totalRow: data ? data.length : 0,
        isLoading: false,
      };
    });
  }, [recordArr]);

  const columns = [
    // {
    //   field: 'id',
    //   headerName: '',
    //   width: 100,
    //   align: 'center',
    //   filterable: false,
    //   renderCell: function renderCell(index) {
    //     return index.api.getRowIndex(index.id) + 1 + (dataState.page - 1) * dataState.pageSize;
    //   },
    // },
    {
      field: 'LogMessage',
      headerName: 'Message',
      flex: 1,
    },
  ];
  return (
    <React.Fragment>
      <MuiGridWrapper>
        <MuiDateField
          variant="standard"
          label="Date"
          value={dataState.searchData.searchDate}
          onChange={(e) => handleSearch(e, 'searchDate')}
        />

        <MuiButton permission="allowAll" ref={btnRef_search} btnText="search" onClick={() => fetchData()} />
      </MuiGridWrapper>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab label={'Đồ thị'} value="chart" />
            <Tab label={'Bảng'} value="table" />
          </TabList>
        </Box>
        <TabPanel value="chart" sx={{ padding: '10px', margin: 0 }}>
          <HighchartsReact
            containerProps={{ style: { height: '100%' } }}
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartRef}
          />
        </TabPanel>
        <TabPanel value="table" sx={{ padding: '10px', margin: 0 }}>
          <MuiDataGrid
            showLoading={dataState.isLoading}
            isPagingServer={true}
            columns={columns}
            rows={recordArr.slice().sort((a, b) => new Date(b.LogTime) - new Date(a.LogTime))}
            page={dataState.page - 1}
            pageSize={dataState.pageSize}
            rowCount={dataState.totalRow}
            disableGrid={dataState.isLoading}
            onPageChange={(newPage) => {
              setDataState((prevState) => {
                return { ...prevState, page: newPage + 1 };
              });
            }}
            getRowId={(rows) => rows.LogMessage}
            getRowClassName={(params) => {
              if (params.row.LogType === 'ERROR') return `Mui-error`;
            }}
            reloadGrid={fetchData}
          />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  );
}
