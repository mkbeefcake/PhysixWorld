import { useEffect } from "react";
import { Box } from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { auth, storage } from "../config/firebase";
import domtoimage from 'dom-to-image';
import { useState } from "react";
import { getDownloadURL, ref as storageRef, uploadString } from "firebase/storage";

const Home = (props) => {
  var svg;
  var selectedElement, offset, transform, bbox, minX, maxX, minY, maxY, confined;

  var boundaryX1 = 20;
  var boundaryX2 = 180;
  var boundaryY1 = -130;
  var boundaryY2 = 130;

  const [dragableImage, setDragableImage] = useState();
  const [subject, setSubject] = useState("Default");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    svg = document.getElementById('physixSvg');
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

    if (!auth.currentUser) {
      signInAnonymously(auth).then(result => {
        const user = result.user;
        console.log(`signed anonymously ${user.uid}`)
        setUserId(user.uid);
      })
    }
    
    fetch('logo192.png')
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataUrl = reader.result;
          setDragableImage(dataUrl);
        };
      });    

  }, []); 

  const getMousePosition = (evt) => {
    var CTM = svg.getScreenCTM();
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
        var translate = svg.createSVGTransform();
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

  const onChomp = () => {
    console.log(`onchomp() is called`);

    const appWrapper = document.getElementById('html-content-holder');  
    domtoimage.toPng(appWrapper)
      .then(function(dataUrl) {
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = "result.png";
        link.click();

        // upload to firebase storage
        debugger;
        // const timestamp = new Date().getTime();    
        // const name = `${subject}/${userId}/${timestamp}.png`;
        const name = `votes/${subject}/${userId}.png`;
        const imageRef = storageRef(storage, name);
        uploadString(imageRef, dataUrl, 'data_url')
        .then(snapshot => {
          getDownloadURL(snapshot.ref)
          .then(url => {
            console.log(`Downloadable URL : ${url}`)
          })
        })
        .catch(err => {
          console.log(`Not uploaded.`)
        })
      })
     
  }
 

  return (
    <div style={{backgroundColor: "black", color:"white", height:"100vh"}}>
      <div style={{ textAlign:"center" }}>
        <big><big><big><big>
        <span style={{ fontWeight:"bold", fontFamily:"Courier New", Color: "white"}}>Chompsky Box
          <br/>
          2D Dialectic
        </span>
        </big></big></big></big>
        <br/>
      </div>
      <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
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
                  {/* <circle class="draggable" id="IpBlack" transform="translate(0 30)" r="40" cx="10" cy="10" stroke="white" stroke-width="4"></circle> */}
                  <image className="draggable" id="IpBlack" xlinkHref={dragableImage} alt="logo" width="60" height="60" radius={30}/> 
                </svg>
              </div>
              <div className="graphic-column">Love</div>
            </div>
            <div className="graphic-row">I am a Physicist</div>
          </div>
          
          <button className="app-button" id="btn-Convert-Html2Image" onClick={onChomp} >Chomp</button>
        </div>
      </div>

    </div>
  );
};

export default Home;
