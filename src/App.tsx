import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

function App() {
  const [count, setCount] = useState(0);

  // const webPush = async (text: any) => {
  //   const registration = await navigator.serviceWorker.ready;
  //   console.log(registration);
  //   registration.showNotification('웹푸쉬', { body: text });
  // };

  useEffect(() => {
    getNoty();
  }, []);

  async function getNoty() {
    await supabase
      .channel('*')
      .on('postgres_changes', { event: '*', schema: '*' }, async (payload) => {
        if (payload.table === 'noty') {
          // const data: any = payload.new;
          if (payload.new) {
            console.log(payload);
            // webPush(payload.new.text);
          }
        }
      })
      .subscribe();
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
