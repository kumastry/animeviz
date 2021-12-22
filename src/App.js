import * as d3 from "d3";
import {useState, useEffect} from "react";

function App() {
  const [data, setData] = useState([]);
  const [heatData, setHeatData] = useState([]);

  const margin = {
    top: 10,
    bottom: 50,
    left: 50,
    right: 100,
  };
  const contentWidth = 400;
  const contentHeight = 700;
 
  
  useEffect(() => {
    (async () => {
      const request = await fetch("sample.json");
      const d = await request.json();
      setData(d);

      let t = [];
      console.log(d[0]['follower'].length);
      for(let i = 0; i < d[0]['follower'].length-1; i++) {
        t.push(1.0*d[0]['follower'][i+1]['number'] / d[0]['follower'][i]['number']);
      }

      const tmpHeat = [];
      d.map((item) => {
        const tmp = [];
        for(let idx = 0; idx < item['follower'].length-1;idx++) {
          tmp.push(1.0*item['follower'][idx+1]['number'] / item['follower'][idx]['number']);
        }

        tmpHeat.push(tmp);
      })

      console.log(tmpHeat);
    
      console.log(t);
      setHeatData(tmpHeat);
    })();
  }, []);

  console.log(data);
  console.log(heatData);

  
  const color = []
  heatData.map((item) => {
    color.push(d3.scaleSequential(d3.interpolateReds).domain([Math.min(...item), Math.max(...item)]));
  });

  console.log(color)
  //const color = d3.scaleLinear().range(['white', 'red']).domain([Math.min(...heatData), Math.max(...heatData)])
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const scale = d3.scaleBand().range([0, contentWidth]).domain(d3.range(heatData.length));
  let idx = 0;
    return (
      <div>
        <svg
        viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        style={{ border: "solid 1px" }}
      >
          <g>
            {heatData.map((array, i)=> {
              //console.log(array)
              //console.log(color)
              return(
              array.map((item, j) => {
                //console.log(color[i](item))
                //console.log(scale(j))
                //console.log(idx++);
                return(
                <rect 
                  x = {scale(j)}
                  y = {50*i}
                  width={scale.bandwidth()}
                  height={scale.bandwidth()}
                  fill={color[i](item)}
                />
                
                );
              }) 
              );
            })
          

          }
          </g>

    
        </svg>
      </div>
    );
  }
  
  export default App;