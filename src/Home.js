import React, { useState } from "react";
import { app } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import "./Home.css";
import { IconButton } from "@material-ui/core";
import { Send } from "@material-ui/icons";

function Home() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");

  const [file, setFile] = useState("");
  const [key, setKey] = useState("");

  const upload = async () => {
    if (file == null && key == null) return;
    setUrl("Getting Download Link...");

    // Sending File to Firebase Storage
    app
      .storage()
      .ref(`/files/${file.name}`)
      .put(file)
      .on("state_changed", alert("Uploading"), alert, () => {
        // Getting Download Link
        app
          .storage()
          .ref("files")
          .child(file.name)
          .getDownloadURL()
          .then(async (url) => {
            setUrl(url);
            let code = uuidv4();
            await app.firestore().collection("urls").add({
              url: url,
              code: code,
              key: key,
            });

            //setCode(`https://hometask-a2f16.web.app/l/${code}`);
            setCode(`http://localhost:3000/l/${code}`);
          });
      });
  };

  return (
    <div>
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
        <input
          type="number"
          className="form-control"
          placeholder="Enter 6 Digit Secret Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <br />
        <button className="btn btn-primary" onClick={upload}>
          Submit
        </button>
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
        </div>
      )}
    </div>
  );
}

export default Home;
