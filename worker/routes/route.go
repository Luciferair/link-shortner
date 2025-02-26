package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	store "shortener/store"
	reqs "shortener/utils"
)

func ShortenURLHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(reqs.ErrorResponse{Error: "Invalid request method"})
		return
	}

	var req reqs.ShortenRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(reqs.ErrorResponse{Error: "Invalid JSON body"})
		return
	}

	if req.URL == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(reqs.ErrorResponse{Error: "Missing URL parameter"})
		return
	}

	shortID := reqs.GenerateShortID()
	store.Mu.Lock()
	store.UrlStore[shortID] = req.URL
	store.Mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reqs.ShortenResponse{
		ShortURL: fmt.Sprintf("http://localhost:8080/%s", shortID),
	})
}

func RedirectHandler(w http.ResponseWriter, r *http.Request) {
	shortID := r.URL.Path[1:]

	store.Mu.Lock()
	longURL, exists := store.UrlStore[shortID]
	store.Mu.Unlock()

	if !exists {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(reqs.ErrorResponse{Error: "Short URL not found"})
		return
	}
	http.Redirect(w, r, longURL, http.StatusFound)
}
