import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const Home = (props) => {
  const [svgPanel, setSvgPanel] = useState(null);
  var selectedElement, offset, transform, bbox, minX, maxX, minY, maxY, confined;

  var boundaryX1 = 20;
  var boundaryX2 = 180;
  var boundaryY1 = -130;
  var boundaryY2 = 130;

  useEffect(() => {
    const svg = document.getElementById('physixSvg');
    if (svg == null)
      return;

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);

    if (svgPanel == null)
      setSvgPanel(svg)

  }, [svgPanel]); 

  const getMousePosition = (evt) => {
    var CTM = svgPanel.getScreenCTM();
    if (evt.touches) { evt = evt.touches[0]; }
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d
    };
  }

  const startDrag = (evt) => {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      offset = getMousePosition(evt);

      // Make sure the first transform on the element is a translate transform
      var transforms = selectedElement.transform.baseVal;

      if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
        // Create an transform that translates by (0, 0)
        var translate = svgPanel.createSVGTransform();
        translate.setTranslate(0, 0);
        selectedElement.transform.baseVal.insertItemBefore(translate, 0);
      }

      // Get initial translation
      transform = transforms.getItem(0);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;

      confined = evt.target.classList.contains('confine');
      if (confined) {
        bbox = selectedElement.getBBox();
        minX = boundaryX1 - bbox.x;
        maxX = boundaryX2 - bbox.x - bbox.width;
        minY = boundaryY1 - bbox.y;
        maxY = boundaryY2 - bbox.y - bbox.height;
      }
    }  
  }

  const drag = (evt) => {

    if (selectedElement) {

      evt.preventDefault();

      var coord = getMousePosition(evt);
      var dx = coord.x - offset.x;
      var dy = coord.y - offset.y;

      if (confined) {
        if (dx < minX) { dx = minX; }
        else if (dx > maxX) { dx = maxX; }
        if (dy < minY) { dy = minY; }
        else if (dy > maxY) { dy = maxY; }
      }

      transform.setTranslate(dx, dy);
    }
  }

  const endDrag = (evt) => {
    selectedElement = false;
  }

  return (
    <div style={{background: "black", color:"white" }}>
      <div style={{ textAlign:"center" }}>
        <big><big><big><big>
        <span style={{ fontWeight:"bold", fontFamily:"Courier New", Color: "white"}}>Chompsky Box
          <br/>
          2D Dialectic
        </span>
        </big></big></big></big>

        <br/>
      </div>

      <div className="app-wrapper" id="html-content-holder">
        <figure>
          <Box
            component="img"
            sx={{
              height: 200,
              width: 300,
            }}
            alt="The house from the offer."
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            style={{border: "2px white solid"}}
          />          
          <figcaption>This is subject</figcaption>
        </figure>

        <div className="graphic-wrapper">
          <div className="graphic-row">I am a person online</div>
          <div className="graphic-row">
            <div className="graphic-column">Hate</div>
            <div className="graphic-column graphic-border">
              <svg id="physixSvg" width="250" height="250" className="supra-gradient" viewBox="-200 -150 400 300">
                <circle className="draggable" id="IpBlack" transform="translate(0 30)" r="40" cx="10" cy="10" stroke="white" strokeWidth="4"></circle>
              </svg>
            </div>
            <div className="graphic-column">Love</div>
          </div>
          <div className="graphic-row">I am a Physicist</div>
        </div>
        
        <button className="app-button" id="btn-Convert-Html2Image">Chomp</button>
      </div>

    </div>
  );
};

export default Home;
