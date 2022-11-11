import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  ListSubheader,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import "./MainInterface.css";

function MainInterface() {
  const [results, setResults] = useState({
    activeButtonId: 0,
    status: false,
    data: [],
    msg: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onButtonsClick = (buttonId) => {
    setIsLoading(true);
    setResults({ activeButtonId: buttonId, data: [], status: false, msg: "" });
    fetch("http://localhost:8000/api/fetch-movies/" + buttonId)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res?.length) {
          setResults({
            activeButtonId: buttonId,
            data: res,
            status: true,
            msg: "",
          });
        } else {
          setResults({
            activeButtonId: buttonId,
            data: [],
            status: false,
            msg: "No Data Found!",
          });
        }
      })
      .catch((err) => {
        setResults({
          activeButtonId: 0,
          data: [],
          status: false,
          msg: err.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Paper sx={{ background: "rgba(255,255,255,.4)", marginTop: "10px" }}>
        <Grid
          className="buttonGrid"
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: "10px 0" }}
        >
          <Grid sx={{ width: "calc(100% - 20px)" }}>
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              className="buttonGroup"
              sx={{ background: "#fff", width: "100%" }}
            >
              <Button
                color="success"
                variant={results.activeButtonId === 1 ? "contained" : "text"}
                onClick={() => onButtonsClick(1)}
                className="button"
              >
                Matrix
              </Button>
              <Button
                color="success"
                variant={results.activeButtonId === 2 ? "contained" : "text"}
                onClick={() => onButtonsClick(2)}
                className="button"
              >
                Matrix Reloaded
              </Button>
              <Button
                color="success"
                variant={results.activeButtonId === 3 ? "contained" : "text"}
                onClick={() => onButtonsClick(3)}
                className="button"
              >
                Matrix Revolutions
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={3}
        className="resultBox"
        sx={{ background: "rgba(255,255,255,.4)" }}
      >
        <Box className="resultWrapper">
          {isLoading && (
            <Box>
              <LinearProgress color="success" />
              <Typography align="center" marginTop={1}>
                Loading...
              </Typography>
            </Box>
          )}

          {isLoading === false &&
            results.status === false &&
            results.msg === "" &&
            results.data?.length === 0 && (
              <Alert severity="info">
                Please click any buttons to fetch data!
              </Alert>
            )}

          {isLoading === false &&
            results.status === false &&
            results.msg !== "" &&
            results.data?.length === 0 && (
              <Alert severity="error">{results.msg}</Alert>
            )}

          {isLoading === false &&
            results.status === true &&
            results.msg === "" &&
            results.data?.length > 0 && (
              <ImageList cols={5}>
                {results.data.map((item) => (
                  <ImageListItem
                    sx={
                      item.poster === "N/A" || !item.poster
                        ? { border: "1px solid #ddd", padding: "5px" }
                        : {}
                    }
                    cols={1}
                    key={item.poster}
                  >
                    <img
                      src={`${item.poster}?w=248&fit=crop&auto=format`}
                      srcSet={`${item.poster}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.title}
                      loading="lazy"
                    />
                    <ImageListItemBar title={item.title} subtitle={item.year} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
        </Box>
      </Paper>
    </>
  );
}

export default MainInterface;
