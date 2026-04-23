package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync/atomic"
	"time"
)

func main() {
	port := flag.Int("port", 8765, "port to listen on")
	logPath := flag.String("log", "cnw-log-server.log", "path to log file (truncated on startup)")
	flag.Parse()

	f, err := os.OpenFile(*logPath, os.O_CREATE|os.O_TRUNC|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		log.Fatalf("open log %s: %v", *logPath, err)
	}
	defer f.Close()

	out := io.MultiWriter(os.Stdout, f)
	logger := log.New(out, "", log.LstdFlags|log.Lmicroseconds)

	var counter uint64

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		id := atomic.AddUint64(&counter, 1)

		body, _ := io.ReadAll(r.Body)
		r.Body.Close()

		var sb strings.Builder
		fmt.Fprintf(&sb, "\n=== req #%d  %s  %s %s  from=%s  ct=%s  len=%d ===\n",
			id, time.Now().Format(time.RFC3339Nano), r.Method, r.URL.RequestURI(),
			r.RemoteAddr, r.Header.Get("Content-Type"), len(body))

		keys := make([]string, 0, len(r.Header))
		for k := range r.Header {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			for _, v := range r.Header[k] {
				fmt.Fprintf(&sb, "  %s: %s\n", k, v)
			}
		}

		if len(body) > 0 {
			if strings.Contains(r.Header.Get("Content-Type"), "json") {
				var pretty bytes.Buffer
				if err := json.Indent(&pretty, body, "  ", "  "); err == nil {
					fmt.Fprintf(&sb, "  body (json):\n  %s\n", pretty.String())
				} else {
					fmt.Fprintf(&sb, "  body (raw): %s\n", string(body))
				}
			} else {
				fmt.Fprintf(&sb, "  body: %s\n", string(body))
			}
		}

		logger.Print(sb.String())

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{}`))
	})

	addr := fmt.Sprintf(":%d", *port)
	logger.Printf("cnw-log-server listening on http://localhost%s  log=%s", addr, *logPath)
	logger.Printf("usage: NX_CLOUD_API=http://localhost%s <your-command>", addr)

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server: %v", err)
	}
}
