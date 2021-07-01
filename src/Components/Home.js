import React, { useState } from "react";
import QrReader from "react-weblineindia-qrcode-scanner";

function Home(props) {
  let [delay, setDelay] = useState(100);
  let [result, setResult] = useState("Not result");

  let handleScan = (data) => {
    setResult(data);
  };

  let handleError = (err) => {
    alert(err);
  };

  return (
    <div>
      <QrReader
        delay={delay}
        style={{ height: 240, width: 320 }}
        onError={handleError}
        onScan={handleScan}
      />
      <p>{result}</p>
    </div>
  );
}

export default Home;
