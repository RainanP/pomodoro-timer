import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Principal() {
  // ── States ──────────────────────────────────────────────
  const [VarLogar, setVarLogar] = useState(false);
  const [tempoFoco, setTempoFoco] = useState(15);
  const [tempoDescanso, setTempoDescanso] = useState(5);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const [level, setLevel] = useState(0);
  const [progresso, setProgesso] = useState(0);
  const [estado, setEstado] = useState(true);
  const [start, setStart] = useState(false);
  const token = localStorage.getItem("token");

  // ── Alterna entre foco e descanso ao fim do timer ────────
  function reiniciar() {
    if (timer <= 0) {
      if (estado == true) {
        fetch("http://localhost:8080/datatime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cronometro: tempoFoco * 60 * 1000,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.aprovado == false) {
              alert(data.mensagem);
            } else if (data.aprovado == true) {
              setTimer(tempoFoco * 60);
              setEstado(false);
              setStart(true);
            }
          });
      } else {
        fetch("http://localhost:8080/verifycronos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.body);
            if (data.aprovado == false) {
              alert(data.mensagem);
            } else if (data.aprovado == true) {
              console.log(data);
              setLevel(data.lvl);
              setProgesso(data.barra);
              setTimer(tempoDescanso * 60);
              setEstado(true);
            }
          });
      }
    }
  }

  // Trazer o level do backend para o frontend
  useEffect(() => {
    fetch("http://localhost:8080/level", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.aprovado == false) {
          return;
        } else if (data.aprovado == true) {
          console.log(data.lvl);
          console.log(data.barra);
          setLevel(data.lvl);
          setProgesso(data.barra);
        }
      });
  }, []);

  // ── Contagem regressiva do timer ─────────────────────────
  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const intervalo = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [timer]);

  // ── Formata o timer em minutos e segundos ────────────────
  const minutos = Math.floor(timer / 60);
  const segundos = timer % 60;

  // ── Verifica se o usuário está logado ────────────────────
  useEffect(() => {
    if (token === null) {
      setVarLogar(true);
    }
  }, []);

  // ── Inicia o timer e registra no banco de dados ──────────
  function iniciar() {
    fetch("http://localhost:8080/datatime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cronometro: tempoFoco * 60 * 1000,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.aprovado == false) {
          alert(data.mensagem);
        } else if (data.aprovado == true) {
          setTimer(tempoFoco * 60);
          setEstado(false);
          setStart(true);
        }
      });
  }

  // ── Navegação entre páginas ──────────────────────────────
  function pageRegistro() {
    navigate("/registro");
  }

  function pageLogin() {
    navigate("/login");
  }

  useEffect(() => {
    if (timer == 0) {
      document.title = "pomodoro-timer";
    } else {
      document.title = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
    }
  }, [minutos, segundos]);

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen relative flex flex-col items-center">
      {/* Aviso de usuário não logado */}
      {VarLogar && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white h-20 w-80 rounded-2xl flex items-center justify-center z-50 shadow-lg">
          <p className="font-bold text-[20px]">Você não está logado!</p>
        </div>
      )}

      {/* Botões de registro e login */}
      <header className="fixed top-4 right-4 flex gap-4 z-50">
        <button
          onClick={pageRegistro}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Registrar
        </button>
        <button
          onClick={pageLogin}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Logar
        </button>
      </header>

      <div className="flex flex-col items-center justify-center mt-20">
        {/* Inputs de tempo — visíveis apenas antes de iniciar */}
        <div className="flex gap-6 mb-6">
          <label className="flex flex-col items-center text-gray-600 font-semibold">
            Foco (min)
            <input
              type="number"
              min="1"
              max="60"
              value={tempoFoco}
              onChange={(e) => setTempoFoco(Number(e.target.value))}
              className="mt-1 w-20 text-center border border-gray-300 rounded-lg px-2 py-1 text-lg"
            />
          </label>
          <label className="flex flex-col items-center text-gray-600 font-semibold">
            Descanso (min)
            <input
              type="number"
              min="1"
              max="60"
              value={tempoDescanso}
              onChange={(e) => setTempoDescanso(Number(e.target.value))}
              className="mt-1 w-20 text-center border border-gray-300 rounded-lg px-2 py-1 text-lg"
            />
          </label>
        </div>

        {/* Descrição do estado atual */}
        <p className="text-lg text-gray-600 mb-8">
          {start == false
            ? `${tempoFoco} minutos de foco · ${tempoDescanso} minutos de descanso`
            : estado == false
              ? `${tempoFoco} minutos de foco`
              : `${tempoDescanso} minutos de descanso`}
        </p>

        {/* Cronômetro */}
        <h1 className="text-8xl mb-12">
          {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")}
        </h1>

        {/* Botão de iniciar / reiniciar */}
        <button
          onClick={start === false ? iniciar : reiniciar}
          className="px-12 py-4 bg-blue-500 text-white text-2xl font-bold rounded-2xl hover:bg-blue-600 transition mb-12 shadow-lg"
        >
          Start
        </button>

        {/* Barra de progresso de level */}
        <div className="h-10 w-80 bg-gray-700 rounded-3xl relative overflow-hidden flex items-center justify-center">
          <p className="font-bold text-white z-10">Level {level}</p>
          <div
            className="h-full bg-green-500 absolute left-0 top-0 transition-all duration-100"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>
    </div>
  );
}
export default Principal;
