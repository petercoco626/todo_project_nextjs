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

  const todoId = useRef(todoList.length);
  const [todo, setTodo] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const handleAddTodoList = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log('press enter');
      e.preventDefault();
      setTodoList([
        {
          id: todoId.current + 1,
          text: todo,
          isFinish: false,
        },
        ...todoList,
      ]);
      todoId.current = todoId.current + 1;
      setTodo('');
    },
    [todo, todoList]
  );

  const handleEditTodo = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setTodo(e.currentTarget.value);
  }, []);

  const handleClickCheckBox = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    console.log(e.target.checked);
    setTodoList((pre) =>
      pre.map((todo) => {
        if (todo.id === id) {
          todo.isFinish = e.target.checked;
        }
        return todo;
      })
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodoList((pre) => {
      return pre.filter((todo) => todo.id !== id);
    });
  }, []);

  useEffect(() => {
    switch (filter) {
      case 'all':
    }
  }, [filter]);

  return (
    <div className={styles.todo}>
      <div className={styles.navbar}>
        <div>darkmode</div>
        <div className={styles['option-wrap']}>
          <div className={styles.option}>ALL</div>
          <div className={styles.option}>Active</div>
          <div className={styles.option}>Completed</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.todoList}>
          {todoList.map((todo: Todo) => (
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
