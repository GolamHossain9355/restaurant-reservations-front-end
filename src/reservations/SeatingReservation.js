import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ListAllTables from "../tables/ListAllTables";
import { listTables, assignTable } from "../utils/api";
import "./SeatingReservations.css";

export default function SeatingReservation() {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [reservationError, setReservationError] = useState(null);
  const { reservationId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setReservationError(null);
    async function loadTables() {
      try {
        const data = await listTables(abortController.signal);
        setTables(data);
      } catch (error) {
        setReservationError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (tables.length) {
      setSelectedTableId(tables[0].table_id);
    }
  }, [tables]);

  const changeHandler = ({ target }) => {
    setSelectedTableId(Number(target.value));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationError(null);
    async function reserveTable() {
      try {
        await assignTable(
          { reservation_id: reservationId },
          selectedTableId,
          abortController.signal
        );
        history.push("/dashboard");
      } catch (error) {
        setReservationError(error);
      }
    }
    reserveTable();
    return () => abortController.abort();
  };

  return (
    <>
      <ErrorAlert error={reservationError} />
      <form onSubmit={submitHandler} className="seating-form">
          <label htmlFor="table_id">Choose a table:</label>
          <select name="table_id" id="table_id" onChange={changeHandler}>
            {tables.map((table) => (
              <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        <div className="seating-button-container">
          <button type="submit" className="submit">Submit</button>
          <button type="button" className="cancel" onClick={() => history.goBack()}>
            Cancel
          </button>
        </div>
      </form>
      <ListAllTables tables={tables} />
    </>
  );
}
