import React, { useRef, useState } from "react";
import './todoApp.css'

function TodoStats({ numRemaining, remainingLabel, numAll }) {
	return (
		<p className='pt-2 text-xs text-center'>
			<span className='font-bold'>{numRemaining} </span>
			<span className='font-thin'>{remainingLabel} </span>
			left / of
			<span className='font-medium'> {numAll} </span>
		</p>
	);
}
function TodoElement({ id, finished, onClick, toDelate, children }) {
	const _id = (id + 10000 + "").slice(1, 5);

	return (
		<li className='flex flex-no-wrap items-stretch border-b border-gray-100 border-b-solid ' data-id={id} data-finished={finished}>
			<span htmlFor={_id} className={`flex items-center flex-auto todo-view ${finished ? "line-through" : ""}`} onClick={onClick}>
				<input
					type='checkbox'
					id={_id}
					disabled='disebled'
					className='mx-2 flex-0'
					checked={finished ? "checked" : ""}
					onChange={() => {
						liRef.current.click();
					}}
				/>
				<span className='flex-auto font-thin' tabIndex={id}>
					{" "}
					{children}{" "}
				</span>
			</span>

			<a href='#' className='w-8 text-center border-4 border-gray-600 border-double' onClick={toDelate} title='Remove this task'>
				x
			</a>
		</li>
	);
}
const ITEM_OBJ = { id: 1, text: " -- starter -- ", finished: false };
export default function TodoApp() {
	const [todos, setTodos] = useState([ITEM_OBJ]);
	const newTodo = useRef();
	const nextId = useRef(1);

	const getIdOfElement = (htmlElem) => {
		while (htmlElem !== null && htmlElem.nodeName !== "LI") {
			htmlElem = htmlElem.parentElement;
		}
		return parseInt(htmlElem.dataset.id || 0);
	};
	
	const deleteElement = (event) => {
		event.preventDefault();
		let elem = event.target;
		const _id = getIdOfElement(elem);
		const _todos = todos.filter((item) => {
			return item.id !== _id;
		});

		setTodos(_todos);
	};

	const makeFinished = (event) => {
		event.preventDefault();
		let elem = event.target;
		const _id = getIdOfElement(elem);
		const _todos = todos.map((item) => {
			if (item.id == _id) item.finished = !item.finished;

			return item;
		});

		setTodos(_todos);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const newTodoObj = { ...ITEM_OBJ };
		nextId.current++;
		newTodoObj.id = nextId.current;
		newTodoObj.text = newTodo.current.value;
		newTodoObj.finished = false;
		setTodos([...todos, newTodoObj]);
		newTodo.current.value = "";
	};

	return (
		<form className='todo-app' onSubmit={handleSubmit}>
			<label className='block text-sm' htmlFor='new-todo'>
				What do you want to do today?
			</label>
			<input type='text' ref={newTodo} className='w-full p-1 mb-4 text-xl font-thin rounded appearance-none' placeholder='somthing nice ...' />
			<input type='submit' className='hidden' value='submit' />

			<ul id='todo-list'>
				{todos.map((item) => {
					return (
						<TodoElement key={item.id} id={item.id} finished={item.finished} onClick={makeFinished} toDelate={deleteElement}>
							<span>{item.text}</span>
						</TodoElement>
					);
				})}
			</ul>

			<TodoStats
				id='todo-stats'
				numRemaining={
					todos.filter((item) => {
						return item.finished === false;
					}).length
				}
				remainingLabel={"todos"}
				numAll={todos.length}></TodoStats>
		</form>
	);
}