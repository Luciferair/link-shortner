package utils

type ErrorResponse struct {
	Error string `json:"error"`
}

type ShortenRequest struct {
	URL string `json:"url"`
}

type ShortenResponse struct {
	ShortURL string `json:"short_url"`
}
