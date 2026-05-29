package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	
	http.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		
		fmt.Fprintf(w, "Webhook Sandbox is Running! 🚀")
	})

	
	port := ":3000"
	fmt.Printf("⚡ Server is starting on http://localhost%s\n", port)

	
	err := http.ListenAndServe(port, nil)
	
	
	if err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}