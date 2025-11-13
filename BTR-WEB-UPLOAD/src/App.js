import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import SearchPage from './pages/SearchPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator
      components={{
        Header() {
          return (
            <div className="auth-header">
              <div className="auth-logo">
                <div className="ph-seal">🇵🇭</div>
                <div className="auth-title">
                  <h1>Republic of the Philippines</h1>
                  <h2>Bureau of Treasury</h2>
                  <p>Document Management System</p>
                </div>
              </div>
            </div>
          );
        }
      }}
    >
      {({ signOut, user }) => (
        <div className="App">
          <Header user={user} signOut={signOut} />
          <main className="main-content">
            <Router>
              <Routes>
                <Route path="/" element={<SearchPage user={user} />} />
              </Routes>
            </Router>
          </main>
          <Footer />
        </div>
      )}
    </Authenticator>
  );
}

export default App;
