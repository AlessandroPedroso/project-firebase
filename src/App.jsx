import { db } from "./services/firebaseConnection.js";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import "./app.css";
import { useState } from "react";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  async function handleAdd() {
    // const docRef = doc(db, "posts", "12345");
    // await setDoc(docRef, {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("DADOS REGISTRADO NO BANCO");
    //   })
    //   .catch((error) => {
    //     console.log("GEROU ERRO" + error);
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("DADOS REGISTRADO NO BANCO");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("GEROU ERRO" + error);
      });
  }

  async function buscarPost() {
    const postRef = doc(db, "posts", "kVGJ61Ta13aHMDFVFCmk");
    await getDoc(postRef)
      .then((snapshot) => {
        setAutor(snapshot.data().autor);
        setTitulo(snapshot.data().titulo);
      })
      .catch((error) => {
        console.log("GEROU ERRO" + error);
      });
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>
      <div className="container">
        <label>Titulo:</label>
        <textarea
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Digite o titulo"
        />

        <label>Autor:</label>
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Autor do post"
        ></input>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button>
      </div>
    </div>
  );
}

export default App;
