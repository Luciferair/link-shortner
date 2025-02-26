package store

import (
	"golang.org/x/time/rate"
	"sync"
)

var (
	UrlStore = make(map[string]string)
	Mu       sync.Mutex
	Limiter  = rate.NewLimiter(1, 5)
)
