<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TaskBoard</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Web Components -->
    <script type="module" src="/web-components/task-form.js"></script>
    <script type="module" src="/web-components/task-search.js"></script>
    <script type="module" src="/web-components/theme-toggle.js"></script>
    <script type="module" src="/web-components/kanban-board.js"></script>

    <style>
        :root {
            --bg: #f4f3ef;
            --text: #1a1a1a;
            --text-muted: #9a9690;

            --column-bg: #ffffff;
            --task-bg: #ffffff;
            --input-bg: #f0efe9;

            --border-color: rgba(0, 0, 0, 0.08);

            --btn-bg: #f0efe9;
            --btn-text: #1a1a1a;

            --accent-blue: #3b82f6;
            --accent-red: #ef4444;
            --accent-green: #27ae60;

            --column-bg-hover: rgba(0, 0, 0, 0.02);

            --col-todo-accent: #6366f1;
            --col-todo-bg: #f5f5ff;
            --col-doing-accent: #f97316;
            --col-doing-bg: #fffaf5;
            --col-done-accent: #10b981;
            --col-done-bg: #f5fdf9;

            --tag-urgent-color: #ef4444;
            --tag-urgent-bg: #fef2f2;
            --tag-bug-color: #f97316;
            --tag-bug-bg: #fff7ed;
            --tag-feature-color: #3b82f6;
            --tag-feature-bg: #eff6ff;
            --tag-perso-color: #8b5cf6;
            --tag-perso-bg: #f5f3ff;
        }

        :root[data-theme="dark"] {
            --bg: #0f0f17;
            --text: #e8e8f2;
            --text-muted: #6b6b88;

            --column-bg: #16161f;
            --task-bg: #1e1e2a;
            --input-bg: #1e1e2a;

            --border-color: rgba(255, 255, 255, 0.08);

            --btn-bg: #1e1e2a;
            --btn-text: #e8e8f2;

            --column-bg-hover: rgba(255, 255, 255, 0.03);

            --col-todo-bg: #1a1a2e;
            --col-doing-bg: #1e1510;
            --col-done-bg: #0e1e16;

            --tag-urgent-bg: #4a1515;
            --tag-bug-bg: #4a2010;
            --tag-feature-bg: #1e3a5f;
            --tag-perso-bg: #2e1f5e;
        }

        * { box-sizing: border-box; }

        body {
            background: var(--bg);
            color: var(--text);
            transition: background 0.3s, color 0.3s;
            margin: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .page {
            max-width: 1280px;
            margin: 0 auto;
            padding: 32px 32px 20px;
        }

        h1 {
            margin: 0 0 24px;
            text-align: center;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .toolbar {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;

            background: var(--column-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 12px;

            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            transition: background 0.3s ease, border-color 0.3s ease;
        }

        .toolbar .spacer {
            flex: 1 1 auto;
            min-width: 8px;
        }

        main {
            padding: 20px 32px 40px;
        }
    </style>
</head>
<body>

    <div class="page">
        <h1>TaskBoard</h1>

        <div class="toolbar">
            <task-form></task-form>
            <div class="spacer"></div>
            <task-search></task-search>
            <theme-toggle></theme-toggle>
        </div>
    </div>

    <main>
        <kanban-board></kanban-board>
    </main>

</body>
</html>
