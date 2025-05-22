// lib/websocket.js

export const createUserWebSocket = (onMessage) => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
  
    const ws = new WebSocket(`ws://localhost:8000/ws/company-dashboard/updates?token=${token}`);
  
    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onerror = (e) => console.error("❌ WebSocket error:", e);
    ws.onclose = () => console.log("❎ WebSocket disconnected");
  
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        onMessage?.(message); // call the provided handler
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };
  
    return ws;
  };
  