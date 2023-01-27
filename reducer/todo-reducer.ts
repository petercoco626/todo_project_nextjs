import { Todo } from '@/components/todo/todo';

interface Action {
  id: string;
  newTodo: string;
  type: 'add' | 'delete' | 'checkTodo' | 'initialize';
  checked: boolean;
  todoList: Todo[];
}

export function todoReducer(todoList: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'initialize':
      return action.todoList;
    case 'add':
      const addedTodoList: Todo[] = [
        {
          id: action.id,
          text: action.newTodo,
          isFinish: false,
        },
        ...todoList,
      ];
      localStorage.setItem('todoList', JSON.stringify(addedTodoList));
      return addedTodoList;
    case 'delete':
      const deletedTodoList = todoList.filter((todo) => todo.id !== action.id);
      localStorage.setItem('todoList', JSON.stringify(deletedTodoList));
      return deletedTodoList;
    case 'checkTodo':
      const clickedCheckBox = todoList.map((todo) => {
        if (todo.id === action.id) {
          todo.isFinish = action.checked;
        }
        return todo;
      });
      localStorage.setItem('todoList', JSON.stringify(clickedCheckBox));
      return clickedCheckBox;
  }
}
