interface TodoItem {
  id: string;
  content: string;
  isCompleted: boolean;
}

interface Folder {
  id: string;
  name: string;
  items: TodoItem[];
}

interface User {
  id: string;
  username: string;
  folders: Folder[];
}
