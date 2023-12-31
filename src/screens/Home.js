import { useEffect } from "react";
import { Box } from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { auth, storage, db } from "../config/firebase";
import { useState } from "react";
import { getDownloadURL, ref as storageRef, uploadString } from "firebase/storage";
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import domtoimage from 'dom-to-image';
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const Home = (props) => {
  var svg;
  var selectedElement, offset, transform, bbox, minX, maxX, minY, maxY, confined;

  var boundaryX1 = 20;
  var boundaryX2 = 180;
  var boundaryY1 = -130;
  var boundaryY2 = 130;

  const [dragableImage, setDragableImage] = useState();
  const [userId, setUserId] = useState("");
  const [topic, setTopic] = useState();
  const [topics, setTopics] = useState([]);
  const [curTopic, setCurTopic] = useState(null);

  const loadData = async () => {
    const querySnapshot = await getDocs(collection(db, "topics"));
    var _topics = [];
    querySnapshot.forEach((doc) => {
      _topics.push(doc.data());
    })

    _topics = _topics.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
    setTopics(_topics);
    setTopic(_topics[0])
  }

  const selectTopic = async (topic) => {
    debugger;
    setTopic(topic);

    fetch(topic?.iconUrl, { 
    })
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataUrl = reader.result;
          setDragableImage(dataUrl);
        };
      });    

  }

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
    else {
      setUserId(auth.currentUser.uid);
    }
    
    loadData();
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
      .then(async function(dataUrl) {
        var link = document.createElement('a');
        link.href = dataUrl;
        link.download = "result.png";
        link.click();

        const physixSvg = document.getElementById('physixSvg');
        const IpBlack = document.getElementById('IpBlack');
        const boundingBox = physixSvg.getBoundingClientRect();
        const boundingIp = IpBlack.getBoundingClientRect();
        const centerXOfBoundingIp = boundingIp.left - boundingBox.left;  // + boundingIp.width / 2
        const centerYOfBoundingIp = boundingIp.top  - boundingBox.top; // + boundingIp.height / 2

        console.log(`${boundingBox.width}, ${boundingBox.height}, ${centerXOfBoundingIp}, ${centerYOfBoundingIp}, ${boundingIp.width}, ${boundingIp.height}`);

        let content = {}
        content[userId] = {
          width: boundingBox.width,
          height: boundingBox.height,
          posX: centerXOfBoundingIp,
          posY: centerYOfBoundingIp,
          imgWidth: boundingIp.width,
          imgHeight: boundingIp.height
        };

        // upload data to firestore
        debugger;
        const docRef = doc(db, `votes`, topic.timestamp);
        const _doc = await getDoc(docRef);
        if (_doc.exists())
          await updateDoc(docRef, content);
        else
          await setDoc(docRef, content);

        // upload to firebase storage
        // debugger;
        // const name = `votes/${topic.timestamp}/${userId}.png`;
        // const imageRef = storageRef(storage, name);
        // uploadString(imageRef, dataUrl, 'data_url')
        //   .then(snapshot => {
        //     getDownloadURL(snapshot.ref)
        //     .then(url => {
        //       console.log(`Downloadable URL : ${url}`)
        //     })
        //   })
        //   .catch(err => {
        //     console.log(`Not uploaded.`)
        //   })
      })
     
  }

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));
    

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open="true"
      >
        <DrawerHeader style={{justifyContent: "flex-start", background: "black", color: "white"}}>
          <Typography variant="h6" noWrap component="div">
              Topics
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {topics.map((content, index) => (
            <ListItem key={index} disablePadding selected={content.timestamp === topic.timestamp}>
              <ListItemButton onClick={() => selectTopic(content)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={content.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <div style={{backgroundColor: "black", color:"white", height:"100vh", width: "100%"}}>
        <div style={{ textAlign:"center" }}>
          <big><big><big><big>
          <span style={{ fontWeight:"bold", fontFamily:"Courier New", Color: "white"}}>Chompsky Box
            <br/>
            {topic?.content}
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
                alt="Loading topic....."
                src={topic?.url}
                style={{border: "2px white solid"}}
              />          
              <figcaption>{topic?.description}</figcaption>
            </figure>

            <div className="graphic-wrapper">
              <div className="graphic-row">{topic?.top}</div>
              <div className="graphic-row">
                <div className="graphic-column">{topic?.left}</div>
                <div className="graphic-column graphic-border">
                  <svg id="physixSvg" width="250" height="250" className="supra-gradient" viewBox="0 0 250 250">
                    {/* <circle class="draggable" id="IpBlack" transform="translate(0 30)" r="40" cx="10" cy="10" stroke="white" stroke-width="4"></circle> */}
                    <image className="draggable" id="IpBlack" xlinkHref={dragableImage} alt="logo" width="60" height="60" radius={30}/> 
                  </svg>
                </div>
                <div className="graphic-column">{topic?.right}</div>
              </div>
              <div className="graphic-row">{topic?.bottom}</div>
            </div>
            
            <button className="app-button" id="btn-Convert-Html2Image" onClick={onChomp} >Chomp</button>
          </div>
        </div>

      </div>
    </Box>
  );
};

export default Home;
