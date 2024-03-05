import React, { useState, useRef, useEffect, useContext } from "react";
import AulaScene from "../../components/AulaScene";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { Canvas } from "@react-three/fiber";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../../components/SocketManager";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "300px",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    padding: "10px",
    border: "2px solid black",
    margin: "10px",
  },
}));
const AulaVirtual = () => {
  const classes = useStyles();
  const { me, callUser, userVideo, stream, setStream } =
    useContext(SocketContext);
  const myVideo = useRef();

  const [idToCall, setIdToCall] = useState("");
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current = currentStream;
      });
  }, []);
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <CopyToClipboard text={me} className={classes.margin}>
        <Button variant="contained" color="primary" fullWidth>
          Copy Your ID
        </Button>
      </CopyToClipboard>
      <TextField
        label="ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => callUser(idToCall)}
        className={classes.margin}
      >
        Call
      </Button>
      <Grid container className={classes.gridContainer}>
        {stream && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className={classes.video}
              />
            </Grid>
          </Paper>
        )}
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className={classes.video}
            />
          </Grid>
        </Paper>
      </Grid>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
    </div>
  );
};

export default AulaVirtual;
