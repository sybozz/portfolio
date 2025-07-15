import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTimeDate = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      const formattedDate = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateTimeDate(); // initial
    const interval = setInterval(updateTimeDate, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Hello, I'm Sharif Ahmed!</h1>
      <p>Welcome to my demo frontend application built with React.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, quam molestias? Nesciunt est maiores architecto tempore illum culpa asperiores ab, consectetur fuga laudantium nisi ea accusantium? Excepturi corrupti repellendus impedit?</p>
      <hr />
      <h4>{time} | {date}</h4>
    </div>
  );
}

export default App;