import React, { useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { TextField } from "@mui/material";
import { db } from "../../config/firebase";
import { doc, setDoc } from 'firebase/firestore';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const Dashboard = () => {

  const canvasRef = useRef(null);
  const [open, setOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState();
  const [content, setContent] = useState();
  const [description, setDescription] = useState();
  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();
  const [left, setLeft] = useState();
  const [right, setRight] = useState();

  const addNewTopic = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = async () => {
    setOpen(false);

    debugger;
    const topicData = {
      name, content, description, top, bottom, left, right      
    }
    
    const timestamp = new Date().getTime().toString();

    // upload topics
    await setDoc(doc(db, "topics", timestamp), topicData);
  }

  const handleFileChange = (e) => {

    setSelectedFile(e.target.files[0]);    
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      img.src = event.target.result;
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleTop = (e) => {
    setTop(e.target.value)
  }

  const handleBottom = (e) => {
    setBottom(e.target.value)
  }

  const handleLeft = (e) => {
    setLeft(e.target.value)
  }

  const handleRight = (e) => {
    setRight(e.target.value)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open="true">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, ...({ display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Votes
          </Typography>
        </Toolbar>
      </AppBar>
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
        <DrawerHeader style={{justifyContent: "flex-start", background: "#1976d2", color: "white"}}>
          <Typography variant="h6" noWrap component="div">
              Topics
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {['Add new Topic'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={addNewTopic}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div>
        <DrawerHeader />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
      </div>
      <Dialog
        onClose={handleClose}
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add new Topics
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <TextField 
            fullWidth
            id="topic-name"
            label="Name of topic"
            variant="standard"
            value={name}
            margin="dense"
            onChange={handleNameChange}
          />
          <TextField 
            fullWidth
            id="topic-content"
            label="Content"
            variant="standard"
            value={content}
            margin="dense"
            onChange={handleContentChange}
          />
          <TextField 
            fullWidth
            id="topic-description"
            label="Description"
            variant="standard"
            value={description}
            margin="dense"
            onChange={handleDescriptionChange}
          />
          <TextField 
            id="topic-top"
            label="Top"
            variant="standard"
            value={top}
            margin="dense"
            style={{marginRight: 20}}
            onChange={handleTop}
          />
          <TextField 
            id="topic-bottom"
            label="Bottom"
            variant="standard"
            value={bottom}
            margin="dense"
            onChange={handleBottom}
          />
          <TextField 
            id="topic-left"
            label="Left"
            variant="standard"
            value={left}
            margin="dense"
            style={{marginRight: 20}}
            onChange={handleLeft}
          />
          <TextField 
            id="topic-right"
            label="Right"
            variant="standard"
            value={right}
            margin="dense"
            onChange={handleRight}
          />
          <div style={{ marginTop: 12 }}>
            <input type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"/>
          </div>
          <div>
            <canvas ref={canvasRef} width={300} height={200} />
          </div>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save Topic
          </Button>
        </DialogActions>
      </Dialog>1


    </Box>
  )
}

export default Dashboard;