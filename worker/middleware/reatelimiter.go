package middleware

import (
	"encoding/json"
	"net/http"
	store "shortener/store"
	req "shortener/utils"
)

func RateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !store.Limiter.Allow() {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(req.ErrorResponse{Error: "Too Many Requests"})
			return
		}
		next.ServeHTTP(w, r)
	})
}
