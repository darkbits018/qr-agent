import json

def broadcast_cart_update(group_id, payload):
    """Send JSON data to all connected clients in the group."""
    if str(group_id) in group_connections:
        for ws in group_connections[str(group_id)]:
            if not ws.closed:
                try:
                    ws.send(json.dumps(payload))
                except Exception as e:
                    print(f"Error sending over WebSocket: {e}")


# Inside your main app or in a separate module
group_connections = {}  # Global dict to store group_id -> [websockets]


def register_sockets(sockets):
    @sockets.route('/ws')
    def handle_websocket(ws):
        try:
            # First message is group_id
            group_id = ws.receive()
            if not group_id:
                ws.close()
                return

            # Add connection to group
            group_connections.setdefault(group_id, []).append(ws)

            while not ws.closed:
                msg = ws.receive()  # Optional: listen for messages
                # You can use this to acknowledge receipt or send heartbeats

        except Exception as e:
            print(f"WebSocket error: {e}")
        finally:
            # Remove connection when closed
            if group_id in group_connections:
                group_connections[group_id] = [conn for conn in group_connections[group_id] if conn != ws]
