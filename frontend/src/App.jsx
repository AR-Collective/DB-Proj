import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const serverUrl = 'http://localhost:3000'

async function sendD(formData) {
  const data = {
    username: formData.get('username'),
    password: formData.get('password')
  }
  try {
    const response = await fetch(serverUrl + '/auth/login',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);

  } catch (error) {
    console.error('Error sending data:', error);
  }
}


export default function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <form action={sendD}>
        <input name='username' onChange={e => setUsername(e.target.value)} />
        <br />
        <input
          type="password"
          name="password"
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{username}</p>
    </>
  )
}

