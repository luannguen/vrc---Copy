# Event Registration System Implementation - Complete Guide

## Overview
This document provides a comprehensive guide for the Event Registration System implemented in the VRC project. The system allows users to register for events through the frontend and provides admin management through the Payload CMS backend.

## System Architecture

### Backend Components

#### 1. EventRegistrations Collection
**Location**: `backend/src/collections/EventRegistrations.ts`

**Features**:
- 18 comprehensive fields for registration data
- Admin dashboard integration
- Access control (public create, admin read/update/delete)
- Automatic timestamps and validation
- Group organization under "Sự kiện" (Events)

**Key Fields**:
- **Personal Info**: fullName, email, phone, organization, jobTitle
- **Event Details**: eventId, eventTitle, participationType
- **Preferences**: dietaryRequirements, accessibilityNeeds
- **Status Tracking**: status, registrationDate, confirmationDate
- **Admin Fields**: internalNotes, adminApproved
- **Consent**: marketingConsent, privacyConsent

#### 2. API Endpoints
**Base Route**: `/api/event-registrations`

**Endpoints**:
- `POST /api/event-registrations` - Create new registration
- `GET /api/event-registrations` - List all registrations (admin only)
- `GET /api/event-registrations/[id]` - Get specific registration
- `PATCH /api/event-registrations/[id]` - Update registration
- `DELETE /api/event-registrations/[id]` - Delete registration
- `POST /api/event-registrations/[id]/confirm` - Send confirmation email

**Features**:
- Duplicate registration prevention (email + eventId combination)
- Email confirmation workflow
- Status management (pending → confirmed)
- Comprehensive error handling
- Vietnamese language support

#### 3. Admin Dashboard Component
**Location**: `backend/src/components/admin/EventRegistrationDashboard.tsx`

**Features**:
- Real-time registration statistics
- Participation type breakdown
- Recent registrations list
- Quick action buttons (approve, email, delete)
- CSV export functionality
- Responsive design with professional styling

#### 4. Form Seeding System
**Files**:
- `backend/src/seed/forms.ts` - Form definition
- `backend/src/scripts/seed-forms.js` - Seeding script
- `backend/package.json` - Added `seed:forms` script

**Usage**:
```bash
cd backend
npm run seed:forms
```

### Frontend Components

#### 1. Event Registration Form
**Location**: `vrcfrontend/src/components/EventRegistrationForm.tsx`

**Features**:
- Clean, modern UI with shadcn/ui components
- Multi-step form validation
- Real-time form validation
- Toast notifications for user feedback
- Success state with confirmation message
- Accessibility support
- Responsive design

**Form Sections**:
- Personal Information (required: name, email, phone)
- Professional Details (optional: organization, job title)
- Participation Type (radio buttons: in-person, online, hybrid)
- Special Requirements (dietary, accessibility)
- Consent Checkboxes (marketing, privacy policy)

#### 2. Event Detail Page Integration
**Location**: `vrcfrontend/src/pages/EventDetail.tsx`

**Integration**:
- Registration form added to sidebar
- Seamless integration with existing event display
- Event context passed to form (eventId, eventTitle)
- Success callback for post-registration actions

#### 3. API Service Layer
**Location**: `vrcfrontend/src/services/eventRegistrationApi.ts`

**Features**:
- TypeScript interfaces for type safety
- Centralized API calls
- Error handling
- RESTful service methods
- Easy to extend and maintain

## Configuration

### Backend Configuration

#### 1. Payload Config
**File**: `backend/src/payload.config.ts`
- EventRegistrations collection imported and configured
- Admin dashboard component registered

#### 2. Environment Variables
Create `.env` file in backend directory:
```env
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=your-database-connection-string
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

### Frontend Configuration

#### 1. Vite Proxy Configuration
**File**: `vrcfrontend/vite.config.ts`
- Proxy configured for `/api` requests to backend
- Environment variable support for API URL

#### 2. Environment Variables
Create `.env` file in vrcfrontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

## Usage Instructions

### For Administrators

#### 1. Access Admin Dashboard
1. Navigate to Payload admin panel: `http://localhost:3000/admin`
2. Login with admin credentials
3. Go to "Sự kiện" → "Event Registrations"
4. View dashboard with statistics and recent registrations

#### 2. Manage Registrations
- **View Details**: Click on any registration to see full details
- **Update Status**: Change registration status (pending/confirmed/cancelled)
- **Add Notes**: Use internal notes for admin communication
- **Export Data**: Use CSV export for reporting
- **Send Emails**: Manually trigger confirmation emails

#### 3. Seed Event Registration Form
```bash
cd backend
npm run seed:forms
```

### For End Users

#### 1. Event Registration Process
1. Navigate to event details page: `/event-details/[id]`
2. Scroll to registration form in sidebar
3. Fill out required information:
   - Full name, email, phone (required)
   - Organization and job title (optional)
   - Participation type preference
   - Special requirements
