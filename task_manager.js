let servers = [];
let tasks = [];
let queue = [];
let servers_to_be_deleted = [];
let tasks_to_be_deleted = [];
function add_server() {
  if (servers.length <= 10) {
    let server = {
      server_id: Math.random(),
      running_task_id: null, // here null means server is free and it is not running any task
    };
    servers.push(server);
    add_server_element(server);
  } else {
    alert(
      "Sorry! you have reached the maximimum limit of 10 numbers for server resources"
    );
  }
}
function remove_server(server_id) {
  for (let index = 0; index < servers.length; index++) {
    let server = servers[index];
    if (server.server_id == server_id) {
      if (server.running_task_id == null) {
        // idle server is removed immidiatly
        servers.splice(index, 1);
        remove_server_element(server_id);
      } else {
        // if server is running any task then we will push the server_id to server_to_be_deleted array.
        servers_to_be_deleted.push(server.server_id);
        alert(
          "server can't be deleted now.\nserver is currently running task id: " +
            server.running_task_id +
            "\nOnce task is completed, server will be automatically stoped by task manager."
        );
      }
    }
  }
}

function create_task_and_assign_task_to_server() {
  let task_id = Math.random();
  var task = {
    task_id: task_id,
    assigned_to_server_id: null, // Initially task is created and null means it is not yet assigned to any server
    status: "idle",
  };
  let is_assigned = false;
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];
    console.log(server.running_task_id);
    if (server.running_task_id == null) {
      // server is free and it is not running any tasks
      server.running_task_id = task_id; //Since server is free, now we will assign the newly created task_id to server so that it starts running it.
      assign_task_to_server_element(server.server_id, task_id);
      task.assigned_to_server_id = server.server_id; // task is now assigned to this server.
      task.status = "progress";
      tasks.push(task);
      add_task_element(task, "tasks");
      is_assigned = true;
      setTimeout(() => {
        console.log("jack :", task);
        finish_task(task);
      }, 10000);

      break;
    }
  }
  if (is_assigned == false) {
    add_to_queue(task);
    add_task_element(task, "queue");
  }
}

function add_task() {
  let count = document.getElementById("task_count").value;
  for (let i = 0; i < count; i++) {
    create_task_and_assign_task_to_server();
  }
}

function remove_task(task_id, type) {
  if (type == "queue") {
    for (let index = 0; index < queue.length; index++) {
      let task = queue[index];
      console.log(task);
      if (task.task_id == task_id) {
        if (task.status == "idle" || task.status == "finished") {
          queue.splice(index, 1);
          remove_task_element(task.task_id);
          break;
        } else {
          alert(
            `Task can't be deleted now.\Task is currently running on server with id : ${task.assigned_to_server_id}\nOnce task is completed, task will be automatically removed by task manager.`
          );
          tasks_to_be_deleted.push(task_id);
          break;
        }
      }
    }
  } else {
    for (let index = 0; index < tasks.length; index++) {
      let task = tasks[index];
      console.log(task);
      if (task.task_id == task_id) {
        if (task.status == "idle" || task.status == "finished") {
          tasks.splice(index, 1);
          remove_task_element(task.task_id);
          break;
        } else {
          alert(
            `Task can't be deleted now.\nTask is currently running on server with id : ${task.assigned_to_server_id}\nOnce task is completed, task will be automatically removed by task manager.`
          );
          tasks_to_be_deleted.push(task_id);
          break;
        }
      }
    }
  }
}
function add_to_queue(task) {
  queue.push(task);
}
function remove_from_queue() {}

function task_manager() {}

function finish_task(task) {
  for (let i = 0; i < tasks.length; i++) {
    let current_task = tasks[i];
    if (current_task.task_id == task.task_id) {
      tasks[i].status = "finished";
      for (let index = 0; index < servers.length; index++) {
        let server = servers[index];
        if (server.server_id == tasks[i].assigned_to_server_id) {
          servers[index].running_task_id = null;
          console.log("before breaking:", server);
          update_ui_for_finish_task(tasks[i], server);
          break;
        }
      }

      break;
    }
  }
}

function add_server_element(server) {
  let li_tag = document.createElement("li");
  var server_id = server.server_id;
  li_tag.id = server_id;
  let li_text = document.createTextNode(
    `server id : ${server_id}, running the task_id : null  `
  );
  let span_tag = document.createElement("span");
  span_tag.appendChild(li_text);
  li_tag.appendChild(span_tag);
  let button_tag = document.createElement("button");

  let button_text = document.createTextNode("Remove_server");

  button_tag.onclick = function () {
    console.log(server_id);
    remove_server(server_id); // due to closure onClick will remember its outer function scope chain
  };

  button_tag.appendChild(button_text);
  li_tag.appendChild(button_tag);
  document.getElementById("servers").appendChild(li_tag);
}

