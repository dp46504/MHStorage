import React, { useState } from "react";
import QrReader from "react-weblineindia-qrcode-scanner";

function Home(props) {
  //eslint-disable-next-line
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
        facingMode="rear"
      />
      <p>{result}</p>
    </div>
  );
}

export default Home;
