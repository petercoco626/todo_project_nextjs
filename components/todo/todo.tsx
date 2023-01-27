import { todoReducer } from '@/reducer/todo-reducer';
import React, { ReactPropTypes, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import styles from './todo.module.css';

export interface Todo {
  id: number;
  text: string;
  isFinish: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function Todo() {
  const [todoList, dispatch] = useReducer(todoReducer, []);
  const [filteredTodoList, setFilteredTodoList] = useState<Todo[]>([]);
  const todoId = useRef(todoList.length);
  const [todo, setTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleAddTodoList = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log('press enter');
      e.preventDefault();
      dispatch({
        id: todoId.current,
        newTodo: todo,
        type: 'add',
        checked: false,
        todoList: [],
      });
      todoId.current = todoId.current + 1;
      setTodo('');
    },
    [todo]
  );

  const handleEditTodo = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setTodo(e.currentTarget.value);
  }, []);

  const handleClickCheckBox = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    console.log(e.target.checked);
    dispatch({
      id,
      newTodo: '',
      type: 'checkTodo',
      checked: e.target.checked,
      todoList: [],
    });
  }, []);

  const deleteTodo = useCallback((id: number) => {
    dispatch({
      id,
      newTodo: '',
      type: 'delete',
      checked: false,
      todoList: [],
    });
  }, []);

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
      dispatch({
        id: 0,
        newTodo: '',
        type: 'initialize',
        checked: false,
        todoList: savedTodoListData as Todo[],
      });

      /** max에 배열을 넣을때는 spread연산자로 얕은 복사릃 해줘야한다. */
      todoId.current = Math.max(
        ...savedTodoListData.map((todo: Todo) => {
          return todo.id;
        })
      );
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
