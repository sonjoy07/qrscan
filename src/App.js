import React, { useState, useRef } from 'react';
import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


function App() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState({ order_number: '', item_barcode: '', item: '' });
  const [scanResultWebCam, setScanResultWebCam] = useState({ order_number: '', item_barcode: '', item: '' });
  const [scanError, setScanError] = useState('');
  const [scanWebError, setScanWebError] = useState('');
  const classes = useStyles();
  const qrRef = useRef(null);


  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  }
  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = async (result) => {
    if (result) {
      let params = {
        'qr_data': result
      }
      let response = await axios.get('http://127.0.0.1:8000/api/qr_check', { params });
      if (response.data.status == true) {
        setScanResultFile(response.data.data)
        setScanError("")
      } else {
        setScanError("No Data Found")
        setScanResultFile({ order_number: '', item_barcode: '', item: '' });
      }
    } else {
      setScanError("No Data Found")
      setScanResultFile({ order_number: '', item_barcode: '', item: '' });
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam = async(result) => {
    if (result) {
      let params = {
        'qr_data': result
      }
      let response = await axios.get('http://127.0.0.1:8000/api/qr_check', { params });
      if (response.data.status == true) {
        setScanResultWebCam(response.data.data)
        setScanWebError("")
      } else {
        setScanWebError("No Data Found")
        setScanResultWebCam({ order_number: '', item_barcode: '', item: '' });
      }
    } else {
      setScanError("No Data Found")
      setScanResultWebCam({ order_number: '', item_barcode: '', item: '' });
    }
  }
  return (
    <Container className={classes.conatiner}>
      <Card>
        <h2 className={classes.title}>Generate Download & Scan QR Code with React js</h2>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <TextField label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
              <Button className={classes.btn} variant="contained"
                color="primary" onClick={() => generateQrCode()}>Generate</Button>
              <br />
              <br />
              <br />
              {imageUrl ? (
                <a href={imageUrl} download>
                  <img src={imageUrl} alt="img" />
                </a>) : null}
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <Button className={classes.btn} variant="contained" color="secondary" onClick={onScanFile}>Scan Qr Code</Button>
              <QrReader
                ref={qrRef}
                delay={300}
                style={{ width: '100%' }}
                onError={handleErrorFile}
                onScan={handleScanFile}
                legacyMode
              />
              <p>{scanError}</p>
              <h3>Order Number: {scanResultFile.order_number}</h3>
              <h3>Barcode: {scanResultFile.item_barcode}</h3>
              <h3>Item: {scanResultFile.item}</h3>
            </Grid>
            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
              <h3>Qr Code Scan by Web Cam</h3>
              <QrReader
                delay={300}
                style={{ width: '100%' }}
                onError={handleErrorWebCam}
                onScan={handleScanWebCam}
              />
              <p>{scanWebError}</p>
              <h3>Order Number: {scanResultWebCam.order_number}</h3>
              <h3>Barcode: {scanResultWebCam.item_barcode}</h3>
              <h3>Item: {scanResultWebCam.item}</h3>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  }
}));
export default App;