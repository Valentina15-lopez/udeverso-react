import routes from "./routes";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { useUserMedia } from './useUSerMedia';

//Majito: aca agregue lo del media antes solo se retornaba element
function App() {
  const element = useRoutes(routes);
  const { stream, error } = useUserMedia({ audio: true, video: true });
  
  return (
    <div className="App">
      <h1>Hello GetUserMedia</h1>
      {error ? (
        <p>error</p>
      ) : (
        <video
          autoPlay
          ref={video => {
            if (video) {
              video.srcObject = stream;
            }
          }}
        />
      )}
      {element}
    </div>
  );
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
