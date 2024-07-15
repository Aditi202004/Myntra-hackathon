import App from "./components/App";
import React from "react";
import { createRoot } from 'react-dom/client';

console.log("here");
createRoot(document.getElementById('app')).render(<App/>)