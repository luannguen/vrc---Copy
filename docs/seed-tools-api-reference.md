# Seed Tools API Reference

## Overview
The Seed Tools API endpoint provides functionality to seed tools data into the database. This endpoint follows the same pattern as other seeding endpoints in the application.

## Endpoint
- **URL**: `/api/seed-tools`
- **Methods**: `GET`, `POST`
- **Environment**: Development only (blocked in production)

## Features
- **Production Protection**: Automatically blocks seeding operations in production environment
- **Existing Data Handling**: Clears existing tools before seeding new data
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Logging**: Console logging for monitoring seeding progress

## Request Examples

### GET Request
```bash
curl -X GET http://localhost:3000/api/seed-tools
```

### POST Request
```bash
curl -X POST http://localhost:3000/api/seed-tools
```

## Response Examples

### Success Response
```json
{
  "message": "Tools seeding completed successfully"
}
```

### Production Environment Error
```json
{
  "error": "Seeding is not allowed in production"
}
```

### Error Response
```json
{
  "error": "Tools seeding failed",
  "details": "Detailed error message here"
}
```

## Implementation Details

### Dependencies
- Uses `getPayload` from Payload CMS for database operations
- Imports `seedTools` function from `/seed/seed-tools.ts`
- Uses Next.js App Router pattern with `route.ts` file

### Security
- **Environment Check**: Prevents execution in production environment
- **HTTP Status Codes**: 
  - `200`: Success
  - `403`: Forbidden (production environment)
  - `500`: Server error

### Data Flow
1. Check environment (block if production)
2. Initialize Payload CMS instance
3. Call `seedTools(payload)` function
4. Return success/error response

## Related Files
- **Main Implementation**: `/src/app/api/seed-tools/route.ts`
- **Seeding Logic**: `/src/seed/seed-tools.ts`
- **Configuration**: `/payload.config.ts`

## Usage Notes
- This endpoint is intended for development and testing purposes only
- The seeding operation will clear existing tools before adding new ones
- Both GET and POST methods perform the same operation for convenience
- The endpoint follows the same pattern as other seed endpoints in the application
