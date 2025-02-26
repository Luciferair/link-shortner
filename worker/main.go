package main

import (
	"fmt"
	"math/rand"
	"net/http"
	middleware "shortener/middleware"
	routes "shortener/routes"
	"time"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	mux := http.NewServeMux()
	mux.Handle("/shorten", corsMiddleware(middleware.RateLimitMiddleware(http.HandlerFunc(routes.ShortenURLHandler))))
	mux.Handle("/", corsMiddleware(middleware.RateLimitMiddleware(http.HandlerFunc(routes.RedirectHandler))))

	fmt.Println("Server running on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		fmt.Println("Server error:", err)
	}
}
