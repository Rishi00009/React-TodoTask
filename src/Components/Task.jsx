import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  Stack,
  Chip,
  Paper,
} from "@mui/material";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    status: "Not Completed",
  });
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) setTodos(JSON.parse(storedTodos));
  }, []);

  const saveTodos = (updatedTodos) => {
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      const updatedTodos = todos.map((t) =>
        t.id === editing ? { ...newTodo, id: editing } : t
      );
      saveTodos(updatedTodos);
      setEditing(null);
    } else {
      const newTodoItem = { ...newTodo, id: Date.now() };
      saveTodos([...todos, newTodoItem]);
    }
    setNewTodo({ name: "", description: "", status: "Not Completed" });
  };

  const handleEditTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    setNewTodo(todo);
    setEditing(id);
  };

  const handleDeleteTodo = (id) => {
    saveTodos(todos.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id, status) => {
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    saveTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "all") return true;
    if (filter === "completed") return t.status === "Completed";
    if (filter === "not completed") return t.status === "Not Completed";
    return false;
  });

  return (
    <Container sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: "#1E1E1E" }}
      >
        Expressive Todo List
      </Typography>

      {/* Form */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={6}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          backgroundColor: "#F5F5F5",
        }}
      >
        <TextField
          label="Task Name"
          value={newTodo.name}
          onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
          required
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Description"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          required
          sx={{ minWidth: 250 }}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ minWidth: 150, borderRadius: 3 }}
        >
          {editing ? "Update Task" : "Add Task"}
        </Button>
      </Paper>

      {/* Filter Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        {["all", "completed", "not completed"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setFilter(f)}
            sx={{ borderRadius: 3, textTransform: "capitalize" }}
          >
            {f.replace("-", " ")}
          </Button>
        ))}
      </Stack>

      {/* Todo Cards in 3-column grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // mobile
            sm: "1fr 1fr", // tablet
            md: "1fr 1fr 1fr", // desktop
          },
          gap: 3,
        }}
      >
        {filteredTodos.map((todo) => (
          <Card
            key={todo.id}
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <CardContent sx={{ backgroundColor: "#FFFFFF" }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                {todo.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                {todo.description}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Select
                  value={todo.status}
                  onChange={(e) =>
                    handleStatusChange(todo.id, e.target.value)
                  }
                  size="small"
                  sx={{ borderRadius: 2, minWidth: 140 }}
                >
                  <MenuItem value="Not Completed">Not Completed</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
                <Chip
                  label={todo.status}
                  color={todo.status === "Completed" ? "success" : "warning"}
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleEditTodo(todo.id)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
