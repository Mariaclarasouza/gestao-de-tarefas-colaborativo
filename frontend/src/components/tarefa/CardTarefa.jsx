import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  Card,
  ListGroup,
  Button,
  ProgressBar,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Comments from "../tarefa/Comments";
import { MdEdit, MdDelete } from "react-icons/md";
import TaskHistory from "../tarefa/TaskHistory";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";

export default function TaskList({ boardId, user }) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [errorMembers, setErrorMembers] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    assigned_to: "",
    due_date: "",
  });
  const [creatingTask, setCreatingTask] = useState(false);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [tasksState, setTasksState] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  React.useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Não definido";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchTasks = () => {
    setLoadingTasks(true);
    setErrorTasks(null);
    axios
      .get(`http://localhost:3001/boards/${boardId}/tasks`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
        setLoadingTasks(false);
      })
      .catch((err) => {
        setErrorTasks("Erro ao carregar tarefas.");
        setLoadingTasks(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, [user.entityId]);

  const fetchMembers = () => {
    setLoadingMembers(true);
    setErrorMembers(null);
    axios
      .get(`http://localhost:3001/users/entities/${user.entityId}/members`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setMembers(res.data);
        setLoadingMembers(false);
      })
      .catch((err) => {
        setErrorMembers("Erro ao carregar membros da equipe.");
        setLoadingMembers(false);
        console.error(err);
      });
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setCreatingTask(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (editingTaskId) {
        await axios.put(
          `http://localhost:3001/tasks/${editingTaskId}`,
          {
            ...newTask,
            id: editingTaskId,
          },
          config
        );

        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTaskId ? { ...task, ...newTask } : task
          )
        );
      } else {
        const response = await axios.post(
          `http://localhost:3001/boards/${boardId}/tasks`,
          {
            ...newTask,
          },
          config
        );

        setTasks((prev) => [...prev, response.data]);
      }

      setNewTask({
        title: "",
        description: "",
        status: "todo",
        assigned_to: "",
        due_date: "",
      });
      setEditingTaskId(null);
      setShowTaskForm(false);
    } catch (error) {
      if (error.response) {
        console.error("Erro resposta backend:", error.response.data);
        alert(
          `Erro ao salvar tarefa: ${
            error.response.data.error || JSON.stringify(error.response.data)
          }`
        );
      } else if (error.request) {
        console.error("Erro sem resposta:", error.request);
        alert("Erro ao salvar tarefa: sem resposta do servidor.");
      } else {
        console.error("Erro ao configurar requisição:", error.message);
        alert("Erro ao salvar tarefa: " + error.message);
      }
    }
  };

  if (loadingTasks)
    return (
      <div>
        <Spinner animation="border" /> Carregando tarefas...
      </div>
    );
  if (errorTasks) return <Alert variant="danger">{errorTasks}</Alert>;

  const getMemberNameById = (id) => {
    if (!id) return "Não atribuído";
    const member = members.find((m) => m.id === Number(id));
    return member ? member.name : "Não atribuído";
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  function toggleComplete(taskId) {
    if (!tasksState) return;
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;

    const isDone = task.status === "done";

    setTasksState((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: isDone ? "todo" : "done" } : t
      )
    );

    const url = `http://localhost:3001/${taskId}/${
      isDone ? "uncomplete" : "complete"
    }`;

    axios
      .put(url, null, { headers: { Authorization: `Bearer ${user.token}` } })
      .catch(() => {
        setTasksState((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: isDone ? "done" : "todo" } : t
          )
        );
      });
  }

  const toggleAccordion = (taskId) => {
    setActiveKey(activeKey === taskId ? null : taskId);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir esta tarefa?"
      );
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir a tarefa.");
    }
  };

  const handleEditTask = (task) => {
    setNewTask(task);
    setEditingTaskId(task.id);
    setShowTaskForm(true);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <h4>Tarefas do Quadro</h4>
      <ProgressBar
        now={calculateProgress()}
        label={`${calculateProgress()}%`}
      />
      {user?.role === "admin" && !showTaskForm && (
        <Button
          className="my-3"
          onClick={() => {
            setNewTask({
              title: "",
              description: "",
              status: "todo",
              assigned_to: "",
              due_date: "",
            });
            setEditingTaskId(null);
            setShowTaskForm(true);
          }}
        >
          Criar Tarefa
        </Button>
      )}
      {showTaskForm && (
        <TaskForm
          {...{
            newTask,
            setNewTask,
            handleSaveTask,
            creatingTask,
            editingTaskId,
            setShowTaskForm,
            setEditingTaskId,
            loadingMembers,
            errorMembers,
            members,
          }}
        />
      )}
      <Accordion activeKey={activeKey}>
        {tasksState
          .filter((task) => task.status !== "in_progress")
          .map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              toggleAccordion={toggleAccordion}
              activeKey={activeKey}
              toggleComplete={toggleComplete}
              getMemberNameById={getMemberNameById}
              formatDate={formatDate}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              user={user}
            />
          ))}
      </Accordion>
    </div>
  );
}
