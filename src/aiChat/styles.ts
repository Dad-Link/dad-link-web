import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  wrapper: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    backgroundColor: "black",
    overflow: "hidden",
  },
  matrix: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    height: "90%",
    width: "90%",
    margin: "0 auto",
    backgroundColor: "rgba(34, 34, 34, 0.9)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  // Add more styles here as needed
};

