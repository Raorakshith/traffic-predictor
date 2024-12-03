import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";

const TrafficForm = ({ onPrediction }) => {
  const [formData, setFormData] = useState({
    region: "",
    latitude: "",
    longitude: "",
    currentTrafficData: "100,120,110",
    weatherData: "",
    trafficData: "",
    news: [],
  });

  const [regions] = useState([
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
    { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegionChange = async (e) => {
    const selectedRegion = regions.find(
      (region) => region.name === e.target.value
    );
    if (selectedRegion) {
      const { name, latitude, longitude } = selectedRegion;
      setFormData({ ...formData, region: name, latitude, longitude });
      setLoading(true);
      setError(null);

      try {
        // Fetch Weather Data
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=4b3120747b9ef1f222316cf9cf47bd7a`
        );
        const weatherData = weatherResponse.data;
        setFormData((prevState) => ({
          ...prevState,
          weatherData: JSON.stringify({
            temperature: (weatherData.main.temp - 273.15).toFixed(2), // Convert Kelvin to Celsius
            condition: weatherData.weather[0].description,
          }),
        }));

        // Fetch Traffic Data
        const trafficResponse = await axios.get(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${latitude},${longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
        );
        const trafficData = trafficResponse.data;
        setFormData((prevState) => ({
          ...prevState,
          trafficData: JSON.stringify({
            speed: trafficData.flowSegmentData.currentSpeed,
            freeFlowSpeed: trafficData.flowSegmentData.freeFlowSpeed,
            congestionLevel: trafficData.flowSegmentData.confidence,
          }),
        }));

        // Fetch News
        const newsResponse = await axios.get(
          `https://api.bing.microsoft.com/v7.0/news/search?q=${name}&count=5`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "5d37de4bda40423b8904c2a8fcc2b755",
            },
          }
        );
        const news = newsResponse.data.value.map((article) => ({
          title: article.name,
          url: article.url,
        }));
        setFormData((prevState) => ({
          ...prevState,
          news: news,
        }));
      } catch (err) {
        setError("Error fetching data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.post("http://localhost:5000/predict_lstm", {
  //       ...formData,
  //       currentTrafficData: formData.currentTrafficData.split(",").map(Number),
  //     });

  //     onPrediction({
  //       region: formData.region,
  //       latitude: formData.latitude,
  //       longitude: formData.longitude,
  //       predictions: response.data.predictions,
  //     });
  //   } catch (err) {
  //     setError("Error predicting traffic. Please try again.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Send the data to the server for prediction
      const response = await axios.post("http://localhost:5000/predict_lstm", {
        ...formData,
        currentTrafficData: formData.currentTrafficData.split(",").map(Number),
      });
  
      // Get the prediction data
      const predictionData = response.data.predictions;
  
      // Fetch the current traffic data for the region (example: traffic data fetched earlier)
      const trafficResponse = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${formData.latitude},${formData.longitude}&key=5QpZLwcTD1Gz8dJ0O7o1u9vGokfRF1Og`
      );
      const trafficData = trafficResponse.data.flowSegmentData;
  
      // Calculate the new volumes based on traffic data
      const adjustedPredictions = Object.entries(predictionData).reduce((acc, [interval, prediction]) => {
        // Assuming trafficData.speed and freeFlowSpeed are available for calculation
        const adjustmentFactor = trafficData.currentSpeed / trafficData.freeFlowSpeed;
        const updatedVolume = prediction.volume * adjustmentFactor;
  
        acc[interval] = {
          ...prediction,
          volume: updatedVolume, // Adjusted volume based on the current traffic data
        };
        return acc;
      }, {});
  
      // Pass the adjusted predictions to the parent component
      onPrediction({
        region: formData.region,
        latitude: formData.latitude,
        longitude: formData.longitude,
        predictions: adjustedPredictions,
      });
    } catch (err) {
      setError("Error predicting traffic. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container
      className="my-5 p-4 rounded shadow"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <h2 className="text-center mb-4 text-primary">Traffic Prediction</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Region</Form.Label>
              <Form.Select onChange={handleRegionChange} required>
                <option value="">Select a region</option>
                {regions.map((region) => (
                  <option key={region.name} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                value={formData.latitude}
                readOnly
                placeholder="Latitude"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                value={formData.longitude}
                readOnly
                placeholder="Longitude"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Traffic Data</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.trafficData}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Weather Data</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.weatherData}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Top 5 News</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.news
              .map((news) => `${news.title} (${news.url})`)
              .join("\n")}
            readOnly
          />
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Predict Traffic"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default TrafficForm;
