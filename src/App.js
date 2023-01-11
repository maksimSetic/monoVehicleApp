import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const todosPerPage = 10;

  useEffect(() => {
    axios
      .get(`https://api.npoint.io/17580ca91f36d2ff9b1d`)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTodos / todosPerPage); i++) {
    pageNumbers.push(i);
  }


  const todosData = useMemo(() => {
    let computedTodos = todos;

    if (searchTerm) {
        computedTodos = computedTodos.filter(
            todo =>
            todo.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filterCompleted === "true") {
    computedTodos = [...computedTodos].sort((a, b) =>
    a.title > b.title ? -1 : 1,
);
  }

  if (filterCompleted === "false") {
    computedTodos = [...computedTodos].sort((a, b) =>
    a.title > b.title ? 1 : -1,
  );
 
  }

    setTotalTodos(computedTodos.length);

 
    return computedTodos.slice(
        (currentPage - 1) * todosPerPage,
        (currentPage - 1) * todosPerPage + todosPerPage
    );
}, [todos, currentPage, searchTerm, filterCompleted]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilter = () => {
    setSearchTerm("");
    setFilterCompleted("");
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <h3 style={{textAlign:"center", marginTop: "20px"}}>Mono Soft Vehicle App</h3>
      <div className="mb-3">
        <label htmlFor="search" className="form-label">
          Pretraži
        </label>
        <input
          type="text"
          className="form-control"
          id="search"
          placeholder="Search Title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="search" className="form-label">
          Sortiraj 
        </label>
        <select
          className="form-select"
          value={filterCompleted}
          onChange={(e) => {
            setFilterCompleted(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option defaultValue="">None</option>
          <option value="false">A-Z</option>
          <option value="true">Z-A</option>
        </select>
      </div>
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={resetFilter}
        >
          Resetiraj Filtere
        </button>
      </div>

      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {todosData
        .map((todo) => {
          return (
            <div key={todo.id} className="card margin-bottom">
              <h5 className="card-header">
                <div className="card-header-flex">
                  <span className="id">{`#${todo.id}`}</span>
                </div>
              </h5>
              <div className="card-body">
                <div className="card-text">
                  <div className="card-body-flex">
                    <span>{`Brand: ${todo.title}`}</span>
                    <div>{`Abrv: ${todo.abrv}`}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}