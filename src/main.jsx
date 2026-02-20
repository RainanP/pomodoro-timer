import React from "react";
import ReactDOM from "react-dom/client"; // Módulo que permite o react interagir com o DOM do navegador
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // Aqui estou importando o "roteador" do react router, que vai me
// permitir manipular as rotas

ReactDOM.createRoot(document.getElementById("root")).render(
  // Aqui em baixo nós usaremos este comando que vai criar o sistema de rotas, que vai ser criado em base no nosso App
  <BrowserRouter basename="/pomodoro-timer">
    <App />
  </BrowserRouter>,
);
