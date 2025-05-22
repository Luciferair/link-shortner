package main

import (
	"fmt"
	"runtime"
	"time"

	"shortener/middleware"
	"shortener/routes"

	"github.com/joho/godotenv"

	"shortener/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func init() {
	if err := godotenv.Load(); err != nil {
		if err := godotenv.Load("../.env"); err != nil {
			fmt.Println("Error loading .env file:", err)
		}
	}
}

func main() {
	services.InitRedis()

	app := fiber.New(fiber.Config{
		AppName:       "URL Shortener API",
		Concurrency:   256 * runtime.NumCPU(),
		ReadTimeout:   5 * time.Second,
		WriteTimeout:  5 * time.Second,
		BodyLimit:     1 * 1024 * 1024,
		Prefork:       true,
		StrictRouting: true,
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Content-Type",
	}))

	app.Use(middleware.RedisRateLimitMiddleware)

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to the URL Shortener API",
		})
	})

	app.Post("/shorten", routes.ShortenURLHandler)
	app.Get("/:shortID", routes.RedirectHandler)
	app.Post("/status", routes.SystemStatusHandler)

	// Start server
	fmt.Println("Server running on :8080")
	if err := app.Listen(":8080"); err != nil {
		fmt.Println("Server error:", err)
	}
}
