package org.zenith.pay.demo.controller;

import org.zenith.pay.demo.dto.AuthResponse;
import org.zenith.pay.demo.dto.LoginDTO;
import org.zenith.pay.demo.model.Task;
import org.zenith.pay.demo.model.User;
import org.zenith.pay.demo.service.TaskService;
import org.zenith.pay.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")  // Consider restricting this in production for security purposes
@RequestMapping("/api")
public class AppController {

    @Autowired
    private UserService userService;

    @Autowired
    private TaskService taskService;

    // User login
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO) {
        if (loginDTO == null || loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            AuthResponse response = userService.login(loginDTO.getEmail(), loginDTO.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    // Create user
    @PostMapping("/users")
    public ResponseEntity<AuthResponse> createUser(@RequestBody User user) {
        if (user == null || user.getEmail() == null || user.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // Bad Request if missing required fields
        }

        try {
            AuthResponse response = userService.saveUser(user);
            return new ResponseEntity<>(response, HttpStatus.CREATED);  // Return created user with 201 status
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    // Create task for a user
    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        if (task == null || task.getTitle() == null || task.getUser() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // Bad Request if missing required fields
        }

        try {
            User user = userService.findUserById(task.getUser().getId());
            task.setUser(user);
            Task createdTask = taskService.saveTask(task);
            return new ResponseEntity<>(createdTask, HttpStatus.CREATED);  // Return created task with 201 status
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Not Found if user doesn't exist
        }
    }

    // Get tasks by user id
    @GetMapping("/tasks/{userId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable Long userId) {
        List<Task> tasks = taskService.getTasksByUserId(userId);
        if (tasks.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // No content if no tasks found
        }
        return new ResponseEntity<>(tasks, HttpStatus.OK);  // Return tasks with 200 status
    }

    // Update task
    @PutMapping("/tasks/update/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails) {
        if (taskDetails == null || taskDetails.getTitle() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        try {
            // Verify task exists and belongs to the user
            Task existingTask = taskService.getTaskById(taskId);
            taskDetails.setUser(existingTask.getUser()); // Preserve the original user
            
            Task updatedTask = taskService.updateTask(taskId, taskDetails);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete task
    @DeleteMapping("/tasks/delete/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
