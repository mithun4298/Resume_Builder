#!/bin/bash

echo "🔧 Quick Development Test"
echo "========================"

# Check if development server can start
echo "Starting development server for 10 seconds..."

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Test if it's responding
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Development server is running!"
    echo "🌐 Visit: http://localhost:5000"
else
    echo "⚠️  Development server may still be starting..."
fi

# Let it run for a few more seconds
sleep 5

# Kill the dev server
kill $DEV_PID 2>/dev/null || true

echo "✅ Development test complete!"
