package main

import (
	"fmt"
	"time"
	"runtime"

	"shortener/middleware"
	"shortener/routes"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {
	app := fiber.New(fiber.Config{
		AppName:      "URL Shortener API",
		Concurrency:  256 * runtime.NumCPU(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		BodyLimit: 1 * 1024,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
	}))

	app.Use(middleware.RateLimitMiddleware)

	// Routes
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Welcome to the URL Shortener API!")
	})

	app.Post("/shorten", routes.ShortenURLHandler)
	app.Get("/:shortID", routes.RedirectHandler)

	fmt.Println("Server running on :8080")
	if err := app.Listen(":8080"); err != nil {
		fmt.Println("Server error:", err)
	}
}
