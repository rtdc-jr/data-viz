import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';

const el = document.getElementById('app');

if (el) {
    ReactDOM.createRoot(el).render(<Dashboard />);
}