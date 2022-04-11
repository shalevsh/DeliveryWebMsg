import React, { useState } from "react";
import { app } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import "./Home.css";
import { IconButton } from "@material-ui/core";
import { Send } from "@material-ui/icons";
function randomString(length = 6) {
  const chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
let loadingInterval = null;

function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");

  const [file, setFile] = useState("");
  const [key, setKey] = useState("");
  const [loadingText, setLoadingText] = useState("");

  const startLoading = () => {
    console.log("here");
    setLoadingText("Loading.");
    loadingInterval = setInterval(() => {
      setLoadingText((prev) => {
        let loadingStr = prev + ".";
        if (loadingStr == "Loading....") loadingStr = "Loading.";
        console.log("in interval", loadingStr);
        return loadingStr;
      });
    }, 500);
  };

  const stopLoading = () => {
    setLoadingText("");
    console.log("interval", loadingInterval);
    clearInterval(loadingInterval);
  };

  const upload = async () => {
    if (file == null && key == null) return;
    setUrl("Getting Download Link...");
    // Sending File to Firebase Storage
    startLoading();
    app
      .storage()
      .ref(`/files/${file.name}`)
      .put(file)
      .on("state_changed", null, null, () => {
        // Getting Download Link

        app
          .storage()
          .ref("files")
          .child(file.name)
          .getDownloadURL()
          .then(async (url) => {
            setUrl(url);
            let code = uuidv4();
            let key = randomString();
            setKey(key);

            console.log(code);
            await app.firestore().collection("urls").add({
              url: url,
              code: code,
              key: key,
            });

            setCode(`https://hometask-a2f16.web.app/l/${code}`);
            //setCode(`http://localhost:3000/l/${code}`);
            stopLoading();
          });
      });
  };

  return (
    <div id="home">
      <div className="home__center">
        <h1>Upload File</h1>
      </div>
      <div className="container">
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <br />
        <center>
          <button className="btn btn-primary" onClick={upload}>
            Submit
          </button>
        </center>
      </div>
      <br />
      <br />
      {code !== "" && (
        <div>
          <h2>Here Is Your Url</h2>
          <h3>
            <a href={code} target="_blank">
              {code}
            </a>
          </h3>
          {key != "" && <h2>your random key is {key}</h2>}
        </div>
      )}
      {loadingText != "" && <h1>{loadingText}</h1>}
    </div>
  );
}

export default Home;
