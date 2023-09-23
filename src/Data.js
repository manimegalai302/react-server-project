import React, { useState, useEffect } from "react";
import axios from "axios";

const Data = () => {
  const [element, setElement] = useState([]);
  const [form, setForm] = useState(false);
  let [title, setTitle] = useState("");
  let [body, setBody] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = { title: title, body: body };
    try {
      const response = await axios.post("http://localhost:3030/posts", newData);
      const updatedElement = [...element, response.data];
      setElement(updatedElement);
      setForm(false);
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3030/posts");
        const data = response.data;
        setElement(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  async function DeleteData(id) {
    try {
      await axios.delete(`http://localhost:3030/posts/${id}`);
      const DeletedElement = element.filter((ele) => ele.id !== id);
      setElement(DeletedElement);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  async function UpdateData(id) {
    try {
      setForm(false);
      setTitle(title);
      setBody(body);
      await axios.put(`http://localhost:3030/posts/${id}`);
      const updatedElement = element.filter((ele) => ele.id !== id);
      setElement(updatedElement);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  function handleForm() {
    setForm(true);
  }

  return (
    <div className="container">
      {form ? (
        <div className="content">
          <h3>Add</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="form-control"
              />
            </div>
            <div>
              <label htmlFor="body">Body:</label>
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter body"
                className="form-control"
              />
            </div>
            <br />
            <button className="submit">submit</button>
          </form>
        </div>
      ) : (
        <div>
          <button className="add" onClick={handleForm}>
            Add
          </button>
          <div>
            {element.map((ele) => (
              <div key={ele.id} className="container-element">
                <p>{ele.title}</p>
                <p>{ele.body}</p>
                <button className="update" onClick={() => UpdateData(ele.id)}>
                  update
                </button>
                <button className="delete" onClick={() => DeleteData(ele.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Data;
