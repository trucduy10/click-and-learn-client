import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onLoadCategoryEnrollmentChart,
  onLoadRevenueYearChart,
} from "../../store/dashboard/dashboardSlice";
import { selectAllDashboardState } from "../../store/dashboard/dashboardSelector";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Button, Grid } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const optionChart1 = {
  responsive: true,
  maintainAspectRatio: false,
  width: "100%",
  height: "100%",
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: "black",
        fontSize: 14,
      },
    },
    title: {
      position: "bottom",
      display: true,
      text: "Category's Enrollment Chart",
    },
  },
  datalabels: {
    display: true,
    color: "white",
  },
};

const optionChart2 = {
  responsive: true,
  width: "100%",
  height: "100%",
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      position: "bottom",
      display: true,
      text: "Year's Revenue Chart",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return context.parsed.y.toFixed(2) + " USD"; // Modify the label content here
        },
      },
    },
  },
};

const ChartsMuiCom = () => {
  const dispatch = useDispatch();
  const { dashboard, cateEnrollChart, revenueChart } = useSelector(
    selectAllDashboardState
  );
  useEffect(() => {
    dispatch(onLoadCategoryEnrollmentChart());
    dispatch(onLoadRevenueYearChart());
  }, [dispatch]);

  const labelCateEnrollChart = cateEnrollChart.map((ce) => ce.name);
  const dataCateEnrollChart = cateEnrollChart.map((ce) => ce.percent);

  const chart1 = {
    labels: labelCateEnrollChart,
    datasets: [
      {
        label: "(%) Percent of user Enrollment",
        data: dataCateEnrollChart,
        backgroundColor: ["#f8da5b", "#007cb9", "#0b8457", "#dc2f2f"],
        borderColor: ["#eac100", "#10316b", "#295f4e", "#761a1a"],
        borderWidth: 1,
      },
    ],
  };
  const year = [...new Set(revenueChart.map((r) => r.year))];

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chart2 = {
    labels,
    datasets: year.map((y) => ({
      label: y,
      data: revenueChart.filter((r) => r.year === y).map((r) => r.revenue),
      borderColor: y === 2022 ? "rgb(255, 99, 132)" : "rgb(53, 162, 235)",
      backgroundColor:
        y === 2022 ? "rgba(255, 99, 132, 0.5)" : "rgba(53, 162, 235, 0.5)",
    })),
    // datasets: [
    //   {
    //     label: "2023",
    //     data: revenue2023.map((r) => r.revenue),
    //     borderColor: "rgb(255, 99, 132)",
    //     backgroundColor: "rgba(255, 99, 132, 0.5)",
    //   },
    //   {
    //     label: "2022",
    //     data: revenue2022.map((r) => r.revenue),
    //     borderColor: "rgb(53, 162, 235)",
    //     backgroundColor: "rgba(53, 162, 235, 0.5)",
    //   },
    // ],
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} sm={12} md={6}>
          <Pie data={chart1} options={optionChart1} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Line data={chart2} options={optionChart2} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ChartsMuiCom;
