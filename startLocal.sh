#!/bin/bash

# Start the database in Docker Compose
echo "Starting database..."
docker-compose -f docker-compose.dev.yml up database -d

# Give database a few seconds to initialize (optional, adjust time if needed)
# sleep 5

kill_port() {
  PORT=$1
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo "Killing process on port $PORT (PID: $PID)"
    kill -9 $PID
  else
    echo "No process found running on port $PORT"
  fi
}

# Clean up ports 3000 and 4000 if they are in use
kill_port 3000
kill_port 4000

# Start backend in a new iTerm tab
echo "Starting backend..."
osascript <<EOF
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session to write text "cd $(pwd)/src/backend && npm run dev"
    end tell
end tell
EOF

# Start frontend in a new iTerm tab
echo "Starting frontend..."
osascript <<EOF
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session to write text "cd $(pwd)/src/frontend && npm run dev"
    end tell
end tell
EOF


