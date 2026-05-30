# 🚀 Webhook Sandbox - Local Development Tool

<div align="center">
  <img width="2752" height="1536" alt="Image" src="https://github.com/user-attachments/assets/f230eec5-0c3b-422c-9e69-6a4491b72e24" />
</div>

Welcome to the **Webhook Sandbox** repository. This is a powerful, standalone local development tool designed to help developers simulate and test webhooks (like Payment Gateway success/failure callbacks) entirely on localhost without needing internet exposure or tunneling tools like ngrok.

## 📸 Application Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img width="1920" height="912" alt="Image" src="https://github.com/user-attachments/assets/211bf79b-9ae1-4a3d-817c-adfb18f21f27" />
        <br><b>Modern Glassmorphism Dashboard</b>
      </td>
      <td align="center">
        <img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/69748946-74b9-4465-a95a-9304e5ab1d81" />
        <br><b>Target Backend Receiving Data</b>
      </td>
    </tr>
   
  </table>
</div>

## ✨ Key Features

* **Standalone Executable:** Built with Go and `go:embed`, the entire application (Backend + Frontend) runs as a single `.exe` file with zero external dependencies.
* **Local Webhook Simulation:** Easily simulate complex third-party callbacks (e.g., PayHere, Stripe) directly to your local backend API (Spring Boot, Node.js, etc.).
* **Dynamic Scenarios:** Test different edge cases instantly by toggling between `SUCCESS`, `FAILED`, and `PENDING` payment statuses.
* **Persistent History:** Automatically logs all sent webhooks and their target HTTP status codes, saving them locally so you never lose your testing history.
* **Modern UI/UX:** A clean, responsive interface built with React, featuring glassmorphism design, floating input labels, and dynamic color-coded status indicators.
* **Auto-Launch & Graceful Shutdown:** Automatically opens the default web browser upon startup and includes a safe shutdown mechanism directly from the UI.

## 💻 Tech Stack

* **Core Engine (Backend):** Go (Golang)
* **Frontend Framework:** React.js (TypeScript) via Vite
* **Styling:** Custom CSS (Glassmorphism & Modern Animations)
* **Packaging Tooling:** `go:embed` (File bundling), `go-winres` (Executable icon embedding)

## 🛠️ Installation & Setup

You can run the Webhook Sandbox either by downloading the pre-compiled executable or by building it from the source.

### Option 1: Quick Start (Recommended)

1. Go to the Releases tab of this repository.
2. Download the latest `webhook-sandbox.exe` file.
3. Double-click the file to run. It will automatically open the dashboard in your default browser at `http://localhost:3000`.

### Option 2: Build from Source

Follow these steps to compile the tool yourself. Ensure you have **Go** and **Node.js** installed on your machine. Run the following commands sequentially in your terminal:

```bash
# 1. Clone the repository
git clone https://github.com/shan2003034/webhook-sandbox
cd webhook-sandbox

# 2. Build the React Frontend
cd frontend
npm install
npm run build
cd ..

# 3. Compile the Go Executable (To include a custom icon on Windows, run 'go-winres make' before building)
go build -a -o webhook-sandbox.exe main.go
```
**4. Run the Application**
Execute the generated webhook-sandbox.exe file to start the sandbox environment.

👨‍💻 Author
Prasanna Lakshan

🌐 Portfolio: https://prasanna-lakshan.vercel.app/

💼 LinkedIn: https://www.linkedin.com/in/prasannalakshan

💻 GitHub: https://github.com/shan2003034
