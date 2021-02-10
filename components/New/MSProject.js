import { useState, useEffect } from "react";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "@material-ui/core";

const MSProject = () => {
  // const data = [
  //   { date: "01/01/2020", "Work Completion": 15 },
  //   { date: "02/01/2020", "Work Completion": 20 },
  //   { date: "03/01/2020", "Work Completion": 24 },
  //   { date: "04/01/2020", "Work Completion": 37 },
  //   { date: "05/01/2020", "Work Completion": 58 },
  //   { date: "06/01/2020", "Work Completion": 69 },
  //   { date: "07/01/2020", "Work Completion": 70 },
  //   { date: "08/01/2020", "Work Completion": 89 },
  // ];

  const [data, setData] = useState({
    selectRange: "",
    allProject: [],
    graph1: [],
    graph2: [],
    graph3: [],
    graph4: [],
  });
  const [selectedProject, setSelectedProject] = useState(5996);

  const handleSelectedProject = e => {
    setSelectedProject(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/MSProject/${selectedProject}`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
      });

      setData(() => ({
        selectRange: "1week",
        allProject: result.data.recordsets[0],
        graph1: result.data.recordsets[1],
        graph2: result.data.recordsets[2],
        graph3: result.data.recordsets[3],
        graph4: result.data.recordsets[4],
      }));
    };
    trackPromise(fetchData());
  }, [selectedProject]);

  const { promiseInProgress } = usePromiseTracker();

  return (
    <>
      {promiseInProgress ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader
            style={{
              marginTop: "50px",
            }}
            type="Oval"
            color="#82ca9d"
            height="100"
            width="100"
          />
        </div>
      ) : (
        <>
          <LineChart
            width={700}
            height={400}
            data={
              (data.selectRange === "1week" && data.graph1) ||
              (data.selectRange === "1month" && data.graph2) ||
              (data.selectRange === "3months" && data.graph3) ||
              (data.selectRange === "1year" && data.graph4)
            }
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis dataKey="Date" />
            <YAxis type="number" domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="WorkCompletion"
              stroke="#82ca9d"
              strokeWidth={3}
              dot={data.selectRange === "1year" ? false : true}
              isAnimationActive={true}
            />
          </LineChart>
          <div
            style={{
              display: "flex",
              marginTop: "10px",
            }}
          >
            <p
              style={{
                marginLeft: "20px",
                marginTop: 0,
                marginBottom: 0,
                fontFamily: "Roboto, sans-serif",
              }}
            >
              ProjectID
            </p>
            <select
              value={selectedProject}
              onChange={handleSelectedProject}
              style={{
                marginLeft: "50px",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {data.allProject.map(item => {
                return (
                  <option value={item.ProjectID}>
                    {item.ProjectID} ({item.Status})
                  </option>
                );
              })}
            </select>
          </div>
          <br />

          <div style={{ marginBottom: "10px" }}>
            <Button
              onClick={() =>
                setData(prevState => ({
                  ...prevState,
                  selectRange: "1week",
                }))
              }
              variant="outlined"
              style={{
                marginLeft: "15px",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              1 week
            </Button>
            <Button
              onClick={() =>
                setData(prevState => ({
                  ...prevState,
                  selectRange: "1month",
                }))
              }
              variant="outlined"
              style={{
                marginLeft: "50px",
              }}
            >
              1 month
            </Button>
            <Button
              onClick={() =>
                setData(prevState => ({
                  ...prevState,
                  selectRange: "3months",
                }))
              }
              variant="outlined"
              style={{
                marginLeft: "50px",
              }}
            >
              3 months
            </Button>
            <Button
              onClick={() =>
                setData(prevState => ({
                  ...prevState,
                  selectRange: "1year",
                }))
              }
              variant="outlined"
              style={{
                marginLeft: "50px",
              }}
            >
              1 year
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default MSProject;