function remove_server_element(server_id) {
  let element_to_be_removed = document.getElementById(server_id);
  element_to_be_removed.parentNode.removeChild(element_to_be_removed);
}

function add_task_element(task, parent_id) {
  let li_tag = document.createElement("li");
  var task_id = task.task_id;
  var parent_id = parent_id;
  li_tag.id = task_id;
  let li_text = document.createTextNode(
    `task id : ${task_id}, running on server_id : ${task.assigned_to_server_id} , current status: ${task.status}`
  );
  let span_tag = document.createElement("span");
  span_tag.appendChild(li_text);
  li_tag.appendChild(span_tag);
  let div_tag = document.createElement("div");
  let progress_id = task_id + "progress";
  div_tag.innerHTML = `<div class="list">
    <div id="myProgress">
      <div id=${progress_id} class="myBar">Waiting...</div>
    </div>
  </div>`;
  li_tag.appendChild(div_tag);
  let button_tag = document.createElement("button");
  button_tag.className = "fa fa-trash-o";
  let button_text = document.createTextNode(".");

  button_tag.onclick = function () {
    remove_task(task_id, parent_id); // due to closure onClick will remember its outer function scope chain
  };

  button_tag.appendChild(button_text);
  li_tag.appendChild(button_tag);
  document.getElementById(parent_id).appendChild(li_tag);
  if (parent_id == "tasks") {
    start_progres_bar(progress_id);
  }
}

function assign_task_to_server_element(server_id, task_id) {
  let li_element = document.getElementById(server_id);
  li_element.getElementsByTagName(
    "span"
  )[0].innerText = `server id : ${server_id}, running the task : ${task_id}  `;
}

function remove_task_element(task_id) {
  let element_to_be_removed = document.getElementById(task_id);
  element_to_be_removed.parentNode.removeChild(element_to_be_removed);
}

function update_ui_for_finish_task(task, server) {
  let server_li_element = document.getElementById(server.server_id);
  server_li_element.getElementsByTagName(
    "span"
  )[0].innerText = `server id : ${server.server_id}, running the task : null  `;

  let task_li_element = document.getElementById(task.task_id);
  task_li_element.getElementsByTagName(
    "span"
  )[0].innerText = `task id : ${task.task_id}, current status: finished `;
}

var progress = 0;
function start_progres_bar(progress_id) {
  if (progress == 0) {
    var elem = document.getElementById(progress_id);
    var width = 0;
    var interval_id = setInterval(frame, 100);
    function frame() {
      if (width >= 100) {
        clearInterval(interval_id);
        progress = 0;
      } else {
        width++;
        elem.style.width = width + "%";
        let value = width / 5;
        if (parseInt(value) < 1) {
          value = 0;
        }

        elem.innerHTML = "00:" + parseInt(value);
      }
    }
  }
}

function task_manager() {
  setInterval(() => {
    tasks_to_be_deleted.forEach((task_id, index) => {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task_id == task_id && tasks[i].status == "finished") {
          remove_task_element(tasks[i].task_id);
          tasks_to_be_deleted.splice(index, 1);
          tasks.splice(i, 1);
        }
      }
    });
    servers_to_be_deleted.forEach((server_id, index) => {
      for (let i = 0; i < servers.length; i++) {
        if (
          servers[i].server_id == server_id &&
          servers[i].running_task_id == null
        ) {
          remove_server_element(server_id);
          servers_to_be_deleted.splice(index, 1);
          servers.splice(i, 1);
        }
      }
    });

    // tasks.forEach((task,index)=>{
    //     if(task.status == "finished") {
    //         remove_task_element(task.task_id);
    //         tasks.splice(index,1);
    //     }
    // });

    // for (let queue_index = 0; queue_index < queue.length; queue_index++) {
    //     for (let server_index = 0; server_index < servers.length; server_index++) {
    //         if(servers[server_index]) {

    //         }
    //     }
    // }

    for (let index = 0; index < servers.length; index++) {
      let server = servers[index];
      if (server.running_task_id == null) {
        let task = queue.pop();
        if (task) {
          server.running_task_id = task.task_id; //Since server is free, now we will assign the newly created task_id to server so that it starts running it.
          assign_task_to_server_element(server.server_id, task.task_id);
          task.assigned_to_server_id = server.server_id; // task is now assigned to this server.
          task.status = "progress";
          tasks.push(task);
          remove_task_element(task.task_id);
          add_task_element(task, "tasks");
          let progress_id = task.task_id + "progress";
          start_progres_bar(progress_id);
          setTimeout(() => {
            finish_task(task);
          }, 10000);
        } else {
          break;
        }
      }
    }
  }, 1000);
}
