namespace TaskManagerAPI.Models
{
    /// <summary>
    /// Task model with required properties as per assignment
    /// </summary>
    public class TaskItem
    {
        public int Id { get; set; }
        
        public string Description { get; set; } = string.Empty;
        
        public bool IsCompleted { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}