4. Accept privacy policy (required)
5. Submit registration
6. Check email for confirmation

#### 2. Registration Confirmation
- Automatic email sent upon registration
- Email contains registration details
- Follow email instructions to confirm attendance

## Development Guide

### Adding New Fields

#### Backend
1. Update `EventRegistrations.ts` collection
2. Add field to TypeScript interfaces
3. Update API validation if needed
4. Test with seed data

#### Frontend
1. Update form component with new field
2. Add to TypeScript interfaces in service
3. Update validation logic
4. Test user experience

### Customizing Email Templates
**Location**: `backend/src/app/(payload)/api/event-registrations/[id]/confirm/route.ts`

1. Modify HTML template in confirmation email
2. Add dynamic content using registration data
3. Style with inline CSS for email compatibility
4. Test across different email clients

### Adding New API Endpoints
1. Create new route file in `backend/src/app/(payload)/api/event-registrations/`
2. Follow existing patterns for error handling
3. Add TypeScript types
4. Update frontend service
5. Add appropriate tests

## Testing

### Manual Testing Checklist

#### Registration Flow
- [ ] Form validation works for required fields
- [ ] Email format validation
- [ ] Duplicate registration prevention
- [ ] Success message displays
- [ ] Email confirmation sent
- [ ] Admin dashboard updates

#### Admin Management
- [ ] Dashboard statistics accurate
- [ ] Registration list displays correctly
- [ ] Edit/update functionality works
- [ ] Delete confirmation works
- [ ] CSV export contains correct data
- [ ] Email sending works

#### Error Handling
- [ ] Network errors handled gracefully
- [ ] Server errors display user-friendly messages
- [ ] Form validation prevents invalid submissions
- [ ] Loading states work correctly

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Create registration
curl -X POST http://localhost:3000/api/event-registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "0901234567",
    "eventId": "1",
    "eventTitle": "Test Event",
    "participationType": "in-person",
    "privacyConsent": true
  }'

# Get registrations
curl http://localhost:3000/api/event-registrations

# Get specific registration
curl http://localhost:3000/api/event-registrations/[id]
```

## Deployment

### Production Checklist

#### Backend
- [ ] Set production environment variables
- [ ] Configure database connection
- [ ] Set up email service (SMTP)
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up backup strategy

#### Frontend
- [ ] Update API URLs for production
- [ ] Build production bundle
- [ ] Configure web server
- [ ] Set up SSL certificate
- [ ] Test registration flow in production

### Environment Variables for Production

#### Backend
```env
NODE_ENV=production
PAYLOAD_SECRET=your-production-secret
DATABASE_URI=your-production-db
SMTP_HOST=your-production-smtp
SMTP_PORT=587
SMTP_USER=your-production-email
SMTP_PASS=your-production-password
CORS_ORIGINS=https://your-domain.com
```

#### Frontend
```env
VITE_API_URL=https://your-api-domain.com/api
NODE_ENV=production
```

## Maintenance

### Regular Tasks
1. **Database Backup**: Regular backups of registration data
2. **Email Monitoring**: Monitor email delivery rates
3. **Performance Review**: Check API response times
4. **Data Cleanup**: Archive old registrations
5. **Security Updates**: Keep dependencies updated

### Monitoring
- Monitor registration success rates
- Track email delivery success
- Monitor API error rates
- Check database performance
- Review user feedback

## Support

### Common Issues

#### Registration Not Working
1. Check backend server is running
2. Verify API proxy configuration
3. Check browser console for errors
4. Verify database connection
5. Check email service configuration

#### Email Not Sending
1. Verify SMTP configuration
2. Check email service credentials
3. Review spam folder
4. Check email template formatting
5. Monitor email service logs

#### Admin Dashboard Issues
1. Clear browser cache
2. Check admin authentication
3. Verify component imports
4. Review browser console errors
5. Check database permissions

### Getting Help
- Check browser developer tools console
- Review server logs
- Verify environment variables
- Test API endpoints directly
- Check database connection status

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Bulk approve/reject registrations
2. **Email Templates**: Customizable email templates
3. **Registration Limits**: Event capacity management
4. **Payment Integration**: Paid event registration
5. **Calendar Integration**: iCal/Outlook calendar exports
6. **Mobile App**: React Native mobile application
7. **Analytics**: Registration analytics and reporting
8. **Multilingual**: Additional language support

### API Enhancements
1. **Pagination**: Large dataset pagination
2. **Filtering**: Advanced filtering options
3. **Search**: Full-text search capability
4. **Sorting**: Multiple sorting options
5. **Rate Limiting**: API usage limits
6. **Webhooks**: Event-driven notifications

This completes the comprehensive Event Registration System implementation for the VRC project.
