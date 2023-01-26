import React, { useCallback, useRef, useState } from 'react';
import styles from './todo.module.css';

interface Todo {
  id: number;
  text: string;
}

export default function Todo() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const todoId = useRef(todoList.length);
  const [todo, setTodo] = useState<Todo>({
    id: todoId.current + 1,
    text: '',
  });

  const handleAddTodo = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTodoList([todo, ...todoList]);
  }, []);

  const handleClickAddBtn = useCallback(() => {}, []);

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
        <div className={styles.todoList}></div>
        <form className={styles['add-todo-wrap']} onSubmit={handleAddTodo}>
          <input className={styles['add-todo-input']} placeholder="Add Todo" />
          <button className={styles['add-todo-btn']} onClick={handleClickAddBtn}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
