 Here’s a **detailed step-by-step Markdown guide** on how to fork a repository, make changes locally using a branch, and push them back:

````markdown
# Git Workflow: Fork, Branch, and Push Changes

This guide explains how to fork a repository, work on it locally using branches, and push changes back to your fork or main repository.

---

## 1. Fork the Repository

1. Go to the GitHub repository you want to contribute to.
2. Click the **Fork** button at the top-right corner.
3. GitHub will create a copy of the repository under your account.

---

## 2. Clone Your Fork Locally

1. Go to your forked repository on GitHub.
2. Click the **Code** button and copy the HTTPS or SSH link.
3. Open a terminal and clone it locally:

```bash
git clone <your-fork-url>
````

4. Navigate to the project folder:

```bash
cd <repository-folder>
```

---

## 3. Set Up the Original Repository as a Remote (Optional but Recommended)

This lets you pull future updates from the original repository:

```bash
git remote add upstream <original-repo-url>
```

Check your remotes:

```bash
git remote -v
```

You should see `origin` (your fork) and `upstream` (original repo).

---

## 4. Create a New Branch

Always create a new branch for your changes instead of working on `main`:

```bash
git checkout -b feature/my-new-feature
```

* `feature/my-new-feature` can be any descriptive name for your branch.

---

## 5. Make Changes Locally

1. Edit files or add new files as needed.
2. Check the status of your changes:

```bash
git status
```

3. Stage your changes for commit:

```bash
git add .
```

or stage specific files:

```bash
git add path/to/file.js
```

4. Commit your changes with a descriptive message:

```bash
git commit -m "Add feature X and fix bug Y"
```

---

## 6. Push Your Branch to Your Fork

```bash
git push origin feature/my-new-feature
```

* This will push your branch to your fork on GitHub.

---

## 7. Create a Pull Request (PR)

1. Go to your forked repository on GitHub.
2. Click **Compare & pull request** next to your branch.
3. Write a descriptive title and explanation of your changes.
4. Submit the pull request to the **main branch** of the original repository.

---

## 8. Sync Your Fork with Original Repository (Optional)

If the original repository has new updates, you can sync your fork:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 9. Summary Workflow

```text
Fork repo → Clone locally → Create branch → Make changes → Commit → Push → Pull Request
```

✅ Following this workflow keeps your local repo clean and allows safe collaboration.

```

I can also create a **visual diagram showing the flow** (fork → branch → commit → PR → merge) in Markdown for clarity if you want.  

Do you want me to do that?
```
