import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);
  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
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
                .then(() => setCharacters([...characters, person]))
                .catch((error) => {
                  console.log(error);
                });
    
  }
  function fetchUsers(){
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  useEffect(() => {
    fetchUsers()
                .then((res) => res.json())
                .then((json) => setCharacters(json["users_list"]))
                .catch((error) => { console.log(error); } );
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