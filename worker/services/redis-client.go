package services

import (
	"context"
	"log"
	"os"
	"time"
	"github.com/redis/go-redis/v9"
)

var (
	Ctx    = context.Background()
	Client *redis.Client
)

func InitRedis() {

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		log.Fatal("REDIS_URL is not set")
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Invalid REDIS_URL: %v", err)
	}

	opt.PoolSize = 10
	opt.MinIdleConns = 1                 
	opt.ConnMaxIdleTime = 5 * time.Minute 

	Client = redis.NewClient(opt)

	log.Println("Redis client initialized with max 10 connections")
}
