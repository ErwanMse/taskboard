<?php

class TaskRepository {
    private PDO $db;

    public function __construct() {
        $this->db = new PDO('sqlite:' . __DIR__ . '/../db/tasks.sqlite');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public function getAll(): array {
        $stmt = $this->db->query("SELECT id, title, status, tag FROM tasks");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(string $title, string $tag): void {
        $stmt = $this->db->prepare(
            "INSERT INTO tasks (title, tag) VALUES (:title, :tag)"
        );
        $stmt->execute([
            'title' => $title,
            'tag' => $tag
        ]);
    }

    public function updateStatus(int $id, string $status): void {
        $stmt = $this->db->prepare(
            "UPDATE tasks SET status = :status WHERE id = :id"
        );
        $stmt->execute(['status' => $status, 'id' => $id]);
    }

    public function delete(int $id): void {
        $stmt = $this->db->prepare("DELETE FROM tasks WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }

    public function updateTitle(int $id, string $title): void {
        $stmt = $this->db->prepare(
            "UPDATE tasks SET title = :title WHERE id = :id"
        );
        $stmt->execute(['title' => $title, 'id' => $id]);
    }

    public function updateTag(int $id, string $tag): void {
        $stmt = $this->db->prepare(
            "UPDATE tasks SET tag = :tag WHERE id = :id"
        );
        $stmt->execute(['tag' => $tag, 'id' => $id]);
    }
}
