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
  const [data, setData] = useState({
    selectRange: "1week",
    allProject: [],
    graph1: [],
    graph2: [],
    graph3: [],
    graph4: [],
  });
  const [selectedProject, setSelectedProject] = useState(5996);
  const [selectedFeature, setFeature] = useState("WorkCompletion");

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

      setData(prevState => ({
        ...prevState,
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
              marginBottom: "50px",
            }}
            type="Oval"
            color="#0ace83"
            height="100"
            width="100"
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                marginLeft: "10px",
                marginTop: 0,
                marginBottom: 0,
                fontFamily: "Roboto, sans-serif",
                color: "#74646e",
                fontWeight: 500,
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
                display: "inline-block",
                color: "#74646e",
                border: "1px solid #c8bfc4",
                borderRadius: "4px",
                boxShadow: "inset 1px 1px 2px #ddd8dc",
                background: "#fff",
              }}
            >
              {data.allProject.map(item => {
                return (
                  <option value={item.ProjectID} key={item.ProjectID}>
                    {item.ProjectID} ({item.Status})
                  </option>
                );
              })}
            </select>
          </div>
          <div style={{ display: "flex" }}>
            <LineChart
              width={980}
              height={500}
              data={
                (data.selectRange === "1week" && data.graph1) ||
                (data.selectRange === "1month" && data.graph2) ||
                (data.selectRange === "3months" && data.graph3) ||
                (data.selectRange === "1year" && data.graph4)
              }
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
            >
              <XAxis dataKey="Date" />
              {selectedFeature === "WorkCompletion" && (
                <YAxis type="number" domain={[0, 100]} />
              )}
              {selectedFeature === "EEAC" && (
                <YAxis domain={["dataMin - 10000", "dataMax + 10000"]} />
              )}

              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />

              {selectedFeature === "WorkCompletion" && (
                <Line
                  type="monotone"
                  dataKey="WorkCompletion"
                  stroke="#0ace83"
                  strokeWidth={3}
                  dot={data.selectRange === "1year" ? false : true}
                  isAnimationActive={true}
                />
              )}
              {selectedFeature === "EEAC" && (
                <Line
                  type="monotone"
                  dataKey="EEAC"
                  stroke="#f19c3b"
                  strokeWidth={3}
                  dot={data.selectRange === "1year" ? false : true}
                  isAnimationActive={true}
                />
              )}
            </LineChart>
            <div
              style={{
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
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
                  color: data.selectRange === "1week" ? "#1ec8db" : "grey",
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
                  fontFamily: "Roboto, sans-serif",
                  color: data.selectRange === "1month" ? "#1ec8db" : "grey",
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
                  fontFamily: "Roboto, sans-serif",
                  color: data.selectRange === "3months" ? "#1ec8db" : "grey",
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
                  fontFamily: "Roboto, sans-serif",
                  color: data.selectRange === "1year" ? "#1ec8db" : "grey",
                }}
              >
                1 year
              </Button>
            </div>
          </div>
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="outlined"
              style={{
                marginLeft: "20px",
                fontFamily: "Roboto, sans-serif",
                color:
                  selectedFeature === "WorkCompletion" ? "#1ec8db" : "grey",
              }}
              onClick={() => setFeature("WorkCompletion")}
            >
              WorkCompletion
            </Button>
            <Button
              variant="outlined"
              style={{
                marginLeft: "20px",
                fontFamily: "Roboto, sans-serif",
                color: selectedFeature === "EEAC" ? "#1ec8db" : "grey",
              }}
              onClick={() => setFeature("EEAC")}
            >
              EEAC
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default MSProject;
