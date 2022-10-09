import React from "react";
import Typical from "react-typical";

const typicalStyle = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "500",
    color: "#33bcb7",
};

function Loading(props) {
    return (
        <div style={typicalStyle}>
            <Typical
                steps={["", 1000, "Loading...", 3000]}
                loop={Infinity}
                wrapper="p"
            />
        </div>
    );
}

export default Loading;
