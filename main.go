package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	
	http.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Webhook Sandbox is Running! 🚀")
	})

	
	http.HandleFunc("/api/send", func(w http.ResponseWriter, r *http.Request) {
		
		
		targetURL := "https://webhook.site/8e998c20-411f-4c19-bc2b-9017e2ea5290"

		
		payload := map[string]string{
			"order_id":       "ORD-505",
			"status":         "SUCCESS",
			"amount":         "1500.00",
			"gateway_ref":    "PAY-998877",
		}

		
		jsonData, err := json.Marshal(payload)
		if err != nil {
			http.Error(w, "Failed to create JSON", http.StatusInternalServerError)
			return
		}

		
		resp, err := http.Post(targetURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			http.Error(w, "Failed to send webhook", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close() 

		
		fmt.Fprintf(w, "✅ Webhook sent successfully!\nTarget Status Code: %d", resp.StatusCode)
	})

	port := ":3000"
	fmt.Printf("⚡ Server is starting on http://localhost%s\n", port)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}