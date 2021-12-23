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

  

      const tmpHeat = [];
      d.map((item) => {
        const tmp = [];
        for(let idx = 0; idx < item['follower'].length-1;idx++) {
          tmp.push(1.0*item['follower'][idx+1]['number'] - item['follower'][idx]['number']);
        }

        tmpHeat.push(tmp);
      })

      console.log(tmpHeat);
    
      
      setHeatData(tmpHeat);
    })();
  }, []);

  console.log(data);
  console.log(heatData);

  
  const color = []
  heatData.map((item) => {
    color.push(d3.scaleLinear()
    .domain([Math.min(...item), 0 ,Math.max(...item)])
    .range(["blue", "white", "red"])
    );
  });

  console.log(color)
  //const color = d3.scaleLinear().range(['white', 'red']).domain([Math.min(...heatData), Math.max(...heatData)])
  const svgWidth = margin.left + margin.right + contentWidth;
  const svgHeight = margin.top + margin.bottom + contentHeight;
  const scale = d3.scaleBand().range([0, contentWidth/ 1.5]).domain(d3.range(heatData.length));
  //let idx = 0;
    return (
      <div>
        <svg
        viewBox={`${-margin.left} ${-margin.top} ${svgWidth} ${svgHeight}`}
        style={{ border: "solid 1px" }}
      >

        <g>
          <text x = {156} y = {0} fontSize={10}>5月</text>
          <text x = {185} y = {0} fontSize={10}>6月</text>
          <text x = {210} y = {0} fontSize={10}>7月</text>
          <text x = {235} y = {0} fontSize={10}>8月</text>
          <text x = {260} y = {0} fontSize={10}>9月</text>
          <text x = {285} y = {0} fontSize={10}>10月</text>
        </g>
          <g>
            {heatData.map((array, i)=> {
              console.log(array)
              //console.log(color)
              return(
              array.map((item, j) => {
                //console.log(color[i](item))
                //console.log(scale(j))
                //console.log(idx++);
                return(
                  <g>
                    <text 
                    x = {scale(0) - margin.left + 10 }
                    y = {50*i + 30}
                    font-size="10"
                    >{data[i]['title']}</text>

                <rect 
                  x = {scale(j) + 150}
                  y = {50*i + 10}
                  width={scale.bandwidth()}
                  height={scale.bandwidth()}
                  fill={color[i](item)}
                />
                </g>
                
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