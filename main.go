package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)


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

	port := ":3000"
	fmt.Printf("⚡ Server is starting on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}