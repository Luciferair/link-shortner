package store

import (
	"time"

	"github.com/allegro/bigcache/v3"
)

var (
	Cache   *bigcache.BigCache
)

func init() {
	config := bigcache.Config{
		Shards:       1024,
		LifeWindow:   48 * time.Hour,
		CleanWindow:  5 * time.Minute,
		MaxEntrySize: 256,
		Verbose:      false,
	}

	var err error
	Cache, err = bigcache.NewBigCache(config)
	if err != nil {
		panic(err)
	}
}

func SetURL(key, url string) error {
	return Cache.Set(key, []byte(url))
}

func GetURL(key string) (string, error) {
	entry, err := Cache.Get(key)
	if err != nil {
		return "", err
	}
	return string(entry), nil
}
