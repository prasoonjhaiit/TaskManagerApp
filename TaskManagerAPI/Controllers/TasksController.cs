using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        // In-memory storage as per assignment requirements
        private static readonly List<TaskItem> _tasks = new();
        private static int _nextId = 1;

        /// <summary>
        /// GET: api/tasks
        /// Display a list of tasks
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetAllTasks()
        {
            return Ok(_tasks);
        }

        /// <summary>
        /// GET: api/tasks/{id}
        /// Get a single task by ID
        /// </summary>
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTask(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            
            if (task == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found" });
            }
            
            return Ok(task);
        }

        /// <summary>
        /// POST: api/tasks
        /// Add a new task with a description
        /// </summary>
        [HttpPost]
        public ActionResult<TaskItem> CreateTask([FromBody] CreateTaskDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new { message = "Description is required" });
            }

            var newTask = new TaskItem
            {
                Id = _nextId++,
                Description = dto.Description.Trim(),
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow
            };

            _tasks.Add(newTask);
            
            return CreatedAtAction(
                nameof(GetTask), 
                new { id = newTask.Id }, 
                newTask
            );
        }

        /// <summary>
        /// PUT: api/tasks/{id}
        /// Mark a task as completed or uncompleted
        /// </summary>
        [HttpPut("{id}")]
        public ActionResult<TaskItem> UpdateTask(int id, [FromBody] UpdateTaskDto dto)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            
            if (task == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found" });
            }

            // Update description if provided
            if (!string.IsNullOrWhiteSpace(dto.Description))
            {
                task.Description = dto.Description.Trim();
            }
            
            // Toggle completion status
            task.IsCompleted = dto.IsCompleted;

            return Ok(task);
        }

        /// <summary>
        /// DELETE: api/tasks/{id}
        /// Delete a task
        /// </summary>
        [HttpDelete("{id}")]
        public ActionResult DeleteTask(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            
            if (task == null)
            {
                return NotFound(new { message = $"Task with ID {id} not found" });
            }

            _tasks.Remove(task);
            
            return Ok(new { message = "Task deleted successfully", id });
        }
    }

    // DTOs for request validation
    public class CreateTaskDto
    {
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateTaskDto
    {
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
    }
}