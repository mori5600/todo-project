import { useState } from "react";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <main>
        <Container>
          <div className="card">
            <Button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}

export default App;
