import React, { useState, useRef, useEffect } from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { SocketManager } from "../../components/SocketManager";
import { Grid, Paper, makeStyles } from "@material-ui/core";
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
  const [stream, setStream] = useState();
  const myVideo = useRef();
  const userVideo = useRef();
  const [callEnded, setCallEnded] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });
  }, []);
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <SocketManager
        setStream
        stream
        myVideo
        userVideo
        connectionRef
        setCallAccepted
        setCallEnded
      />
      {stream && (
        <Grid container className={classes.gridContainer}>
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
        </Grid>
      )}
      {callAccepted && !callEnded && (
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
      )}
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
    </div>
  );
};

export default AulaVirtual;
