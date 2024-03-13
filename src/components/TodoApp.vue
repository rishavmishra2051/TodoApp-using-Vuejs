<template>
  <div class="container" style="max-width: 500px">
    <h2 class="text-center text-secondary mt-3">GET YOUR TO-DO LIST</h2>
    <div class="d-flex mt-3 gap-2">
      <input
        type="text"
        v-model="task"
        placeholder="Create Task"
        class="w-100 form-control"
      />
      <button class="btn btn-outline-warning rounded-1" @click="createTask">
        CREATE
      </button>
    </div>
    <table class="table table-secondary table-hover mt-3">
      <thead>
        <tr>
          <th scope="col">Tasks</th>
          <th scope="col" style="width: 80px">Status</th>
          <th scope="col" style="width: 20px" class="text-center">Delete</th>
          <th scope="col" style="width: 20px" class="text-center">Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            <span
              v-if="editedTask !== index"
              :class="{ 'line-through': task.status === 'Finished' }"
            >
              {{ task.title }}
            </span>
            <input
              v-else
              type="text"
              v-model="task.title"
              class="w-100 form-control"
            />
            <sub class="text-info text-end">{{ formatDate(task.date) }}</sub>
          </td>
          <td>
            <span
              class="pointer noselect"
              @click="changeStatus(index)"
              :class="{
                'text-danger': task.status === 'To-do',
                'text-success': task.status === 'Finished',
              }"
              >{{ task.status }}</span
            >
          </td>
          <td class="text-center text-warning">
            <div @click="deleteTask(index, task.id)">
              <span class="fa fa-trash pointer"></span>
            </div>
          </td>
          <td class="text-center text-warning">
            <div v-if="editedTask !== index" @click="editedTask = index">
              <p class="fa fa-pen pointer"></p>
            </div>
            <div v-else>
              <button @click="saveTask(index, task.id)">Save</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import {
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase.js";
import { ref, onMounted } from "vue"; // Import necessary Vue Composition API functions
import { onSnapshot } from "firebase/firestore"; // Import Firebase functions

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const task = ref("");
    const editedTask = ref(null);
    const statuses = ["To-do", "Finished"];
    const tasks = ref([]); // Define a reactive reference for tasks

    const changeStatus = async (index) => {
      let newIndex = statuses.indexOf(tasks.value[index].status);
      newIndex = (newIndex + 1) % statuses.length;
      tasks.value[index].status = statuses[newIndex];

      try {
        const todoRef = doc(db, "todos", tasks.value[index].id);
        await updateDoc(todoRef, {
          status: tasks.value[index].status,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const deleteTask = async (index, id) => {
      try {
        const todoRef = doc(db, "todos", id);
        await deleteDoc(todoRef);
      } catch (error) {
        console.log(error);
      }
      tasks.value.splice(index, 0);
    };

    const createTask = async () => {
      try {
        const todo = {
          title: task.value,
          status: "To-do",
          date: Date.now(),
        };
        const todoRef = collection(db, "todos");
        await addDoc(todoRef, todo);
      } catch (error) {
        console.log(error);
      }
      if (task.value.length === 0) return;

      task.value = "";
    };

    const getTodos = async () => {
      try {
        const todosRef = collection(db, "todos");
        onSnapshot(todosRef, (snapshot) => {
          const todosList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          tasks.value = todosList; // Update tasks with new data
        });
      } catch (error) {
        console.log(error);
      }
    };
    const saveTask = async (index, id) => {
      try {
        const todoRef = doc(db, "todos", id);
        await updateDoc(todoRef, {
          title: tasks.value[index].title,
          status: tasks.value[index].status,
          date: Date.now(),
        });
      } catch (error) {
        console.log(error);
      }
      editedTask.value = null;
    };

    const editTask = (index) => {
      editedTask.value = index;
    };

    const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(); // Customize this according to your date format preference
};
    onMounted(getTodos); // Call getTodos method on component mount

    return {
      task,
      editedTask,
      saveTask,
      statuses,
      tasks,
      createTask,
      editTask,
      deleteTask,
      changeStatus,
      formatDate
    };
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.line-through {
  text-decoration: line-through;
}
</style>
