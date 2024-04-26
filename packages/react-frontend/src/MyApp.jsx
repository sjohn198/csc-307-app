import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);
  async function removeOneCharacter(index, id) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    const target = characters.filter((i) => {
      return i == index;
    })
    console.log(updated);
    const promise = await fetch("http://localhost:8000/users/" + id, {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      }
    })
    if (promise.status == 204){
      setCharacters(updated);
    }
  }
  async function postUser(person) {
    const promise = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(person)
    });
    console.log(promise.status);
    if (promise.status == 201) {
      return promise;
    } else {
      return Promise.reject(new Error("Wrong status code"))
    }
  }
  function updateList(person){
    postUser(person)
                .then((res) => res.json())
                .then((newPerson) => setCharacters([...characters, newPerson]))
                .catch((error) => {
                  console.log(error);
                });
    
  }
  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    console.log(promise);
    return promise;
  }
  useEffect(() => {  
    fetchUsers().then((res) =>  res.json()).then((json) => setCharacters(json)).catch((error) => {console.log(error)});
  }, []);
  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );
}

export default MyApp;