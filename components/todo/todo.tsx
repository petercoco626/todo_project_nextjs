import React, { ReactPropTypes, useCallback, useEffect, useRef, useState } from 'react';
import styles from './todo.module.css';

interface Todo {
  id: number;
  text: string;
  isFinish: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function Todo() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [filteredTodoList, setFilteredTodoList] = useState<Todo[]>([]);
  const todoId = useRef(todoList.length);
  const [todo, setTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleAddTodoList = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log('press enter');
      e.preventDefault();
      const addedTodoList = [
        {
          id: todoId.current + 1,
          text: todo,
          isFinish: false,
        },
        ...todoList,
      ];
      setTodoList(addedTodoList);
      localStorage.setItem('todoList', JSON.stringify(addedTodoList));
      todoId.current = todoId.current + 1;
      setTodo('');
    },
    [todo, todoList]
  );

  const handleEditTodo = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setTodo(e.currentTarget.value);
  }, []);

  const handleClickCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
      console.log(e.target.checked);

      const clickedCheckBox = todoList.map((todo) => {
        if (todo.id === id) {
          todo.isFinish = e.target.checked;
        }
        return todo;
      });

      setTodoList(clickedCheckBox);
      localStorage.setItem('todoList', JSON.stringify(clickedCheckBox));
    },
    [todoList]
  );

  const deleteTodo = useCallback(
    (id: number) => {
      const deletedTodoList = todoList.filter((todo) => todo.id !== id);

      setTodoList(deletedTodoList);
      localStorage.setItem('todoList', JSON.stringify(deletedTodoList));
    },
    [todoList]
  );

  const handleChangingFilter = useCallback((selectedFilter: Filter) => {
    setFilter(selectedFilter);
  }, []);

  useEffect(() => {
    switch (filter) {
      case 'all':
        setFilteredTodoList(todoList);
        break;
      case 'active':
        setFilteredTodoList(todoList.filter((todo: Todo) => !todo.isFinish));
        break;
      case 'completed':
        setFilteredTodoList(todoList.filter((todo: Todo) => todo.isFinish));
        break;
    }
  }, [filter, todoList]);

  useEffect(() => {
    const savedRawTodoListData = localStorage.getItem('todoList');
    if (savedRawTodoListData) {
      const savedTodoListData = JSON.parse(savedRawTodoListData);
      setTodoList(savedTodoListData);
    }
  }, []);

  return (
    <div className={styles.todo}>
      <div className={styles.navbar}>
        <div>darkmode</div>
        <div className={styles['option-wrap']}>
          <div
            className={filter === 'all' ? styles['selected-option'] : styles.option}
            onClick={() => {
              handleChangingFilter('all');
            }}
          >
            ALL
          </div>
          <div
            className={filter === 'active' ? styles['selected-option'] : styles.option}
            onClick={() => {
              handleChangingFilter('active');
            }}
          >
            Active
          </div>
          <div
            className={filter === 'completed' ? styles['selected-option'] : styles.option}
            onClick={() => {
              handleChangingFilter('completed');
            }}
          >
            Completed
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.todoList}>
          {filteredTodoList.map((todo: Todo) => (
            <div key={todo.id} className={styles['todo-wrap']}>
              <input
                type="checkbox"
                checked={todo.isFinish}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleClickCheckBox(e, todo.id)
                }
              />
              <div>{todo.text}</div>
              <button onClick={() => deleteTodo(todo.id)}>삭제</button>
            </div>
          ))}
        </div>
        <form className={styles['add-todo-wrap']} onSubmit={handleAddTodoList}>
          <input
            className={styles['add-todo-input']}
            onChange={handleEditTodo}
            value={todo}
            placeholder="Add Todo"
          />
          <button className={styles['add-todo-btn']}>Add</button>
        </form>
      </div>
    </div>
  );
}
