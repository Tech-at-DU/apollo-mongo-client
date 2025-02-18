import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';

// Get some dependencies from Apollo Client
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
// Create an instance of the Apollo client
export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Set your GraphQL endpoint
  cache: new InMemoryCache()            // We'll use this inmemory cache
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
