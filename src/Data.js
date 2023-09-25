import React, { useState, useEffect } from "react";
import axios from "axios";

const Data = () => {
  const [element, setElement] = useState([]);
  const [form, setForm] = useState(false);
  let [title, setTitle] = useState("");
  let [body, setBody] = useState("");
  let [isedit, setIsedit] = useState(false);
  let [editId, setEditId] = useState(null); 

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

  function UpdateData(id) {
    setForm(true);
    setIsedit(true);
    setEditId(id);
    const updateData = element.find((update) => {
      return update.id === id;
    });
    setTitle(updateData.title);
    setBody(updateData.body);
  }

  function handleForm() {
    setForm(true);
    setIsedit(false); 
    setTitle("");
    setBody("");
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const newData = { title: title, body: body };

    try {
      const response = await axios.put(
        `http://localhost:3030/posts/${editId}`,
        newData
      );
      const updatedElement = element.map((ele) =>
        ele.id === editId ? response.data : ele
      );
      setElement(updatedElement);
      setForm(false);
      setTitle("");
      setBody("");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }

  return (
    <div className="container">
      {form ? (
        <div className="content">
          <h3>{isedit ? "Update" : "Add"}</h3>
          <form>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="form-control"
              />
            </div>
            <div className="item">
              <label htmlFor="body">Body</label>
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter body"
                className="form-control"
              />
            </div>
            <br />
            {isedit ? (
              <button className="submit" onClick={handleUpdate}>
                Update
              </button>
            ) : (
              <button className="submit" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="display">
          <button className="add" onClick={handleForm}>
            Add
          </button>
          <div className="display-element">
            {element.map((ele) => (
              <div key={ele.id} className="container-element">
                <p>{ele.title}</p>
                <p>{ele.body}</p>
                <button className="update" onClick={() => UpdateData(ele.id)}>
                  Update
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
