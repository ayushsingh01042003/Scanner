import React from 'react'
import './index.css'
import Report from './components/Report'

const App = () => {
  const response = {
    "src/Main.java": {
      "ssn": ["123-45-6789", "987-65-4321"],
      "creditCard": ["4111-1111-1111-1111"]
    },
    "src/utils/Helper.js": {
      "ssn": ["111-22-3333"],
      "creditCard": ["5555-5555-5555-4444"]
    },
    "public/index.html": {
      "email": ["example@example.com"]
    },
    "config/settings.json": {
      "apiKey": ["AIzaSyD4EXAMPLE"]
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Report data={response} />
    </div>
  )
}

export default App