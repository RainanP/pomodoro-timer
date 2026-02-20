import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Biblioteca usada para mudarmos a nossa página

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate(); // Declarando a nossa biblioteca para uma variável

  function Submit(e) {
    e.preventDefault(); // Impede o recarregamento da página
    fetch("http://localhost:8080/registro", {
      // Conectando ao site onde está o banco de dados
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json()) // Quando o servidor responde, ele pega a response e transforma em json
      .then((data) => {
        // Aqui trabalha com os dados json da response
        setResponse(data["mensagem"]);
        if(data.mensagem == "Registrado com sucesso!"){
          localStorage.setItem("token", data.token);
          navigate("/main"); // Troca de página
        }
      })
      .catch((error) => {
        // Se der algum erro, será tratado aqui
        setResponse("erro: " + error);
      });
  }

  return (
    <div className="bg-white w-150 h-150 rounded-4xl">
      <h1 className="pt-10 font-bold text-5xl">REGISTRO</h1>
      <form onSubmit={Submit} className="mt-20">
        <label id="email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // o onchange vai ser ativado sempre que qualquer valor for mudado no input
            // o "e" é o evento, ele carrega uma lista de valores do que acabou de acontecer, o target é um item desse dicionário
            // o target está apontando para o item do evento, e o value, pega o valor desse item, que no caso é o password
            required
            placeholder="Digite Seu E-mail"
            className="registerForm"
          />
        </label>
        <label id="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // o onchange vai ser ativado sempre que qualquer valor for mudado no input
            // o "e" é o evento, ele carrega uma lista de valores do que acabou de acontecer, o target é um item desse dicionário
            // o target está apontando para o item do evento, e o value, pega o valor desse item, que no caso é o password
            required
            placeholder="Digite sua senha"
            className="registerForm"
          />
        </label>
        <label id="rePassword">
          <input
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)} // o onchange vai ser ativado sempre que qualquer valor for mudado no input
            // o "e" é o evento, ele carrega uma lista de valores do que acabou de acontecer, o target é um item desse dicionário
            // o target está apontando para o item do evento, e o value, pega o valor desse item, que no caso é o password
            required
            placeholder="Repita sua senha"
            className="registerForm"
          />
        </label>
        <p>{password != rePassword && "As senhas não coincidem."}</p>
        <label>
          <button
            type="submit"
            className="w-60 border-2 border-black mt-15 rounded-2xl h-10 font-bold cursor-pointer scale-100 hover:scale-105"
            disabled={password != rePassword}
          >
            CADASTRAR
          </button>
          <p>{response}</p>
        </label>
      </form>
    </div>
  );
}

export default Register;
