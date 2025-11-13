import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import SearchPage from './pages/SearchPage';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header className="app-header">
            <div className="header-content">
              <h1>Bureau of Treasury</h1>
              <h2>Document Management System</h2>
            </div>
            <div className="user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={signOut} className="sign-out-button">
                Sign Out
              </button>
            </div>
          </header>
          <Router>
            <Routes>
              <Route path="/" element={<SearchPage user={user} />} />
            </Routes>
          </Router>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
