// Export project and tasks to Markdown format
export const exportToMarkdown = (project, todos) => {
  let markdown = `# ${project.name}\n\n`;
  
  if (project.description) {
    markdown += `${project.description}\n\n`;
  }
  
  markdown += `**Created:** ${new Date(project.createdAt).toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;
  
  // Group tasks by status
  const urgentTasks = todos.filter(t => t.status === 'URGENT');
  const ongoingTasks = todos.filter(t => t.status === 'ONGOING');
  const completedTasks = todos.filter(t => t.status === 'COMPLETED');
  
  // Urgent tasks
  if (urgentTasks.length > 0) {
    markdown += `## 🔴 Urgent Tasks (${urgentTasks.length})\n\n`;
    urgentTasks.forEach((task, index) => {
      markdown += `### ${index + 1}. ${task.name}\n`;
      markdown += `**${task.title}**\n\n`;
      if (task.description) {
        markdown += `${task.description}\n\n`;
      }
      if (task.tags && task.tags.length > 0) {
        const tagNames = task.tags.map(t => t.tag.name).join(', ');
        markdown += `*Tags: ${tagNames}*\n\n`;
      }
      markdown += `---\n\n`;
    });
  }
  
  // Ongoing tasks
  if (ongoingTasks.length > 0) {
    markdown += `## 🟡 Ongoing Tasks (${ongoingTasks.length})\n\n`;
    ongoingTasks.forEach((task, index) => {
      markdown += `### ${index + 1}. ${task.name}\n`;
      markdown += `**${task.title}**\n\n`;
      if (task.description) {
        markdown += `${task.description}\n\n`;
      }
      if (task.tags && task.tags.length > 0) {
        const tagNames = task.tags.map(t => t.tag.name).join(', ');
        markdown += `*Tags: ${tagNames}*\n\n`;
      }
      markdown += `---\n\n`;
    });
  }
  
  // Completed tasks
  if (completedTasks.length > 0) {
    markdown += `## ✅ Completed Tasks (${completedTasks.length})\n\n`;
    completedTasks.forEach((task, index) => {
      markdown += `### ${index + 1}. ${task.name}\n`;
      markdown += `**${task.title}**\n\n`;
      if (task.description) {
        markdown += `${task.description}\n\n`;
      }
      if (task.tags && task.tags.length > 0) {
        const tagNames = task.tags.map(t => t.tag.name).join(', ');
        markdown += `*Tags: ${tagNames}*\n\n`;
      }
      markdown += `---\n\n`;
    });
  }
  
  markdown += `\n---\n\n`;
  markdown += `*Total Tasks: ${todos.length}*\n`;
  markdown += `*Exported on: ${new Date().toLocaleString()}*\n`;
  
  return markdown;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'Copied to clipboard!' };
  } catch (error) {
    console.error('Failed to copy:', error);
    return { success: false, message: 'Failed to copy to clipboard' };
  }
};

// Download markdown file
export const downloadMarkdown = (content, filename) => {
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return { success: true, message: 'File downloaded successfully!' };
  } catch (error) {
    console.error('Failed to download:', error);
    return { success: false, message: 'Failed to download file' };
  }
};

// Format project name for filename
export const sanitizeFilename = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
