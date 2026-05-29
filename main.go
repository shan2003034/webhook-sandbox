package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"time"
)

//go:embed frontend/dist/*
var frontendFiles embed.FS

type WebhookPayload struct {
	TargetURL string `json:"target_url"`
	OrderID   string `json:"order_id"`
	Amount    string `json:"amount"`
	Status    string `json:"status"`
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}


func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Printf("Failed to open browser: %v", err)
	}
}

func main() {
	
	http.HandleFunc("/api/send", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)
		if r.Method == "OPTIONS" {
			return
		}

		var payload WebhookPayload
		err := json.NewDecoder(r.Body).Decode(&payload)
		if err != nil {
			http.Error(w, "Invalid JSON data", http.StatusBadRequest)
			return
		}

		targetURL := payload.TargetURL
		jsonData, _ := json.Marshal(payload)
		resp, err := http.Post(targetURL, "application/json", bytes.NewBuffer(jsonData))
		
		if err != nil {
			http.Error(w, "Failed to send webhook. Check your Target URL.", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message": "Webhook sent successfully!", "status": %d}`, resp.StatusCode)
	})

	
	http.HandleFunc("/api/shutdown", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)
		if r.Method == "OPTIONS" {
			return
		}
		
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"message": "Server is shutting down..."}`)
		
		
		go func() {
			time.Sleep(1 * time.Second)
			os.Exit(0)
		}()
	})

	
	distFS, err := fs.Sub(frontendFiles, "frontend/dist")
	if err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.FileServer(http.FS(distFS)))

	port := ":3000"
	fmt.Printf("🚀 Webhook Sandbox is running!\n")
	fmt.Printf("👉 Server started on http://localhost%s\n", port)
	
	
	go func() {
		time.Sleep(1 * time.Second)
		openBrowser("http://localhost" + port)
	}()

	log.Fatal(http.ListenAndServe(port, nil))
}