import { forwardRef, useState, useImperativeHandle } from "react";
import { Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  if (!props.buttonLabel) {
    props.buttonLabel = "show";
  }

  if (!props.buttonLabel) {
    props.buttonLabel = "cancel";
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box sx={{ mb: 2 }}>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="success" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant="text"
          color="secondary"
          onClick={toggleVisibility}
          sx={{ mt: 1 }}
        >
          {props.buttonLabel2 || "cancel"}
        </Button>
      </div>
    </Box>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
