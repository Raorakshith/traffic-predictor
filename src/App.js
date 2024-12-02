// import React, { useState } from "react";
// import TrafficForm from "./components/TrafficForm";
// import Map from "./components/Map";

// const App = () => {
//   const [predictionData, setPredictionData] = useState(null);

//   const handlePrediction = (data) => {
//     setPredictionData(data);
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
//       <h1 style={{ textAlign: "center", color: "#007bff" }}>Traffic Predictor</h1>
//       <TrafficForm onPrediction={handlePrediction} />
//       {predictionData && (
//         <div>
//           <h2>Predictions</h2>
//           <p>
//             <strong>Region:</strong> {predictionData.region}
//           </p>
//           <p>
//             <strong>Predicted Traffic (Next 2 Hours):</strong> {predictionData.predicted_traffic_next_2_hours}
//           </p>
//           <p>
//             <strong>Predicted Traffic (Next 5 Days):</strong> {predictionData.predicted_traffic_next_5_days}
//           </p>
//           <h2>Alternate Route</h2>
//           <p>{predictionData.alternate_route}</p>
//           <Map latitude={predictionData.latitude} longitude={predictionData.longitude} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import TrafficForm from "./components/TrafficForm";
import Map from "./components/Map";

const App = () => {
  const [predictionData, setPredictionData] = useState(null);

  const handlePrediction = (data) => {
    setPredictionData(data);
  };

  const getBadgeVariant = (category) => {
    switch(category) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container style={{ padding: "20px", maxWidth: "1200px" }}>
      <h1 className="text-center mb-4" style={{ color: "#007bff" }}>
        Traffic Predictor
      </h1>
      
      <TrafficForm onPrediction={handlePrediction} />
      
      {predictionData && (
        <Row className="mt-4">
          <Col md={8}>
            <Card>
              <Card.Header as="h2">Traffic Predictions</Card.Header>
              <Card.Body>
                <h3>{predictionData.region} Traffic Analysis</h3>
                
                {Object.entries(predictionData.predictions).map(([interval, prediction]) => (
                  <div key={interval} className="mb-3">
                    <h4>{interval.replace('_', ' ').toUpperCase()} Prediction</h4>
                    <p>
                      <strong>Volume:</strong> {prediction.volume} vehicles/hour
                      {' '}
                      <Badge 
                        bg={getBadgeVariant(prediction.category)}
                      >
                        {prediction.category}
                      </Badge>
                    </p>
                    <p><strong>Description:</strong> {prediction.description}</p>
                    <p><strong>Recommendation:</strong> {prediction.recommendation}</p>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Map 
              latitude={predictionData.latitude} 
              longitude={predictionData.longitude} 
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default App;