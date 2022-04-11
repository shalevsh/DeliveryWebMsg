import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory, useParams } from "react-router-dom";
import { app } from "./firebase";

function GoLink() {
  const { code } = useParams();
  const history = useHistory();

  const [fileLink, setFilelink] = useState("");
  const [key, setKey] = useState("");

  useEffect(() => {
    let query = app.firestore().collection("urls").where("code", "==", code);
    query.onSnapshot((data) => {
      if (data.empty) {
        return history.push("/");
      }
      console.log(data.docs);
      let finalData = data.docs[0].data();
      setFilelink(finalData);

      // window.location.replace(finalData.url);
    });
  }, []);

  const checkkey = () => {
    if (key !== "" && fileLink.key === key) {
      document.getElementById("input").style.display = "none";
      document.getElementById("result").style.display = "block";
    } else {
      document.getElementById("input").style.display = "block";
      document.getElementById("error").style.color = "red";
    }
  };

  return (
    <div id="home" className="container">
      <div>
        <div id="result" style={{ display: "none" }}>
          <h1>Your File Is Ready To Download</h1>

          <center>
            <a href={fileLink.url} className="btn btn-success" target="_blank">
              Download
            </a>
          </center>
        </div>

        <div id="input">
          <h1 id="error">Please Enter Valid Key To Download File</h1>

          <input
            type="number"
            className="form-control"
            placeholder="Enter 6 Digit Secret Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <br />
          <center>
            <button className="btn btn-primary" onClick={() => checkkey()}>
              Submit
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default GoLink;
