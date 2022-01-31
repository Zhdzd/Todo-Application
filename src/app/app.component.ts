import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo } from './Todo';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo_practice';
  form: FormGroup;
  tomorrow = new Date();
  todosValues: Todo[]=[];
  priorities=["LOW", "MEDIUM", "HIGH"];
  checked: boolean=false;
  taskId: string='';
  toUpdate: boolean=true;
  index!: number;
  isAdd = true;



  taskFormControl = new FormControl('', [Validators.required]);
  priorityFormControl = new FormControl('', [Validators.required]);
  dueDateFormControl = new FormControl('', [Validators.required]);

  constructor(private fb:FormBuilder){
  this.tomorrow.setDate(this.tomorrow.getDate()+1);
    this.form = this.fb.group({
      task: this.taskFormControl,
      priority: this.priorityFormControl,
      dueDate: this.dueDateFormControl
    })
  }
  addTodo(){
    console.log("Add todo");
    let taskId = uuidv4();
    let singleTodo = new Todo(
      this.form.value.task.toUpperCase(),
      this.form.value.priority,
      this.form.value.dueDate,
      taskId,
      false
    )
    this.todosValues.push(singleTodo);
    this.taskFormControl.reset();
    this.priorityFormControl.reset();
    this.dueDateFormControl.reset();
    localStorage.setItem(taskId, JSON.stringify(singleTodo))

  }
   complete(checked: boolean){
    this.checked = checked;
   }
  deleteTask(taskId: string){
    this.todosValues= this.todosValues.filter(task => task.taskId !== taskId)
    localStorage.removeItem(taskId);
  }

  saveDone(todo: Todo){
    console.log('save to database on status change')
    localStorage.setItem(todo.taskId, JSON.stringify(todo));
  }
  editTask(index: number){
    console.log('edit todo');

    //singleTodo Edit points to the particular index in array
    let singleTodoEdit = this.todosValues[index];
    //edits the form
    this.form.setValue({
      task: singleTodoEdit.task,
      priority: singleTodoEdit.priority,
      dueDate: singleTodoEdit.dueDate,
    })
    console.log(singleTodoEdit);
    this.index=index;
    this.isAdd = false;
  }
  updateTodo(){
    console.log('update todo');
    let singleTodoUpdate = this.todosValues[this.index];
    singleTodoUpdate.dueDate = this.form.value.dueDate;
    singleTodoUpdate.priority = this.form.value.priority;
    singleTodoUpdate.task = this.form.value.task;

    localStorage.setItem(
      singleTodoUpdate.taskId,
      JSON.stringify(singleTodoUpdate)
    );
    this.form.reset();
    this.isAdd = true;
  }


}
