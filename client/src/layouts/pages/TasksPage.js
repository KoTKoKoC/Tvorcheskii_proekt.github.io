import React, {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createTask } from "../../actions/tasksAction"
import 'react-widgets/dist/css/react-widgets.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Task } from "../components/tasksPage/Task";

export const TasksPage = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    importance: 0,
  });

  const [expiredAtTime, setExpiredAtTime] = useState(new Date(Date.now()));

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTaskHandler = (e) => {
    e.preventDefault();
    const newTask = {
      title: form.title,
      description: form.description,
      expiredAt: expiredAtTime.valueOf(),
      importance: form.importance,
    }

    if (newTask.title && newTask.description && newTask.expiredAt) {
      dispatch(createTask(newTask))

      setForm({
        title: "",
        description: "",
        importance: 0,
      });
    }
    
  }

  const tasks = useSelector((state) => state.tasks.all);

  return (
    <div className="page">
      <div className="card text-center" style={form.importance>=70 ? {backgroundColor: "#FF9078", margin: "0 70px"} : (form.importance>=40 && form.importance<70) ? {backgroundColor: "#FFDE71", margin: "0 70px"} : {backgroundColor: "#AED170", margin: "0 70px"}} >
        <div className="card-header">
          Создайте новую задачу
        </div>
        <div className="card-body">
          <form onSubmit={createTaskHandler}>
            <div className="row mb-3">
              <label htmlFor="inputEmail3" className="col-sm-2 col-form-label" >Заголовок</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" id="inputEmail3" name="title" value={form.title} onChange={onChangeHandler}/>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="floatingTextarea" className="col-sm-2 col-form-label" >Описание</label>
              <div className="col-sm-10">
                <textarea type="text" className="form-control" id="inputEmail3" name="description" value={form.description} onChange={onChangeHandler}/>
              </div>        
            </div>
            <div className="row mb-3">
              <label htmlFor="floatingTextarea" className="col-sm-2 col-form-label" >Выполнить до</label>
              <div className="col-sm-10">
                <DateTimePicker
                  culture="ru-RU"
                  value={expiredAtTime}
                  onChange={(value) => setExpiredAtTime(value)}
                />              
              </div>        
            </div>

            <div className="row mb-3 form-group">
              <label htmlFor="formControlRange" className="col-sm-2 col-form-label" >Срочность задачи</label>
              <div className="col-sm-10">
                <input type="range" className="form-control-range " id="formControlRange" name="importance" onChange={onChangeHandler} value={form.importance}/>          
              </div>        
            </div>
            
            <button type="submit" className="btn btn-primary" >Создать</button>
          </form>
        </div>
      </div>

      <hr/>

      <h2 className="text-center">Ваши задачи</h2>
      
      {
        tasks.length !== 0 ? (<table className="table">
        <thead align="center">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Загаловок</th>
            <th scope="col">Описание</th>
            <th scope="col">Выполнить до</th>
            <th scope="col">Управление</th>
          </tr>
        </thead>
        <tbody align="center">
          {tasks.map((task, idx) => (
            <Task task={task} idx={idx} key={task._id}/>
          ))}
        </tbody>
      </table>) : (<div className="alert alert-info text-center mt-2" style={{width: "50%", margin: "0 auto"}}>Задач пока нет! Создайте первую в форме выше! =)</div>)
      }
    </div>
  );
};
