import { useState, useEffect } from "react";
import "./index.css";
function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActvie] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const API_BASE = "http://localhost:3001";

  const Gettodos = async () => {
    try {
      const res = await fetch(API_BASE + "/todos");
      const data = await res.json();
      setTodos(data);
      console.log("todo", data);
    } catch (err) {
      console.error("Err", err);
    }
  };

  const CompleteTodo = async (id) => {
    const res = await fetch(API_BASE + "/todo/complete/" + id);
    const data = await res.json();

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === data._id ? { ...todo, complete: data.complete } : todo
      )
    );
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(API_BASE + "/todo/delete/" + id, {
        method: "DELETE",
      });

      // Fetch the updated todos after deletion
      await Gettodos();
    } catch (err) {
      console.error("Error deleting todo", err);
    }
  };
  const addTodo = async () => {
    try {
      await fetch(API_BASE + "/todo/new/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTodo }),
      });
      await Gettodos();
      setNewTodo("");
    } catch (err) {
      console.error("Err", err);
    }
  };

  useEffect(() => {
    Gettodos();
  }, []);

  return (
    <>
      <h1 className="text-center text-light">Hey Sami!</h1>
      <h4 className="text-warning m-4"> @ Your Tasks</h4>
      <div className="todos">
        {todos.map((todo, index) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={index}
          >
            <div
              className="checkbox"
              onClick={() => {
                CompleteTodo(todo._id);
              }}
            ></div>
            <div className="text">{todo.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
              x
            </div>
          </div>
        ))}
      </div>
      <div
        className="addPopup"
        onClick={() => {
          setPopupActvie(true);
        }}
      >
        +
      </div>
      {popupActive ? (
        <div className="popup">
          <div
            className="closePopup"
            onClick={() => {
              setPopupActvie(false);
            }}
          >
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <button className="button" onClick={addTodo}>
              Create Task
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
