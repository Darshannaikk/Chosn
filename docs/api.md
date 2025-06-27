# Chosn Platform API Documentation

## Authentication

All API routes require authentication via Supabase JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Endpoints

### Health Check
```
GET /api/health
Response: { "status": "ok", "timestamp": "2024-01-01T00:00:00Z" }
```

### Authentication
```
POST /api/auth/signup
Body: { "email": "string", "password": "string", "user_type": "developer|recruiter" }

POST /api/auth/login  
Body: { "email": "string", "password": "string" }

POST /api/auth/logout
```

### User Management
```
GET /api/users/profile
PUT /api/users/profile
Body: { "name": "string", "bio": "string", "skills": ["array"] }

GET /api/users/github
POST /api/users/github/connect
```

### Matching
```
GET /api/matches
POST /api/matches/interest
Body: { "user_id": "string", "interested": boolean }
```

### Messaging
```
GET /api/messages
POST /api/messages
Body: { "recipient_id": "string", "content": "string" }
```

### Payments (Stripe)
```
POST /api/stripe/create-checkout-session
Body: { "price_id": "string", "success_url": "string", "cancel_url": "string" }

POST /api/stripe/webhook
```

## Error Responses

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details"
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per authenticated user 