import "./todo-list.css";
import { useEffect, useRef, useState } from "react";
import { FaCircleInfo, FaMagnifyingGlass, FaPen, FaTrash } from "react-icons/fa6";
import { v4 as uuid } from "uuid";
import { LiaClipboardListSolid } from "react-icons/lia";

const TodoList = () => {
	const [title, setTitle] = useState("");

	const [taskList, setTaskList] = useState(JSON.parse(localStorage.getItem("taskList")) || []);
	const [currentTaskId, setCurrentTaskId] = useState(null);
	const [isError, setIsError] = useState(false);
	const inputRef = useRef();

	useEffect(() => {
		localStorage.setItem("taskList", JSON.stringify(taskList));
	}, [taskList]);

	const addTodo = (title) => {
		if (title === "") {
			setIsError(true);
			inputRef.current.focus();
		} else {
			setIsError(false);

			if (currentTaskId) {
				setTaskList((prevItems) => prevItems.map((item) => (item.id === currentTaskId ? { ...item, title } : item)));
				setCurrentTaskId(null);
			} else {
				setTaskList([...taskList, { id: uuid(), title, completed: false }]);
			}

			setTitle("");
		}
	};

	const toggleTask = (id) => {
		setTaskList((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
	};

	const TaskList = ({ taskArray, setTaskArray, setTitle }) => {
		const [arrayStorage, setArrayStorage] = useState(taskArray);
		const [showModal, setShowModal] = useState(false);
		const [activeTag, setActiveTag] = useState("all");

		const filterList = (category) => {
			switch (category) {
				case "all":
					setArrayStorage([...taskList]);
					break;
				case "active":
					setArrayStorage(() => taskList.filter((item) => item.completed === false));
					break;
				case "completed":
					setArrayStorage(() => taskList.filter((item) => item.completed === true));
					break;
				default:
					const searchInput = category.toLowerCase();
					setArrayStorage(() => taskList.filter((item) => item.title.toLowerCase().includes(searchInput)));
			}
		};

		return (
			<>
				<div className="task-list">
					{arrayStorage.length > 0 ? (
						arrayStorage.map((task) => {
							return (
								<div
									className={`task-card ${task.id === currentTaskId ? "highlight-card" : undefined} `}
									key={task.id}
									onClick={() => toggleTask(task.id)}>
									<input
										type="checkbox"
										name="completed"
										id="completed"
										checked={task.completed}
									/>
									<p>{task.title}</p>
									<button
										type="button"
										className="editBtn"
										onClick={() => {
											setCurrentTaskId(task.id);
											setTitle(task.title);
											inputRef.current.focus();
										}}>
										<FaPen />
									</button>
									<button
										type="button"
										className="delBtn"
										onClick={() => {
											setTaskArray(taskList.filter((item) => item.id !== task.id));
										}}>
										<FaTrash />
									</button>
								</div>
							);
						})
					) : (
						<p className="empty">
							<span className="icon">
								<LiaClipboardListSolid />
							</span>
							Nothing to show.
						</p>
					)}
				</div>
				<footer>
					<form
						action=""
						onSubmit={(e) => e.preventDefault()}>
						<input
							type="search"
							name="search"
							id="search"
							placeholder="Type to search..."
							onChange={(e) => {
								filterList(e.target.value);
							}}
						/>
						<div className="search-btn">
							<FaMagnifyingGlass />
						</div>
					</form>
					<div className="tags">
						<button
							type="button"
							className={`${activeTag === "all" && "active-btn"}`}
							onClick={() => {
								filterList("all");
								setActiveTag("all");
							}}>
							All
						</button>
						<button
							type="button"
							className={`${activeTag === "active" && "active-btn"}`}
							onClick={() => {
								filterList("active");
								setActiveTag("active");
							}}>
							Active
						</button>
						<button
							type="button"
							className={`${activeTag === "completed" && "active-btn"}`}
							onClick={() => {
								filterList("completed");
								setActiveTag("completed");
							}}>
							Completed
						</button>
						<button
							type="button"
							onClick={() => setShowModal(true)}>
							Delete All
						</button>
					</div>
				</footer>

				<div
					className="confirmationBg"
					style={showModal ? { display: "block" } : { display: "none" }}
					onClick={() => setShowModal(false)}></div>

				<div
					className="confirmation"
					role="alert"
					style={showModal ? { display: "block" } : { display: "none" }}>
					<FaCircleInfo className="info" />
					<p>Are you sure that you want to delete all of the items?</p>
					<div className="confirmation-btns">
						<button
							type="button"
							onClick={() => {
								setTaskArray([]);
								setTitle("");
							}}>
							Confirm
						</button>
						<button
							type="button"
							onClick={() => setShowModal(false)}>
							Cancel
						</button>
					</div>
				</div>
			</>
		);
	};

	return (
		<section>
			<h1 className="header">
				<img
					src="/logo.svg"
					alt="logo"
					height={50}
				/>
				<span>Things to do: </span>
				<span className="items-left">
					{taskList.length >= 1 ? `(${taskList.length} ${taskList.length > 1 ? "items left" : "item left"})` : undefined}
				</span>
			</h1>

			<form
				className="addTaskForm"
				onSubmit={(e) => e.preventDefault()}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						addTodo(title);
					}
				}}>
				<label
					htmlFor="todo"
					className="visually-hidden">
					Task Input:
				</label>
				<input
					ref={inputRef}
					className="form-control"
					type="text"
					name="todo"
					id="todo"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);

						if (title !== "") {
							setIsError(false);
						}
					}}
					onBlur={() => setIsError(false)}
					placeholder="e.g. Learn Programming"
					aria-invalid={isError ? "true" : "false"}
					aria-describedby="errnote"
				/>

				<input
					className="form-btn"
					type="button"
					value={currentTaskId ? "Save Edit Task" : "Add Task"}
					onClick={() => addTodo(title)}
				/>

				{isError && (
					<p
						id="errnote"
						on>
						<FaCircleInfo /> Please enter something.
					</p>
				)}
			</form>

			<div className="task-section">
				{
					<TaskList
						taskArray={taskList}
						setTaskArray={setTaskList}
						setTitle={setTitle}
					/>
				}
			</div>
		</section>
	);
};
export default TodoList;
