import { db, auth } from "./services/firebaseConnection.js";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./app.css";
import { useState, useEffect } from "react";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    // onSnapshot fica verificando o banco caso sofra uma alteração muda na hora
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listapost = [];

        snapshot.forEach((doc) => {
          listapost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listapost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // console.log(user);
          // se tem usuario logado ele entra aqui...
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          // não possui nenhum user logado.
          setUser(false);
          setUserDetail({});
        }
      });
    }

    checkLogin();
  }, []);

  // cadastra um post
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

  //busca todos os posts cadastrados
  async function buscarPost() {
    /* BUSCA 1 POST */
    // const postRef = doc(db, "posts", "kVGJ61Ta13aHMDFVFCmk");
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch((error) => {
    //     console.log("GEROU ERRO" + error);
    //   });
    /* BUSCA UMA COLEÇÃO DE POSTS */
    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //edita um post pelo idPosto digitado no input
  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch(() => {
        console.log("ERRO AO ATAUALIZAR O POST");
      });
  }

  //cria um usuário no autenticate do firebase
  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("CADASTRADO COM SUCESSO!");
        console.log(value);
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        console.log("ERRO AO CADASTRAR");
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
      });
  }

  //excluir post
  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef).then(() => {
      alert("POST DELETADO COM SUCESSO!");
    });
  }

  //logar Usuario
  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO");
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });

        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch(() => {
        console.log("ERRO AO FAZER O LOGIN");
      });
  }

  //fazer logout
  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>ReactJS + Firebase</h1>
      {/* quando estiver logado */}
      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado)</strong>
          <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
            <br />
            <button onClick={fazerLogout}>Sair da conta</button>
            <br />
            <br />
          </span>
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        />
        <br />
        <label>Senha:</label>
        <input
          type="text"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha"
        />
        <br />
        <button onClick={novoUsuario}>Cadastar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>
      <br />
      <br />

      <hr />
      <div className="container">
        <h2>Posts</h2>
        <label>ID do Post:</label>

        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
          type="text"
        />

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
        <br />
        <button onClick={editarPost}>Atualizar Post</button>

        <ul>
          {posts.map((posts) => {
            return (
              <li key={posts.id}>
                <strong>ID: {posts.id}</strong>
                <br />
                <span>Titulo: {posts.titulo}</span>
                <br />
                <span>Autor: {posts.autor} </span>
                <br />
                <button onClick={() => excluirPost(posts.id)}>Excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
