<<<<<<< HEAD
// dependencies
import { BrowserRouter as Router } from "react-router-dom";
// components
import AnimatedRoutes from "./Components/AnimatedRoutes.js";
=======
// components
import AnimatedRoutes from "./Components/AnimatedRoutes.js";
// dependencies
import { BrowserRouter as Router } from "react-router-dom";
>>>>>>> 4bd3f83ad926b0dbc195ab09bf43e40ac47b64d5

function App() {
  return (
    <Router>
      <main className='App'>
        <AnimatedRoutes />
      </main>
    </Router>
  );
}

export default App;
